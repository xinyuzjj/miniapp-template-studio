@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title 潮流生活商城 · 上传体验版

:: === 定位微信开发者工具 CLI ===
set "CLI="
if exist "%ProgramFiles(x86)%\Tencent\微信web开发者工具\cli.bat" set "CLI=%ProgramFiles(x86)%\Tencent\微信web开发者工具\cli.bat"
if not defined CLI if exist "%ProgramFiles%\Tencent\微信web开发者工具\cli.bat" set "CLI=%ProgramFiles%\Tencent\微信web开发者工具\cli.bat"
if not defined CLI (
  for /f "tokens=3*" %%a in ('reg query "HKLM\SOFTWARE\WOW6432Node\Tencent\微信web开发者工具" /v InstallPath 2^>nul') do set "CLI=%%a %%b"
)
if not defined CLI (
  for /f "tokens=3*" %%a in ('reg query "HKCU\SOFTWARE\Tencent\微信web开发者工具" /v InstallPath 2^>nul') do set "CLI=%%a %%b"
)

if not defined CLI (
  echo.
  echo [错误] 未检测到微信开发者工具，请先安装：
  echo https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
  echo.
  pause
  exit /b 1
)

set "ROOT=%~dp0"

echo.
echo 正在上传体验版...
echo.

"%CLI%" upload --project "%ROOT%" --version 1.0.0 --desc "潮流生活商城 模板一键部署"

echo.
echo ============================================================
echo  上传完成。请前往 https://mp.weixin.qq.com 提交审核。
echo  注意：上传需要正式 AppID，测试号（touristappid）无法上传。
echo  请将 project.config.json 中的 appid 改为你的 AppID 后重试。
echo ============================================================
echo.
pause
