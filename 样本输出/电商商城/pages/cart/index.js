// pages/cart/index.js
const T = require('../../utils/theme.js')
const H = require('../../utils/handlers.js')

const NODES = [
    {
      "id": "notice_mte3zxix_f",
      "type": "notice",
      "props": {
        "text": "🎉 满 299 减 50，再凑 ¥68 即可享受",
        "more": false,
        "icon": "gift",
        "color": "#d97706",
        "background": "#fff8e6",
        "_g1": "#ffb88c",
        "_g2": "#ff7a59"
      },
      "_s": "padding-top:20rpx;padding-bottom:12rpx;padding-left:28rpx;padding-right:28rpx",
      "_r": 12
    },
    {
      "id": "goods_mte3zxix_g",
      "type": "goods",
      "props": {
        "layout": "list",
        "columns": 2,
        "showPrice": true,
        "items": [
          {
            "image": "",
            "name": "法式复古连衣裙",
            "desc": "米白色 / M 码",
            "price": "279",
            "origin": "459",
            "tag": "",
            "sales": "",
            "_i": 0,
            "_g1": "#a8c0ff",
            "_g2": "#6f86d6",
            "_features": [],
            "_initial": "法"
          },
          {
            "image": "",
            "name": "真无线蓝牙耳机",
            "desc": "星空黑 / 标准版",
            "price": "349",
            "origin": "499",
            "tag": "",
            "sales": "",
            "_i": 1,
            "_g1": "#ffd3a5",
            "_g2": "#fd6585",
            "_features": [],
            "_initial": "真"
          },
          {
            "image": "",
            "name": "北欧风陶瓷餐具",
            "desc": "四件套 / 奶油白",
            "price": "128",
            "origin": "218",
            "tag": "",
            "sales": "",
            "_i": 2,
            "_g1": "#96e6a1",
            "_g2": "#3ec48d",
            "_features": [],
            "_initial": "北"
          }
        ],
        "_g1": "#c2e9fb",
        "_g2": "#5b9df9"
      },
      "_s": "margin-top:12rpx;padding-top:8rpx;padding-bottom:8rpx;padding-left:20rpx;padding-right:20rpx;border-radius:28rpx;background:#ffffff",
      "_r": 14
    },
    {
      "id": "coupon_mte3zxix_h",
      "type": "coupon",
      "props": {
        "items": [
          {
            "amount": "50",
            "condition": "满 299 可用",
            "name": "店铺满减券",
            "tag": "去凑单",
            "_i": 0,
            "_g1": "#fbc2eb",
            "_g2": "#a18cd1",
            "_features": [],
            "_initial": "店"
          }
        ],
        "background": "#fff1f0",
        "_g1": "#f9d1c4",
        "_g2": "#e08b7a"
      },
      "_s": "padding-top:24rpx;padding-bottom:16rpx;padding-left:28rpx;padding-right:28rpx",
      "_r": 12
    },
    {
      "id": "title_mte3zxix_i",
      "type": "title",
      "props": {
        "content": "你可能还想要",
        "sub": "",
        "more": true,
        "moreText": "更多",
        "align": "left",
        "size": 18,
        "color": "",
        "subColor": "",
        "_g1": "#d4fc79",
        "_g2": "#4bbf8a"
      },
      "_s": "padding-top:32rpx;padding-bottom:16rpx;padding-left:28rpx;padding-right:28rpx",
      "_r": 12
    },
    {
      "id": "goods_mte3zxix_j",
      "type": "goods",
      "props": {
        "layout": "row",
        "columns": 2,
        "showPrice": true,
        "items": [
          {
            "image": "",
            "name": "真丝方巾",
            "desc": "多色可选",
            "price": "88",
            "origin": "199",
            "tag": "",
            "sales": "642",
            "_i": 0,
            "_g1": "#e0c3fc",
            "_g2": "#8ec5fc",
            "_features": [],
            "_initial": "真"
          },
          {
            "image": "",
            "name": "香薰礼盒",
            "desc": "送礼首选",
            "price": "139",
            "origin": "299",
            "tag": "",
            "sales": "318",
            "_i": 1,
            "_g1": "#ffecd2",
            "_g2": "#fcb69f",
            "_features": [],
            "_initial": "香"
          },
          {
            "image": "",
            "name": "保温杯",
            "desc": "316 不锈钢",
            "price": "39",
            "origin": "89",
            "tag": "",
            "sales": "2201",
            "_i": 2,
            "_g1": "#ffb88c",
            "_g2": "#ff7a59",
            "_features": [],
            "_initial": "保"
          }
        ],
        "_g1": "#a8c0ff",
        "_g2": "#6f86d6"
      },
      "_s": "padding-top:8rpx;padding-bottom:40rpx;padding-left:20rpx;padding-right:20rpx",
      "_r": 0
    },
    {
      "id": "cartBar_mte3zxix_k",
      "type": "cartBar",
      "props": {
        "total": "￥756.00",
        "count": 3,
        "buttonText": "去结算",
        "tip": "已优惠 ￥50",
        "fixed": true,
        "_g1": "#ffd3a5",
        "_g2": "#fd6585"
      },
      "_s": "",
      "_r": 12
    }
  ]

Page(Object.assign({}, H, {
  data: {
    T: T,
    nodes: NODES,
    form: {}
  },
  onLoad: function () {
    wx.setNavigationBarTitle({ title: "购物车" })
  },
  onShareAppMessage: function () {
    return { title: "购物车", path: '/pages/cart/index/index' }
  }
}))
