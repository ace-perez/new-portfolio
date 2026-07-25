#!/usr/bin/env bash
# =============================================================================
# bootstrap.sh — Fresh Amazon Linux 2023 setup for ace-perez-portfolio.dev
# =============================================================================
# Run as ec2-user on a fresh t3.medium instance:
#   chmod +x bootstrap.sh && ./bootstrap.sh
#
# What this does:
#   1. System update + essentials
#   2. Docker + Docker Compose v2
#   3. Swap file (1 GB safety net)
#   4. Protect sshd from OOM killer
#   5. Disable ghost services (MySQL, Apache, old portfolio, duplicate New Relic)
#   6. Clone repo + prompt for .env setup
#   7. Systemd unit for auto-start on reboot
#   8. First deploy
# =============================================================================

set -euo pipefail

REPO_URL="https://github.com/ace-perez/new-portfolio.git"   # ← update if different
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

# ── 2. Docker ─────────────────────────────────────────────────────────────────
section "2/8 · Docker + Docker Compose v2"
sudo dnf install -y docker --quiet
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
info "Docker installed and running."

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

# ── 7. Environment file setup ─────────────────────────────────────────────────
section "7/8 · Environment setup"
ENV_FILE="$APP_DIR/api/.env"
if [ ! -f "$ENV_FILE" ]; then
  info "Creating $ENV_FILE from example..."
  cp "$APP_DIR/api/.env.example" "$ENV_FILE"
  echo ""
  warn "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  warn "ACTION REQUIRED: Fill in secrets in $ENV_FILE"
  warn "  nano $ENV_FILE"
  warn ""
  warn "Required values:"
  warn "  DB_PATH              → /app/data/blog.db"
  warn "  ADMIN_USERNAME       → your admin username"
  warn "  ADMIN_PASSWORD_HASH  → bcrypt hash (see .env.example)"
  warn "  JWT_SECRET           → long random string"
  warn "  ALLOWED_ORIGINS      → https://ace-perez-portfolio.dev"
  warn "  NEW_RELIC_LICENSE_KEY → from New Relic console"
  warn "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  read -rp "Press ENTER once you have saved $ENV_FILE to continue..."
else
  warn ".env already exists — skipping. Verify it is current:"
  warn "  cat $ENV_FILE"
fi

# Persist NEW_RELIC_LICENSE_KEY to /etc/environment for the systemd service
if ! grep -q "NEW_RELIC_LICENSE_KEY" /etc/environment 2>/dev/null; then
  read -rp "Enter your NEW_RELIC_LICENSE_KEY (for docker-compose env): " NR_KEY
  echo "NEW_RELIC_LICENSE_KEY=${NR_KEY}" | sudo tee -a /etc/environment
  export NEW_RELIC_LICENSE_KEY="$NR_KEY"
  info "NEW_RELIC_LICENSE_KEY saved to /etc/environment"
fi

# ── 8. Systemd unit for auto-start on reboot ──────────────────────────────────
section "8/8 · Systemd auto-start service"
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
EnvironmentFile=/etc/environment
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

# ── First deploy ──────────────────────────────────────────────────────────────
section "Deploying stack"
cd "$APP_DIR"
# Apply docker group without requiring re-login
newgrp docker <<'DOCKERCMD'
docker compose build --no-cache
docker compose up -d
DOCKERCMD

echo ""
info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
info "Bootstrap complete! Stack is live."
info ""
info "Useful commands:"
info "  docker compose logs -f         # live logs from all containers"
info "  docker stats --no-stream       # memory per container"
info "  free -h                        # host memory overview"
info "  systemctl status portfolio     # service health"
info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
