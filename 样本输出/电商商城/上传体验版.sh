#!/bin/bash
set -e
echo "== 潮流生活商城 · 上传体验版 =="

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
echo "正在上传体验版..."
"$CLI" upload --project "$ROOT" --version 1.0.0 --desc "潮流生活商城 模板一键部署"
echo "上传完成。请前往 https://mp.weixin.qq.com 提交审核。"
echo "注意：上传需要正式 AppID，测试号无法上传。"
