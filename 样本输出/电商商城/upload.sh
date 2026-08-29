#!/bin/bash
set -e
echo "== WeChat MiniApp Upload =="

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
echo "Uploading experience version..."
"$CLI" upload --project "$ROOT" --version 1.0.0 --desc "MiniApp template one-click deploy"
echo "Upload finished. Go to https://mp.weixin.qq.com to submit for review."
echo "Note: upload requires an official AppID; the test account cannot upload."
