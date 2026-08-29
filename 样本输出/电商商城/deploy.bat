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

:: === Project directory = the folder this script lives in ===
set "ROOT=%~dp0"

echo.
echo Opening project in WeChat DevTools...
echo Project dir: %ROOT%
echo.

"%CLI%" open --project "%ROOT%"

echo.
echo ============================================================
echo  Done. The project should now open in WeChat DevTools.
echo  - If a login popup appears, scan the QR code with WeChat.
echo  - The left panel shows the live phone preview.
echo  - Real-device preview: click "Preview" on the top bar for a QR code.
echo  - Publish: click "Upload" - enter a version - submit for review.
echo  - This is a test account; replace the appid to publish officially.
echo ============================================================
echo.
pause
