#!/usr/bin/env bash
# =============================================================================
# bootstrap.sh — Fresh EC2 setup for ace-perez-portfolio.dev
#
# Run once on a brand new Amazon Linux 2023 instance:
#   bash <(curl -s https://raw.githubusercontent.com/ace-perez/new-portfolio/main/scripts/bootstrap.sh)
#
# Steps:
#   1. System update + git
#   2. Docker + Docker Compose v2 + buildx
#   3. Swap file (1 GB) — prevents OOM kills on t3.micro
#   4. Protect sshd from OOM killer
#   5. Disable ghost services (MySQL, Apache, old installs)
#   6. Clone repo
#   7. Systemd unit for auto-start on reboot
#   8. First deploy
# =============================================================================

set -euo pipefail

REPO_URL="https://github.com/ace-perez/new-portfolio.git"
APP_DIR="$HOME/new-portfolio"
SERVICE_NAME="portfolio"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()    { echo -e "${GREEN}[bootstrap]${NC} $*"; }
warn()    { echo -e "${YELLOW}[warning]${NC}  $*"; }
section() { echo -e "\n${GREEN}══════════════════════════════════════════${NC}"; \
            echo -e "${GREEN}  $*${NC}"; \
            echo -e "${GREEN}══════════════════════════════════════════${NC}"; }

# ── 1. System update ──────────────────────────────────────────────────────────
section "1/8 · System update"
sudo dnf update -y --quiet
sudo dnf install -y git htop --quiet
info "System updated."

# Check IPv6 connectivity to IPv4-only services (like GitHub) and enable DNS64 if needed
if ! curl -s --connect-timeout 4 https://github.com > /dev/null 2>&1; then
  warn "github.com is IPv4-only and unreachable directly via IPv6. Adding Google DNS64 fallback..."
  echo "nameserver 2001:4860:4860::6464" | sudo tee -a /etc/resolv.conf > /dev/null
  echo "nameserver 2001:4860:4860::6400" | sudo tee -a /etc/resolv.conf > /dev/null
fi

# ── 2. Docker ─────────────────────────────────────────────────────────────────
section "2/8 · Docker + Docker Compose v2"
sudo dnf install -y docker --quiet
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"

# Docker Compose v2 + buildx plugins (dynamically detect CPU architecture)
sudo mkdir -p /usr/local/lib/docker/cli-plugins

ARCH=$(uname -m)
case "$ARCH" in
  x86_64)
    COMPOSE_ARCH="x86_64"
    BUILDX_ARCH="amd64"
    ;;
  aarch64|arm64)
    COMPOSE_ARCH="aarch64"
    BUILDX_ARCH="arm64"
    ;;
  *)
    warn "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${COMPOSE_ARCH}" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose

BUILDX_VERSION=$(curl -s https://api.github.com/repos/docker/buildx/releases/latest | grep '"tag_name"' | cut -d'"' -f4)
sudo curl -SL "https://github.com/docker/buildx/releases/download/${BUILDX_VERSION}/buildx-${BUILDX_VERSION}.linux-${BUILDX_ARCH}" \
  -o /usr/local/lib/docker/cli-plugins/docker-buildx

sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose \
               /usr/local/lib/docker/cli-plugins/docker-buildx
info "Docker Compose $(docker compose version --short) + buildx $(docker buildx version) installed for ${ARCH}."

# ── 3. Swap file (1 GB) ───────────────────────────────────────────────────────
section "3/8 · Swap file"
if [ ! -f /swapfile ]; then
  sudo fallocate -l 1G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  info "1 GB swap file created and activated."
else
  warn "Swap file already exists, skipping."
fi

# ── 4. Protect sshd from OOM killer ───────────────────────────────────────────
section "4/8 · Protect sshd from OOM killer"
sudo mkdir -p /etc/systemd/system/sshd.service.d
cat <<'EOF' | sudo tee /etc/systemd/system/sshd.service.d/oom-protect.conf
[Service]
OOMScoreAdjust=-900
EOF
sudo systemctl daemon-reload
info "sshd OOM score set to -900 (last to be killed)."

# ── 5. Disable ghost / unused services ────────────────────────────────────────
section "5/8 · Disabling unused services"
GHOST_SERVICES=("mysqld" "mariadb" "httpd" "postfix" "portfolio" "newrelic-infra")
for svc in "${GHOST_SERVICES[@]}"; do
  if systemctl list-unit-files "${svc}.service" 2>/dev/null | grep -q "${svc}"; then
    sudo systemctl stop    "${svc}.service" 2>/dev/null || true
    sudo systemctl disable "${svc}.service" 2>/dev/null || true
    warn "Disabled: ${svc}"
  fi
done
info "Ghost services cleaned up."

# ── 6. Clone repo ─────────────────────────────────────────────────────────────
section "6/8 · Clone repo"
if [ -d "$APP_DIR" ]; then
  warn "Directory $APP_DIR already exists — pulling latest instead."
  git -C "$APP_DIR" pull
else
  git clone "$REPO_URL" "$APP_DIR"
  info "Repo cloned to $APP_DIR"
fi

# ── 7. Systemd unit for auto-start on reboot ──────────────────────────────────
section "7/8 · Systemd auto-start service"
cat <<EOF | sudo tee /etc/systemd/system/${SERVICE_NAME}.service
[Unit]
Description=Portfolio Docker Compose stack
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/docker compose up -d --build
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=300
Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable "${SERVICE_NAME}.service"
info "Systemd service '${SERVICE_NAME}' enabled (auto-starts on reboot)."

# ── 8. First deploy ───────────────────────────────────────────────────────────
section "8/8 · Deploying stack"
cd "$APP_DIR"
sudo docker compose build --no-cache
sudo docker compose up -d

echo ""
info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
info "Bootstrap complete! Stack is live."
info ""
info "Useful commands:"
info "  docker compose logs -f         # live logs"
info "  docker stats --no-stream       # memory per container"
info "  free -h                        # host memory overview"
info "  systemctl status portfolio     # service health"
info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
