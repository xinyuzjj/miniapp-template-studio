// pages/home/index.js
const T = require('../../utils/theme.js')
const H = require('../../utils/handlers.js')

const NODES = [
    {
      "id": "search_mte3zxix_1",
      "type": "search",
      "props": {
        "placeholder": "搜索 连衣裙 / 数码 / 家居",
        "radius": 20,
        "background": "#f4f6f9",
        "align": "center",
        "showScan": false,
        "_g1": "#ffb88c",
        "_g2": "#ff7a59"
      },
      "_s": "padding-top:20rpx;padding-bottom:12rpx;padding-left:28rpx;padding-right:28rpx",
      "_r": 12
    },
    {
      "id": "swiper_mte3zxix_2",
      "type": "swiper",
      "props": {
        "items": [
          {
            "image": "",
            "title": "秋季新风尚 全场 5 折起",
            "desc": "限时 3 天 · 叠加满减券",
            "_i": 0,
            "_g1": "#a8c0ff",
            "_g2": "#6f86d6",
            "_features": []
          },
          {
            "image": "",
            "title": "新人专享 满 199 减 50",
            "desc": "注册即领 3 张券",
            "_i": 1,
            "_g1": "#ffd3a5",
            "_g2": "#fd6585",
            "_features": []
          },
          {
            "image": "",
            "title": "会员日 双倍积分",
            "desc": "每周三 0 点开抢",
            "_i": 2,
            "_g1": "#96e6a1",
            "_g2": "#3ec48d",
            "_features": []
          }
        ],
        "height": 168,
        "radius": 14,
        "autoplay": true,
        "indicator": "dot",
        "_g1": "#c2e9fb",
        "_g2": "#5b9df9"
      },
      "_s": "padding-top:20rpx;padding-bottom:12rpx;padding-left:28rpx;padding-right:28rpx",
      "_r": 12
    },
    {
      "id": "grid_mte3zxix_3",
      "type": "grid",
      "props": {
        "items": [
          {
            "icon": "bag",
            "text": "女装",
            "badge": "",
            "_i": 0,
            "_g1": "#fbc2eb",
            "_g2": "#a18cd1",
            "_features": []
          },
          {
            "icon": "camera",
            "text": "数码",
            "badge": "",
            "_i": 1,
            "_g1": "#f9d1c4",
            "_g2": "#e08b7a",
            "_features": []
          },
          {
            "icon": "home",
            "text": "家居",
            "badge": "",
            "_i": 2,
            "_g1": "#d4fc79",
            "_g2": "#4bbf8a",
            "_features": []
          },
          {
            "icon": "coffee",
            "text": "食品",
            "badge": "",
            "_i": 3,
            "_g1": "#e0c3fc",
            "_g2": "#8ec5fc",
            "_features": []
          },
          {
            "icon": "heart",
            "text": "美妆",
            "badge": "HOT",
            "_i": 4,
            "_g1": "#ffecd2",
            "_g2": "#fcb69f",
            "_features": []
          },
          {
            "icon": "dumbbell",
            "text": "运动",
            "badge": "",
            "_i": 5,
            "_g1": "#ffb88c",
            "_g2": "#ff7a59",
            "_features": []
          },
          {
            "icon": "book",
            "text": "母婴",
            "badge": "",
            "_i": 6,
            "_g1": "#a8c0ff",
            "_g2": "#6f86d6",
            "_features": []
          },
          {
            "icon": "gift",
            "text": "领券",
            "badge": "",
            "_i": 7,
            "_g1": "#ffd3a5",
            "_g2": "#fd6585",
            "_features": []
          }
        ],
        "columns": 4,
        "iconBg": "",
        "iconColor": "",
        "iconSize": 26,
        "fontSize": 12,
        "_g1": "#96e6a1",
        "_g2": "#3ec48d"
      },
      "_s": "margin-top:20rpx;padding-top:28rpx;padding-bottom:28rpx;padding-left:20rpx;padding-right:20rpx;border-radius:28rpx;background:#ffffff",
      "_r": 14
    },
    {
      "id": "coupon_mte3zxix_4",
      "type": "coupon",
      "props": {
        "items": [
          {
            "amount": "20",
            "condition": "满 99 可用",
            "name": "新人券",
            "tag": "领取",
            "_i": 0,
            "_g1": "#c2e9fb",
            "_g2": "#5b9df9",
            "_features": [],
            "_initial": "新"
          },
          {
            "amount": "50",
            "condition": "满 299 可用",
            "name": "店铺券",
            "tag": "领取",
            "_i": 1,
            "_g1": "#fbc2eb",
            "_g2": "#a18cd1",
            "_features": [],
            "_initial": "店"
          },
          {
            "amount": "100",
            "condition": "满 599 可用",
            "name": "会员券",
            "tag": "领取",
            "_i": 2,
            "_g1": "#f9d1c4",
            "_g2": "#e08b7a",
            "_features": [],
            "_initial": "会"
          }
        ],
        "background": "#fff1f0",
        "_g1": "#d4fc79",
        "_g2": "#4bbf8a"
      },
      "_s": "padding-top:24rpx;padding-bottom:8rpx;padding-left:28rpx;padding-right:28rpx",
      "_r": 12
    },
    {
      "id": "seckill_mte3zxix_5",
      "type": "seckill",
      "props": {
        "title": "限时秒杀",
        "sub": "距结束 02:18:45",
        "items": [
          {
            "image": "",
            "name": "轻奢通勤包",
            "price": "59",
            "origin": "129",
            "_i": 0,
            "_g1": "#e0c3fc",
            "_g2": "#8ec5fc",
            "_features": [],
            "_initial": "轻"
          },
          {
            "image": "",
            "name": "真丝方巾",
            "price": "88",
            "origin": "199",
            "_i": 1,
            "_g1": "#ffecd2",
            "_g2": "#fcb69f",
            "_features": [],
            "_initial": "真"
          },
          {
            "image": "",
            "name": "香薰礼盒",
            "price": "139",
            "origin": "299",
            "_i": 2,
            "_g1": "#ffb88c",
            "_g2": "#ff7a59",
            "_features": [],
            "_initial": "香"
          },
          {
            "image": "",
            "name": "保温杯",
            "price": "39",
            "origin": "89",
            "_i": 3,
            "_g1": "#a8c0ff",
            "_g2": "#6f86d6",
            "_features": [],
            "_initial": "保"
          }
        ],
        "_g1": "#ffd3a5",
        "_g2": "#fd6585"
      },
      "_s": "margin-top:20rpx;padding-top:28rpx;padding-bottom:24rpx;border-radius:28rpx;background:#ffffff",
      "_r": 14
    },
    {
      "id": "title_mte3zxix_6",
      "type": "title",
      "props": {
        "content": "为你推荐",
        "sub": "根据浏览记录生成",
        "more": true,
        "moreText": "更多",
        "align": "left",
        "size": 18,
        "color": "",
        "subColor": "",
        "_g1": "#96e6a1",
        "_g2": "#3ec48d"
      },
      "_s": "padding-top:32rpx;padding-bottom:16rpx;padding-left:28rpx;padding-right:28rpx",
      "_r": 12
    },
    {
      "id": "goods_mte3zxix_7",
      "type": "goods",
      "props": {
        "layout": "grid",
        "columns": 2,
        "showPrice": true,
        "items": [
          {
            "image": "",
            "name": "法式复古连衣裙",
            "desc": "垂坠感面料 · 显瘦版型",
            "price": "279",
            "origin": "459",
            "tag": "热卖",
            "sales": "2381",
            "_i": 0,
            "_g1": "#c2e9fb",
            "_g2": "#5b9df9",
            "_features": [],
            "_initial": "法"
          },
          {
            "image": "",
            "name": "轻薄羽绒马甲",
            "desc": "90 白鸭绒 · 三色可选",
            "price": "199",
            "origin": "329",
            "tag": "新品",
            "sales": "1042",
            "_i": 1,
            "_g1": "#fbc2eb",
            "_g2": "#a18cd1",
            "_features": [],
            "_initial": "轻"
          },
          {
            "image": "",
            "name": "真无线蓝牙耳机",
            "desc": "主动降噪 · 40h 续航",
            "price": "349",
            "origin": "499",
            "tag": "",
            "sales": "5620",
            "_i": 2,
            "_g1": "#f9d1c4",
            "_g2": "#e08b7a",
            "_features": [],
            "_initial": "真"
          },
          {
            "image": "",
            "name": "北欧风陶瓷餐具",
            "desc": "四件套 · 可入洗碗机",
            "price": "128",
            "origin": "218",
            "tag": "折扣",
            "sales": "863",
            "_i": 3,
            "_g1": "#d4fc79",
            "_g2": "#4bbf8a",
            "_features": [],
            "_initial": "北"
          }
        ],
        "_g1": "#e0c3fc",
        "_g2": "#8ec5fc"
      },
      "_s": "padding-top:12rpx;padding-bottom:16rpx;padding-left:24rpx;padding-right:24rpx",
      "_r": 0
    },
    {
      "id": "serviceBar_mte3zxix_8",
      "type": "serviceBar",
      "props": {
        "items": [
          {
            "icon": "shield",
            "text": "正品保障",
            "_i": 0,
            "_g1": "#ffecd2",
            "_g2": "#fcb69f",
            "_features": []
          },
          {
            "icon": "truck",
            "text": "极速发货",
            "_i": 1,
            "_g1": "#ffb88c",
            "_g2": "#ff7a59",
            "_features": []
          },
          {
            "icon": "repeat",
            "text": "七天退换",
            "_i": 2,
            "_g1": "#a8c0ff",
            "_g2": "#6f86d6",
            "_features": []
          },
          {
            "icon": "headset",
            "text": "专属客服",
            "_i": 3,
            "_g1": "#ffd3a5",
            "_g2": "#fd6585",
            "_features": []
          }
        ],
        "_g1": "#96e6a1",
        "_g2": "#3ec48d"
      },
      "_s": "padding-top:24rpx;padding-bottom:8rpx;padding-left:28rpx;padding-right:28rpx",
      "_r": 12
    },
    {
      "id": "footer_mte3zxix_9",
      "type": "footer",
      "props": {
        "text": "© 2026 示例科技有限公司 · 沪ICP备00000000号",
        "links": "关于我们 · 服务条款 · 隐私政策",
        "_g1": "#c2e9fb",
        "_g2": "#5b9df9"
      },
      "_s": "padding-top:36rpx;padding-bottom:48rpx",
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
    wx.setNavigationBarTitle({ title: "潮流生活" })
  },
  onShareAppMessage: function () {
    return { title: "潮流生活", path: '/pages/home/index/index' }
  }
}))
