#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

PORT="${PORT:-8000}"

echo "[1/4] Checking HTML parse..."
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
HTMLParser().feed(Path('index.html').read_text(encoding='utf-8'))
print('PASS: HTML parsed successfully')
PY

echo "[2/4] Checking JavaScript parse..."
node -e "new Function(require('fs').readFileSync('script.js', 'utf8')); console.log('PASS: JavaScript parsed successfully')"

echo "[3/4] Starting local server on port ${PORT}..."
python3 -m http.server "$PORT" >/tmp/practise-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

echo "[4/4] Checking HTTP response..."
HTTP_HEAD=""
for _ in {1..20}; do
  HTTP_HEAD="$(curl -sI "http://127.0.0.1:${PORT}/index.html" 2>/dev/null | head -n 1 || true)"
  if [[ "$HTTP_HEAD" == *"200"* ]]; then
    break
  fi
  sleep 0.25
done

if [[ "$HTTP_HEAD" == *"200"* ]]; then
  echo "PASS: ${HTTP_HEAD}"
else
  echo "FAIL: Could not get HTTP 200 from http://127.0.0.1:${PORT}/index.html"
  echo "--- server log ---"
  cat /tmp/practise-http.log || true
  exit 1
fi

echo
echo "All checks passed. Open your page at: http://127.0.0.1:${PORT}/index.html"
