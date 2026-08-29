#!/bin/bash
set -e
echo "== 潮流生活商城 · 一键部署 =="

CLI=""
for p in \
  "/Applications/wechatwebdevtools.app/Contents/MacOS/cli" \
  "/Applications/微信web开发者工具.app/Contents/MacOS/cli" \
  "$HOME/Applications/wechatwebdevtools.app/Contents/MacOS/cli" \
  "/opt/wechatwebdevtools/cli" ; do
  if [ -x "$p" ]; then CLI="$p"; break; fi
done

if [ -z "$CLI" ]; then
  echo "未检测到微信开发者工具，请先安装："
  echo "https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "正在打开项目：$ROOT"
"$CLI" open --project "$ROOT"
echo "已尝试打开项目。若提示登录请扫码；打开后点击「上传」发布体验版。"
