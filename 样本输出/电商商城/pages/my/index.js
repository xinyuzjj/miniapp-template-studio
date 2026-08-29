// pages/my/index.js
const T = require('../../utils/theme.js')
const H = require('../../utils/handlers.js')

const NODES = [
    {
      "id": "view_mteaoyz5_r",
      "type": "view",
      "props": {
        "direction": "column",
        "gap": 12,
        "align": "stretch",
        "_g1": "#ffb88c",
        "_g2": "#ff7a59"
      },
      "_s": "",
      "_r": 0,
      "children": [
        {
          "id": "stats_mteaoyz5_l",
          "type": "stats",
          "props": {
            "items": [
              {
                "value": "3",
                "label": "待付款",
                "_i": 0,
                "_g1": "#a8c0ff",
                "_g2": "#6f86d6",
                "_features": []
              },
              {
                "value": "2",
                "label": "待收货",
                "_i": 1,
                "_g1": "#ffd3a5",
                "_g2": "#fd6585",
                "_features": []
              },
              {
                "value": "12",
                "label": "优惠券",
                "_i": 2,
                "_g1": "#96e6a1",
                "_g2": "#3ec48d",
                "_features": []
              },
              {
                "value": "368",
                "label": "积分",
                "_i": 3,
                "_g1": "#c2e9fb",
                "_g2": "#5b9df9",
                "_features": []
              }
            ],
            "background": "",
            "_g1": "#fbc2eb",
            "_g2": "#a18cd1"
          },
          "_s": "padding-top:24rpx;padding-left:28rpx;padding-right:28rpx;border-radius:28rpx",
          "_r": 14
        },
        {
          "id": "shop_mteaoyz5_m",
          "type": "shop",
          "props": {
            "name": "您好，欢迎回来",
            "logo": "",
            "desc": "黄金会员 · 成长值 3280",
            "tags": [
              "实名认证",
              "已绑定手机"
            ],
            "rating": "4.9",
            "address": "上次登录：2026-08-28 14:32 · 上海",
            "phone": "会员等级 V3",
            "hours": "有效期至 2027-08-28",
            "_g1": "#f9d1c4",
            "_g2": "#e08b7a"
          },
          "_s": "margin-top:20rpx;border-radius:28rpx;background:#ffffff",
          "_r": 14
        },
        {
          "id": "grid_mteaoyz5_n",
          "type": "grid",
          "props": {
            "items": [
              {
                "icon": "list",
                "text": "全部订单",
                "_i": 0,
                "_g1": "#d4fc79",
                "_g2": "#4bbf8a",
                "_features": []
              },
              {
                "icon": "cart",
                "text": "购物车",
                "_i": 1,
                "_g1": "#e0c3fc",
                "_g2": "#8ec5fc",
                "_features": []
              },
              {
                "icon": "heart",
                "text": "收藏夹",
                "_i": 2,
                "_g1": "#ffecd2",
                "_g2": "#fcb69f",
                "_features": []
              },
              {
                "icon": "pin",
                "text": "收货地址",
                "_i": 3,
                "_g1": "#ffb88c",
                "_g2": "#ff7a59",
                "_features": []
              },
              {
                "icon": "headset",
                "text": "客服中心",
                "_i": 4,
                "_g1": "#a8c0ff",
                "_g2": "#6f86d6",
                "_features": []
              },
              {
                "icon": "coupon",
                "text": "优惠券",
                "_i": 5,
                "_g1": "#ffd3a5",
                "_g2": "#fd6585",
                "_features": []
              },
              {
                "icon": "award",
                "text": "会员中心",
                "_i": 6,
                "_g1": "#96e6a1",
                "_g2": "#3ec48d",
                "_features": []
              },
              {
                "icon": "gift",
                "text": "邀请有礼",
                "_i": 7,
                "_g1": "#c2e9fb",
                "_g2": "#5b9df9",
                "_features": []
              }
            ],
            "columns": 4,
            "iconBg": "",
            "iconColor": "",
            "iconSize": 26,
            "fontSize": 12,
            "_g1": "#fbc2eb",
            "_g2": "#a18cd1"
          },
          "_s": "margin-top:20rpx;padding-top:28rpx;padding-bottom:28rpx;padding-left:16rpx;padding-right:16rpx;border-radius:28rpx;background:#ffffff",
          "_r": 14
        },
        {
          "id": "banner_mteaoyz5_o",
          "type": "banner",
          "props": {
            "image": "",
            "title": "开通 PLUS 会员",
            "sub": "全年免运费 · 专享 9 折",
            "buttonText": "立即开通",
            "background": "",
            "_g1": "#f9d1c4",
            "_g2": "#e08b7a"
          },
          "_s": "padding-top:24rpx;padding-bottom:8rpx;padding-left:28rpx;padding-right:28rpx",
          "_r": 12
        },
        {
          "id": "contact_mteaoyz5_p",
          "type": "contact",
          "props": {
            "items": [
              {
                "icon": "clock",
                "label": "浏览足迹",
                "value": "128 件",
                "_i": 0,
                "_g1": "#d4fc79",
                "_g2": "#4bbf8a",
                "_features": []
              },
              {
                "icon": "truck",
                "label": "物流查询",
                "value": "",
                "_i": 1,
                "_g1": "#e0c3fc",
                "_g2": "#8ec5fc",
                "_features": []
              },
              {
                "icon": "message",
                "label": "我的评价",
                "value": "6 条待评",
                "_i": 2,
                "_g1": "#ffecd2",
                "_g2": "#fcb69f",
                "_features": []
              },
              {
                "icon": "phone",
                "label": "联系客服",
                "value": "400-888-8888",
                "action": "拨打",
                "_i": 3,
                "_g1": "#ffb88c",
                "_g2": "#ff7a59",
                "_features": []
              }
            ],
            "_g1": "#a8c0ff",
            "_g2": "#6f86d6"
          },
          "_s": "margin-top:20rpx;border-radius:28rpx;background:#ffffff",
          "_r": 14
        },
        {
          "id": "footer_mteaoyz5_q",
          "type": "footer",
          "props": {
            "text": "© 2026 示例科技有限公司 · 沪ICP备00000000号",
            "links": "关于我们 · 服务条款 · 隐私政策",
            "_g1": "#ffd3a5",
            "_g2": "#fd6585"
          },
          "_s": "padding-top:36rpx;padding-bottom:48rpx",
          "_r": 12
        }
      ]
    }
  ]

Page(Object.assign({}, H, {
  data: {
    T: T,
    nodes: NODES,
    form: {}
  },
  onLoad: function () {
    wx.setNavigationBarTitle({ title: "我的" })
  },
  onShareAppMessage: function () {
    return { title: "我的", path: '/pages/my/index/index' }
  }
}))
