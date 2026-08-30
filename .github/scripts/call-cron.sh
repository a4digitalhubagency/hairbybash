#!/usr/bin/env bash
# Calls one scheduled-job endpoint and fails loudly on anything short of a
# clean run. Written because the first live run went green while doing nothing:
# the apex domain 307'd to www, curl did not follow, and --fail-with-body only
# trips on 4xx/5xx — so "Redirecting..." was treated as success.
set -uo pipefail

endpoint="$1"
url="${APP_URL%/}/api/cron/${endpoint}"
body_file="$(mktemp)"

status=$(curl -sS --max-time 60 -o "$body_file" -w '%{http_code}' \
  -H "Authorization: Bearer ${CRON_SECRET}" "$url")
body="$(cat "$body_file")"
rm -f "$body_file"

# An error page is a whole HTML document; printing it buries the diagnosis.
case "$body" in
  '{'*) echo "$body" ;;
  *)    printf '%.200s\n' "$body" ;;
esac

case "$status" in
  200) ;;
  30*)
    location=$(curl -sS -o /dev/null -w '%{redirect_url}' \
      -H "Authorization: Bearer ${CRON_SECRET}" "$url")
    echo "::error::$url redirected (HTTP $status) to ${location:-unknown}."
    echo "::error::Set APP_URL to the canonical host. Following the redirect is not"
    echo "::error::an option: curl drops the Authorization header across hosts, so the"
    echo "::error::request would arrive unauthenticated."
    exit 1 ;;
  401)
    echo "::error::401 — CRON_SECRET in GitHub does not match the one set in Vercel."
    exit 1 ;;
  404)
    echo "::error::404 — no /api/cron/${endpoint} at $APP_URL."
    echo "::error::The live deployment predates this route. Check Vercel has finished"
    echo "::error::deploying the current default branch."
    exit 1 ;;
  500)
    echo "::error::500 — the app refused to run the job. Usually CRON_SECRET is unset in Vercel."
    exit 1 ;;
  *)
    echo "::error::Unexpected HTTP $status from $url"
    exit 1 ;;
esac

# A 200 is not success on its own. The reminder handler reports per-booking
# failures in its body and still returns 200, so a broken mail pipeline would
# otherwise show a row of green ticks for weeks.
case "$body" in
  '{'*) ;;
  *) echo "::error::Expected JSON, got: ${body:0:120}"; exit 1 ;;
esac

failed=$(printf '%s' "$body" | sed -n 's/.*"failed":\([0-9]*\).*/\1/p')
if [ -n "$failed" ] && [ "$failed" -gt 0 ]; then
  echo "::error::${failed} booking(s) failed to send. See the Vercel function logs."
  exit 1
fi
