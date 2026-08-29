#!/bin/bash
set -e
echo "== WeChat MiniApp Deploy =="

CLI=$(find /Applications "$HOME/Applications" /opt -maxdepth 6 -type f -name cli 2>/dev/null | grep -i wechatwebdevtools | head -1)
if [ -z "$CLI" ]; then
  CLI=$(find /Applications "$HOME/Applications" /opt -maxdepth 6 -type f -name "cli.bat" 2>/dev/null | grep -i wechatwebdevtools | head -1)
fi

if [ -z "$CLI" ]; then
  echo "WeChat DevTools not found. Please install it first:"
  echo "https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "Opening project: $ROOT"
"$CLI" open --project "$ROOT"
echo "Done. If asked to log in, scan the QR code. Click 'Upload' to publish."
