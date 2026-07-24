#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# generate-traffic.sh
#
# Generates synthetic API traffic against the portfolio API to produce
# meaningful data in New Relic APM.
#
# Usage:
#   ./generate-traffic.sh [duration_seconds] [base_url]
#
# Defaults:
#   duration = 600 (10 minutes — for manual runs)
#   base_url = https://ace-perez-portfolio.dev
#
# The cron version (generate-traffic-cron.sh) calls this with 300 seconds.
# ─────────────────────────────────────────────────────────────────────────────

DURATION="${1:-600}"
BASE_URL="${2:-https://ace-perez-portfolio.dev}"
API="${BASE_URL}/api"
END_TIME=$(( $(date +%s) + DURATION ))

echo "[traffic-gen] Starting traffic generation for ${DURATION}s against ${BASE_URL}"
echo "[traffic-gen] Will stop at $(date -d @${END_TIME} 2>/dev/null || date -r ${END_TIME})"

# Array of public endpoints to hit
PUBLIC_ENDPOINTS=(
  "/health"
  "/posts"
)

# Counter for logging
REQ_COUNT=0

while [ "$(date +%s)" -lt "$END_TIME" ]; do

  # ── 1. Health check ────────────────────────────────────────────────────────
  curl -s -o /dev/null -w "[%{http_code}] GET /api/health\n" "${API}/health"
  REQ_COUNT=$((REQ_COUNT + 1))
  sleep 0.5

  # ── 2. Fetch all public posts ──────────────────────────────────────────────
  POSTS_RESPONSE=$(curl -s -w "\n%{http_code}" "${API}/posts")
  HTTP_CODE=$(echo "$POSTS_RESPONSE" | tail -1)
  BODY=$(echo "$POSTS_RESPONSE" | head -1)
  echo "[${HTTP_CODE}] GET /api/posts"
  REQ_COUNT=$((REQ_COUNT + 1))

  # ── 3. If we got posts back, fetch each one by slug ───────────────────────
  if [ "$HTTP_CODE" = "200" ]; then
    # Extract slugs from JSON using grep+sed (no jq dependency needed)
    SLUGS=$(echo "$BODY" | grep -o '"slug":"[^"]*"' | sed 's/"slug":"//;s/"//')
    for SLUG in $SLUGS; do
      curl -s -o /dev/null -w "[%{http_code}] GET /api/posts/${SLUG}\n" "${API}/posts/${SLUG}"
      REQ_COUNT=$((REQ_COUNT + 1))
      sleep 0.3
    done
  fi

  # ── 4. Simulate a failed login (tests error-path APM tracing) ─────────────
  curl -s -o /dev/null -w "[%{http_code}] POST /api/auth/login (bad creds)\n" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"fake_user","password":"wrong_password"}' \
    "${API}/auth/login"
  REQ_COUNT=$((REQ_COUNT + 1))
  sleep 0.5

  # ── 5. Hit a non-existent endpoint (generates 404 in APM) ─────────────────
  curl -s -o /dev/null -w "[%{http_code}] GET /api/nonexistent\n" "${API}/nonexistent"
  REQ_COUNT=$((REQ_COUNT + 1))

  # Short pause between each full cycle
  sleep 2

done

echo "[traffic-gen] Done! Sent ${REQ_COUNT} requests over ${DURATION}s."
