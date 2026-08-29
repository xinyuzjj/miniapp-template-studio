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
set "QR=%ROOT%preview-qr.png"

echo.
echo Generating preview QR code...
echo Tip: on first use, scan the QR code with WeChat in DevTools to log in once.
echo.

"%CLI%" preview --project "%ROOT%" --qr "%QR%"

if exist "%QR%" (
  echo.
  echo ============================================================
  echo  QR code saved: preview-qr.png
  echo  Scan it with WeChat on your phone to preview (no AppID needed).
  echo ============================================================
  start "" "%QR%"
) else (
  echo.
  echo [Hint] No QR code generated. Log in with your personal WeChat in DevTools
  echo  first, then retry; or click "Preview" on the top bar to generate one.
)
echo.
pause
