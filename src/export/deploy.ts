/**
 * 一键部署脚本生成
 * ------------------------------------------------------------------
 * 浏览器无法直接调用本机程序，因此「一键部署」的交付物是一个
 * 自带部署脚本的压缩包：用户解压后双击脚本即可自动定位微信开发者工具、
 * 打开 / 上传项目，全程无需输入任何命令。
 *
 * 生成的文件（与小程序的其它源码放在同一目录）：
 *   deploy.bat         Windows：自动打开项目
 *   deploy.sh           macOS：自动打开项目
 *   upload.bat         Windows：上传体验版（需正式 AppID）
 *   upload.sh           macOS：上传体验版（需正式 AppID）
 *   preview-qr.bat      Windows：生成预览二维码（真机扫码，免 AppID）
 *   preview-qr.sh        macOS：生成预览二维码（真机扫码，免 AppID）
 *   DEPLOY.txt          傻瓜式图文步骤 + 常见问题
 *
 * 重要：这些脚本文件一律只含 ASCII，避免 Windows 命令行（cmd.exe）在
 * 中文代码页下把 UTF-8 当成乱码。微信开发者工具的安装路径本身含中文
 * （"微信web开发者工具"），由 `chcp 65001` 切换到 UTF-8 代码页后正确识别，
 * 脚本文件本身绝不带 BOM。
 */
import type { MpProject } from '../types'
import type { GenFile } from './mpgen'

/** 公共：Windows 下定位微信开发者工具 CLI 的代码块（bat 语法，纯 ASCII，路径在运行时由通配符/注册表解析，chcp 65001 保证中文目录名正确识别） */
function detectWin(): string {
  return `set "CLI="
for /d %%d in ("%ProgramFiles(x86)%\\Tencent\\*") do if not defined CLI if exist "%%d\\cli.bat" set "CLI=%%d\\cli.bat"
if not defined CLI for /d %%d in ("%ProgramFiles%\\Tencent\\*") do if exist "%%d\\cli.bat" set "CLI=%%d\\cli.bat"
if not defined CLI (
  for /f "tokens=2*" %%a in ('reg query "HKCU\\Software\\Tencent" /s /v InstallPath 2^>nul ^| find "InstallPath"') do if not defined CLI if exist "%%b\\cli.bat" set "CLI=%%b\\cli.bat"
)
if not defined CLI (
  for /f "tokens=2*" %%a in ('reg query "HKLM\\SOFTWARE\\WOW6432Node\\Tencent" /s /v InstallPath 2^>nul ^| find "InstallPath"') do if not defined CLI if exist "%%b\\cli.bat" set "CLI=%%b\\cli.bat"
)`
}

/** 公共：macOS / Linux 下定位微信开发者工具 CLI 的代码块（sh 语法，纯 ASCII，按英文包名 wechatwebdevtools 检索） */
function detectSh(): string {
  return `CLI=$(find /Applications "$HOME/Applications" /opt -maxdepth 6 -type f -name cli 2>/dev/null | grep -i wechatwebdevtools | head -1)
if [ -z "$CLI" ]; then
  CLI=$(find /Applications "$HOME/Applications" /opt -maxdepth 6 -type f -name "cli.bat" 2>/dev/null | grep -i wechatwebdevtools | head -1)
fi`
}

function openBat(): string {
  return `@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: === Locate WeChat DevTools CLI ===
${detectWin()}

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
`
}

function uploadBat(desc: string): string {
  return `@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: === Locate WeChat DevTools CLI ===
${detectWin()}

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

"%CLI%" upload --project "%ROOT%" --version 1.0.0 --desc "${desc}"

echo.
echo ============================================================
echo  Upload finished. Go to https://mp.weixin.qq.com to submit for review.
echo  Note: upload requires an official AppID; the test account (touristappid)
echo  cannot upload. Replace the appid in project.config.json and retry.
echo ============================================================
echo.
pause
`
}

function openSh(): string {
  return `#!/bin/bash
set -e
echo "== WeChat MiniApp Deploy =="

${detectSh()}

if [ -z "$CLI" ]; then
  echo "WeChat DevTools not found. Please install it first:"
  echo "https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "Opening project: $ROOT"
"$CLI" open --project "$ROOT"
echo "Done. If asked to log in, scan the QR code. Click 'Upload' to publish."
`
}

function uploadSh(desc: string): string {
  return `#!/bin/bash
set -e
echo "== WeChat MiniApp Upload =="

${detectSh()}

if [ -z "$CLI" ]; then
  echo "WeChat DevTools not found. Please install it first:"
  echo "https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "Uploading experience version..."
"$CLI" upload --project "$ROOT" --version 1.0.0 --desc "${desc}"
echo "Upload finished. Go to https://mp.weixin.qq.com to submit for review."
echo "Note: upload requires an official AppID; the test account cannot upload."
`
}

function previewQrBat(): string {
  return `@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: === Locate WeChat DevTools CLI ===
${detectWin()}

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
`
}

function previewQrSh(): string {
  return `#!/bin/bash
set -e
echo "== WeChat MiniApp Preview QR Code =="

${detectSh()}

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
`
}

function guideTxt(desc: string): string {
  return `WeChat Mini Program - One-Click Deploy
====================================

This folder is a complete Mini Program project (includes project.config.json).
Three steps to run it, no commands required.

Step 1: Extract
  Unzip to any folder, e.g. D:\\my-miniapp.

Step 2: Run the deploy script
  Windows: double-click "deploy.bat"
  Mac:     in Terminal run  chmod +x deploy.sh  then double-click it
  The script auto-detects WeChat DevTools on this machine and opens the project.

Step 3: In WeChat DevTools
  - If a login popup appears, scan the QR code with WeChat.
  - The project opens automatically; the left panel is the live phone preview.
  - Real-device preview: click "Preview" on the top bar for a QR code.
  - Publish: click "Upload" - enter a version - submit, then go to
    mp.weixin.qq.com to submit for review.

Want to upload an experience version directly?
  With an official AppID, double-click "upload.bat / upload.sh".

Want to preview on a real phone (no AppID)?
  Double-click "preview-qr.bat / preview-qr.sh". It generates a QR image and
  opens it; scan with WeChat to preview. Requirement: you have logged in with
  your personal WeChat in DevTools at least once (a free account, not an AppID).

FAQ
---
Q: "WeChat DevTools not found"?
A: Install DevTools first:
   https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   Then double-click the script again.

Q: Upload fails with AppID / test account error?
A: This project uses the test account (touristappid) by default - preview only,
   no upload. To publish, register a Mini Program at mp.weixin.qq.com, get an
   AppID, replace the "appid" field in project.config.json, then run upload.

Q: Images not showing?
A: Gradient placeholders are used by default and work offline. Replace the
   image / src / logo / avatar fields with real https URLs to show real images.

Q: Domain validation error?
A: Top-right "Details" - "Local Settings" - check "Do not verify domains".

${desc}
Generated by MiniApp Template Studio
`
}

/**
 * 生成全部部署辅助文件（与小程序源码放在同一目录）。
 * 全部为 ASCII，绝不带 BOM，避免 Windows 命令行乱码。
 */
export function buildDeployScripts(p: MpProject): GenFile[] {
  const desc = 'MiniApp template one-click deploy'
  return [
    { path: 'deploy.bat', content: openBat() },
    { path: 'deploy.sh', content: openSh() },
    { path: 'preview-qr.bat', content: previewQrBat() },
    { path: 'preview-qr.sh', content: previewQrSh() },
    { path: 'upload.bat', content: uploadBat(desc) },
    { path: 'upload.sh', content: uploadSh(desc) },
    { path: 'DEPLOY.txt', content: guideTxt(desc) },
  ]
}
