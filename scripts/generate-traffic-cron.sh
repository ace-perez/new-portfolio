#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# generate-traffic-cron.sh
#
# Thin wrapper called by cron every 2 hours.
# Runs the main traffic generator for 5 minutes (300 seconds).
#
# To install the cron job, run:
#   crontab -e
# Then add this line:
#   0 */2 * * * /home/ec2-user/new-portfolio/scripts/generate-traffic-cron.sh >> /home/ec2-user/traffic-gen.log 2>&1
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== [$(date)] Cron traffic run starting ==="
bash "${SCRIPT_DIR}/generate-traffic.sh" 300 "https://ace-perez-portfolio.dev"
echo "=== [$(date)] Cron traffic run complete ==="
