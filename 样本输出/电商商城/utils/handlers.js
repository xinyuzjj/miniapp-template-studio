/**
 * 页面公共交互
 * 所有事件只做最小可用的示例实现，方便你按需替换为真实接口。
 */
module.exports = {
  onInput: function (e) {
    this.setData({ ['form.' + e.currentTarget.dataset.i]: e.detail.value })
  },

  onDate: function (e) {
    var i = e.currentTarget.dataset.i
    this.setData({ ['form.' + i]: e.detail.value })
  },

  onPick: function (e) {
    var i = e.currentTarget.dataset.i
    this.setData({ ['form.' + i]: e.detail.value })
  },

  onSubmit: function () {
    wx.showToast({ title: '提交成功', icon: 'success' })
  },

  onFab: function (e) {
    var action = e.currentTarget.dataset.action || 'none'
    var phone = e.currentTarget.dataset.phone || ''
    if (action === 'call' && phone) {
      wx.makePhoneCall({ phoneNumber: phone.replace(/[^0-9\-]/g, ''), fail: function () {} })
    } else if (action === 'top') {
      wx.pageScrollTo({ scrollTop: 0, duration: 300 })
    } else if (action === 'share') {
      wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'], fail: function () {} })
    } else {
      wx.showToast({ title: '更多功能开发中', icon: 'none' })
    }
  },

  onNavigate: function (e) {
    var d = e.currentTarget.dataset
    if (typeof d.lat === 'undefined' || d.lat === '') return
    wx.openLocation({
      latitude: Number(d.lat),
      longitude: Number(d.lng),
      name: d.name || '',
      address: d.addr || '',
      scale: 16
    })
  },

  onContact: function (e) {
    var v = e.currentTarget.dataset.v || ''
    var a = e.currentTarget.dataset.a || ''
    if (a === '拨打') {
      wx.makePhoneCall({ phoneNumber: v.replace(/[^0-9\-]/g, ''), fail: function () {} })
    } else if (a === '复制') {
      wx.setClipboardData({ data: v })
    } else if (a === '导航') {
      wx.showToast({ title: '已复制地址', icon: 'none' })
      wx.setClipboardData({ data: v })
    }
  }
}
