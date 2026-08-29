@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title 潮流生活商城 · 一键部署

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

:: === 项目目录（即本脚本所在目录） ===
set "ROOT=%~dp0"

echo.
echo 正在用微信开发者工具打开项目...
echo 项目目录：%ROOT%
echo.

"%CLI%" open --project "%ROOT%"

echo.
echo ============================================================
echo  已尝试打开项目。
echo  - 若弹出登录窗口，请用微信扫码登录。
echo  - 打开后左侧即为手机预览，左侧可切换页面 / Tab。
echo  - 想让真机扫码体验：点顶部「预览」生成二维码。
echo  - 想发布上线：点顶部「上传」→ 填版本号 → 提交审核。
echo  - 当前为测试号，正式发布请替换为你的 AppID（见部署说明.txt）。
echo ============================================================
echo.
pause
