@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: === Locate WeChat DevTools CLI ===
set "CLI="
for /d %%d in ("%ProgramFiles(x86)%\Tencent\*") do if not defined CLI if exist "%%d\cli.bat" set "CLI=%%d\cli.bat"
if not defined CLI for /d %%d in ("%ProgramFiles%\Tencent\*") do if exist "%%d\cli.bat" set "CLI=%%d\cli.bat"
if not defined CLI (
  for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Tencent" /s /v InstallPath 2^>nul ^| find "InstallPath"') do if not defined CLI if exist "%%b\cli.bat" set "CLI=%%b\cli.bat"
)
if not defined CLI (
  for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\WOW6432Node\Tencent" /s /v InstallPath 2^>nul ^| find "InstallPath"') do if not defined CLI if exist "%%b\cli.bat" set "CLI=%%b\cli.bat"
)

if not defined CLI (
  echo.
  echo [Error] WeChat DevTools not found. Please install it first:
  echo https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
  echo.
  pause
  exit /b 1
)

set "ROOT=%~dp0"

echo.
echo Uploading experience version...
echo.

"%CLI%" upload --project "%ROOT%" --version 1.0.0 --desc "MiniApp template one-click deploy"

echo.
echo ============================================================
echo  Upload finished. Go to https://mp.weixin.qq.com to submit for review.
echo  Note: upload requires an official AppID; the test account (touristappid)
echo  cannot upload. Replace the appid in project.config.json and retry.
echo ============================================================
echo.
pause
