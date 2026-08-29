/**
 * 一键部署脚本生成
 * ------------------------------------------------------------------
 * 浏览器无法直接调用本机程序，因此「一键部署」的交付物是一个
 * 自带部署脚本的压缩包：用户解压后双击脚本即可自动定位微信开发者工具、
 * 打开 / 上传项目，全程无需输入任何命令。
 *
 * 生成的文件（与小程序的其它源码放在同一目录）：
 *   一键部署.bat       Windows：自动打开项目
 *   一键部署.sh         macOS：自动打开项目
 *   上传体验版.bat      Windows：上传体验版（需正式 AppID）
 *   上传体验版.sh       macOS：上传体验版（需正式 AppID）
 *   部署说明.txt        傻瓜式图文步骤 + 常见问题
 */
import type { MpProject } from '../types'
import type { GenFile } from './mpgen'

const BOM = '﻿'

/** 公共：Windows 下定位微信开发者工具 CLI 的代码块（bat 语法） */
function detectWin(): string {
  return `set "CLI="
if exist "%ProgramFiles(x86)%\\Tencent\\微信web开发者工具\\cli.bat" set "CLI=%ProgramFiles(x86)%\\Tencent\\微信web开发者工具\\cli.bat"
if not defined CLI if exist "%ProgramFiles%\\Tencent\\微信web开发者工具\\cli.bat" set "CLI=%ProgramFiles%\\Tencent\\微信web开发者工具\\cli.bat"
if not defined CLI (
  for /f "tokens=3*" %%a in ('reg query "HKLM\\SOFTWARE\\WOW6432Node\\Tencent\\微信web开发者工具" /v InstallPath 2^>nul') do set "CLI=%%a %%b"
)
if not defined CLI (
  for /f "tokens=3*" %%a in ('reg query "HKCU\\SOFTWARE\\Tencent\\微信web开发者工具" /v InstallPath 2^>nul') do set "CLI=%%a %%b"
)`
}

/** 公共：macOS / Linux 下定位微信开发者工具 CLI 的代码块（sh 语法） */
function detectSh(): string {
  return `CLI=""
for p in \\
  "/Applications/wechatwebdevtools.app/Contents/MacOS/cli" \\
  "/Applications/微信web开发者工具.app/Contents/MacOS/cli" \\
  "$HOME/Applications/wechatwebdevtools.app/Contents/MacOS/cli" \\
  "/opt/wechatwebdevtools/cli" ; do
  if [ -x "$p" ]; then CLI="$p"; break; fi
done`
}

function openBat(name: string): string {
  return `@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title ${name} · 一键部署

:: === 定位微信开发者工具 CLI ===
${detectWin()}

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
`
}

function uploadBat(name: string, desc: string): string {
  return `@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title ${name} · 上传体验版

:: === 定位微信开发者工具 CLI ===
${detectWin()}

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

"%CLI%" upload --project "%ROOT%" --version 1.0.0 --desc "${desc}"

echo.
echo ============================================================
echo  上传完成。请前往 https://mp.weixin.qq.com 提交审核。
echo  注意：上传需要正式 AppID，测试号（touristappid）无法上传。
echo  请将 project.config.json 中的 appid 改为你的 AppID 后重试。
echo ============================================================
echo.
pause
`
}

function openSh(name: string): string {
  return `#!/bin/bash
set -e
echo "== ${name} · 一键部署 =="

${detectSh()}

if [ -z "$CLI" ]; then
  echo "未检测到微信开发者工具，请先安装："
  echo "https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "正在打开项目：$ROOT"
"$CLI" open --project "$ROOT"
echo "已尝试打开项目。若提示登录请扫码；打开后点击「上传」发布体验版。"
`
}

function uploadSh(name: string, desc: string): string {
  return `#!/bin/bash
set -e
echo "== ${name} · 上传体验版 =="

${detectSh()}

if [ -z "$CLI" ]; then
  echo "未检测到微信开发者工具，请先安装："
  echo "https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "正在上传体验版..."
"$CLI" upload --project "$ROOT" --version 1.0.0 --desc "${desc}"
echo "上传完成。请前往 https://mp.weixin.qq.com 提交审核。"
echo "注意：上传需要正式 AppID，测试号无法上传。"
`
}

function previewQrBat(name: string): string {
  return `@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title ${name} · 生成预览二维码

:: === 定位微信开发者工具 CLI ===
${detectWin()}

if not defined CLI (
  echo.
  echo [错误] 未检测到微信开发者工具，请先安装：
  echo https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
  echo.
  pause
  exit /b 1
)

set "ROOT=%~dp0"
set "QR=%ROOT%preview-qr.png"

echo.
echo 正在生成预览二维码...
echo 提示：首次使用请先在微信开发者工具里用微信扫码登录一次。
echo.

"%CLI%" preview --project "%ROOT%" --qr "%QR%"

if exist "%QR%" (
  echo.
  echo ============================================================
  echo  二维码已生成：preview-qr.png
  echo  用手机微信「扫一扫」即可在真机上预览（无需 AppID）。
  echo ============================================================
  start "" "%QR%"
) else (
  echo.
  echo [提示] 未生成二维码。请先在微信开发者工具登录个人微信后重试，
  echo  或在工具顶部点「预览」手动生成二维码。
)
echo.
pause
`
}

function previewQrSh(name: string): string {
  return `#!/bin/bash
set -e
echo "== ${name} · 生成预览二维码 =="

${detectSh()}

if [ -z "$CLI" ]; then
  echo "未检测到微信开发者工具，请先安装："
  echo "https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"
QR="$ROOT/preview-qr.png"
echo "正在生成预览二维码..."
"$CLI" preview --project "$ROOT" --qr "$QR" || true
if [ -f "$QR" ]; then
  echo "二维码已生成：$QR —— 用手机微信扫码即可真机预览（无需 AppID）。"
  open "$QR" 2>/dev/null || true
else
  echo "未生成二维码。请先在微信开发者工具登录个人微信后重试，或点顶部「预览」手动生成。"
fi
`
}

function guideTxt(name: string, desc: string): string {
  return `小程序一键部署 · 使用说明
============================

本文件夹是一个完整的小程序项目（含 project.config.json）。
下面三步即可把它跑起来，全程不用敲任何命令。

第一步：解压
  把压缩包解压到任意文件夹，例如 D:\\${name}。

第二步：运行部署脚本
  Windows 用户：双击「一键部署.bat」
  Mac 用户：打开终端，执行  chmod +x 一键部署.sh  后双击运行
  脚本会自动在本机查找「微信开发者工具」并打开本项目。

第三步：在微信开发者工具里
  - 若弹出登录，用微信扫码登录。
  - 项目自动打开，左侧即为手机实时预览，可切换页面与 Tab。
  - 想让真机扫码体验：点顶部「预览」生成二维码。
  - 想发布上线：点顶部「上传」→ 填版本号 → 提交，再前往
    微信公众平台 mp.weixin.qq.com 提交审核。

想直接上传体验版？
  用正式 AppID 时，双击「上传体验版.bat / .sh」一步到位。

想用手机扫码看真机效果（免 AppID）？
  双击「预览二维码.bat / .sh」，脚本会自动生成一张二维码图片并打开，
  用手机微信「扫一扫」即可预览。前提：你本人在微信开发者工具里
  登录过个人微信（免费账号，不是 AppID）。

常见问题
--------
Q：提示「未检测到微信开发者工具」？
A：请先安装开发者工具：
   https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   安装后重新双击脚本即可。

Q：上传时提示 AppID 错误 / 测试号无法上传？
A：本项目默认使用测试号（touristappid），仅能预览，不能上传发布。
   正式发布请到微信公众平台注册小程序、拿到 AppID，
   把 project.config.json 里的 "appid" 字段替换掉，
   然后双击「上传体验版.bat / .sh」。

Q：图片显示不出来？
A：默认使用渐变占位图，不依赖任何网络，可离线预览。
   把数据里的 image / src / logo / avatar 字段换成
   真实图片地址（https://...）即可显示真图。

Q：域名校验报错？
A：右上角「详情」→「本地设置」→ 勾选「不校验合法域名」。

${desc}
由「小程序模板工坊」自动生成
`
}

/**
 * 生成全部部署辅助文件（与小程序源码放在同一目录）。
 */
export function buildDeployScripts(p: MpProject): GenFile[] {
  const name = p.name || 'miniapp'
  const desc = `${name} 模板一键部署`
  return [
    { path: '一键部署.bat', content: BOM + openBat(name) },
    { path: '一键部署.sh', content: openSh(name) },
    { path: '预览二维码.bat', content: BOM + previewQrBat(name) },
    { path: '预览二维码.sh', content: previewQrSh(name) },
    { path: '上传体验版.bat', content: BOM + uploadBat(name, desc) },
    { path: '上传体验版.sh', content: uploadSh(name, desc) },
    { path: '部署说明.txt', content: BOM + guideTxt(name, desc) },
  ]
}
