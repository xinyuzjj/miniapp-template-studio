# 潮流生活商城

一套开箱即用的电商小程序模板

## 如何运行

### 方式一：一键部署（推荐，零命令）

1. 解压本文件夹到任意目录
2. Windows 双击 **`一键部署.bat`**，Mac 运行 **`一键部署.sh`**
3. 脚本自动定位微信开发者工具并打开项目，登录后左侧即为手机预览
4. 想发布：点工具顶部「上传」填版本号提交审核（需正式 AppID）

> 想直接上传体验版，双击 **`上传体验版.bat / .sh`** 即可。
> 详细步骤见压缩包内的 **`部署说明.txt`**。

### 方式二：手动导入

1. 打开 **微信开发者工具** → 导入项目
2. 目录选择当前文件夹根目录（含 `project.config.json`）
3. AppID 处选择「测试号」或填入你自己的 AppID
4. 点击导入，即可预览

> 若图片提示域名不合法：右上角「详情」→「本地设置」→ 勾选 **不校验合法域名**。
> 本项目默认使用渐变占位图，不依赖任何外链图片，可离线预览。

## 页面结构

| 路径 | 说明 |
| --- | --- |
| `pages/home/index` | 首页 |
| `pages/category/index` | 分类 |
| `pages/cart/index` | 购物车 |
| `pages/my/index` | 我的 |

## 目录说明

```
app.js / app.json / app.wxss    小程序全局配置
pages/<name>/index.*            各页面（wxml / js / wxss / json）
templates/render.wxml           通用组件渲染模板（递归渲染页面数据）
templates/render.wxss           通用组件样式
utils/theme.js                  全局主题变量，改这里可一键换色
utils/handlers.js               页面公共交互（表单、导航、拨号等）
images/icons/                   组件图标（p_ 主色 / s_ 灰色 / w_ 白色）
images/tabbar/                  底部导航图标
一键部署.bat / .sh              自动打开项目的部署脚本
上传体验版.bat / .sh            一键上传体验版（需正式 AppID）
部署说明.txt                    傻瓜式部署图文步骤
```

## 二次开发建议

- **改内容**：编辑 `pages/xxx/index.js` 中的 `NODES`，数据结构直观，改完即时生效。
- **改配色**：编辑 `utils/theme.js`。
- **加交互**：在页面 js 中新增函数，或在 `utils/handlers.js` 中扩展公共行为。
- **接后端**：在 `utils/handlers.js` 的 `onSubmit` 等方法里调用 `wx.request`。

## 说明

本模板中的图片默认为渐变占位块。将数据结构中的 `image`、`src`、`logo`、`avatar`
字段替换为真实图片地址（`https://...`）即可自动渲染为真实图片。
