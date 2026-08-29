/**
 * 全局主题变量
 * 修改这里即可一次性调整整站配色，页面 WXML 通过 T.xxx 引用。
 */
function hexToRgba(hex, a) {
  var h = String(hex || '#000000').replace('#', '')
  if (h.length === 3) h = h.split('').map(function (c) { return c + c }).join('')
  var num = parseInt(h, 16) || 0
  return 'rgba(' + ((num >> 16) & 255) + ',' + ((num >> 8) & 255) + ',' + (num & 255) + ',' + a + ')'
}

var primary = "#ff4d4f"
var secondary = "#ff4d4f"

module.exports = {
  primary: primary,
  primaryLight: "#fff1f0",
  secondary: secondary,
  accent: "#ffb020",
  text: "#1a1d28",
  subText: "#7b8494",
  background: "#f5f6f9",
  cardBg: "#ffffff",
  _pri72: hexToRgba(primary, 0.72),
  _pri08: 'linear-gradient(170deg,' + hexToRgba(primary, 0.08) + ',#ffffff 60%)',
  _pri12: hexToRgba(primary, 0.12),
  _pri30: hexToRgba(primary, 0.3),
  _priGrad: 'linear-gradient(120deg,' + primary + ' 0%,' + hexToRgba(primary, 0.72) + ' 100%)',
  _sec25: hexToRgba(secondary, 0.25),
  _sec35: hexToRgba(secondary, 0.35),
  _grayBg: '#f4f6f9'
}
