#!/bin/bash
set -e
echo "== WeChat MiniApp Preview QR Code =="

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
QR="$ROOT/preview-qr.png"
echo "Generating preview QR code..."
"$CLI" preview --project "$ROOT" --qr "$QR" || true
if [ -f "$QR" ]; then
  echo "QR code saved: $QR - scan it with WeChat to preview on a real device (no AppID)."
  open "$QR" 2>/dev/null || true
else
  echo "No QR code generated. Log in with your personal WeChat in DevTools first, or click 'Preview' on the top bar."
fi
