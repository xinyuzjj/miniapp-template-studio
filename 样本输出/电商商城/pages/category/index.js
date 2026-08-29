// pages/category/index.js
const T = require('../../utils/theme.js')
const H = require('../../utils/handlers.js')

const NODES = [
    {
      "id": "search_mteaoyz5_a",
      "type": "search",
      "props": {
        "placeholder": "搜索商品",
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
      "id": "grid_mteaoyz5_b",
      "type": "grid",
      "props": {
        "items": [
          {
            "icon": "bag",
            "text": "女装",
            "_i": 0,
            "_g1": "#a8c0ff",
            "_g2": "#6f86d6",
            "_features": []
          },
          {
            "icon": "camera",
            "text": "数码",
            "_i": 1,
            "_g1": "#ffd3a5",
            "_g2": "#fd6585",
            "_features": []
          },
          {
            "icon": "home",
            "text": "家居",
            "_i": 2,
            "_g1": "#96e6a1",
            "_g2": "#3ec48d",
            "_features": []
          },
          {
            "icon": "coffee",
            "text": "食品",
            "_i": 3,
            "_g1": "#c2e9fb",
            "_g2": "#5b9df9",
            "_features": []
          },
          {
            "icon": "heart",
            "text": "美妆",
            "_i": 4,
            "_g1": "#fbc2eb",
            "_g2": "#a18cd1",
            "_features": []
          },
          {
            "icon": "dumbbell",
            "text": "运动",
            "_i": 5,
            "_g1": "#f9d1c4",
            "_g2": "#e08b7a",
            "_features": []
          },
          {
            "icon": "book",
            "text": "母婴",
            "_i": 6,
            "_g1": "#d4fc79",
            "_g2": "#4bbf8a",
            "_features": []
          },
          {
            "icon": "car",
            "text": "车品",
            "_i": 7,
            "_g1": "#e0c3fc",
            "_g2": "#8ec5fc",
            "_features": []
          },
          {
            "icon": "gift",
            "text": "礼盒",
            "_i": 8,
            "_g1": "#ffecd2",
            "_g2": "#fcb69f",
            "_features": []
          },
          {
            "icon": "tag",
            "text": "清仓",
            "_i": 9,
            "_g1": "#ffb88c",
            "_g2": "#ff7a59",
            "_features": []
          }
        ],
        "columns": 5,
        "iconBg": "",
        "iconColor": "",
        "iconSize": 26,
        "fontSize": 12,
        "_g1": "#a8c0ff",
        "_g2": "#6f86d6"
      },
      "_s": "margin-top:20rpx;padding-top:28rpx;padding-bottom:28rpx;padding-left:16rpx;padding-right:16rpx;border-radius:28rpx;background:#ffffff",
      "_r": 14
    },
    {
      "id": "title_mteaoyz5_c",
      "type": "title",
      "props": {
        "content": "热门榜单",
        "sub": "实时更新",
        "more": true,
        "moreText": "更多",
        "align": "left",
        "size": 18,
        "color": "",
        "subColor": "",
        "_g1": "#ffd3a5",
        "_g2": "#fd6585"
      },
      "_s": "padding-top:32rpx;padding-bottom:16rpx;padding-left:28rpx;padding-right:28rpx",
      "_r": 12
    },
    {
      "id": "goods_mteaoyz5_d",
      "type": "goods",
      "props": {
        "layout": "list",
        "columns": 2,
        "showPrice": true,
        "items": [
          {
            "image": "",
            "name": "经典款风衣外套",
            "desc": "双层面料 · 抗皱免烫 · 三色",
            "price": "459",
            "origin": "699",
            "tag": "",
            "sales": "1832",
            "_i": 0,
            "_g1": "#96e6a1",
            "_g2": "#3ec48d",
            "_features": [],
            "_initial": "经"
          },
          {
            "image": "",
            "name": "高定衬衫",
            "desc": "新疆长绒棉 · 免烫工艺",
            "price": "189",
            "origin": "299",
            "tag": "",
            "sales": "2671",
            "_i": 1,
            "_g1": "#c2e9fb",
            "_g2": "#5b9df9",
            "_features": [],
            "_initial": "高"
          },
          {
            "image": "",
            "name": "直筒牛仔裤",
            "desc": "弹力面料 · 修饰腿型",
            "price": "169",
            "origin": "269",
            "tag": "",
            "sales": "3904",
            "_i": 2,
            "_g1": "#fbc2eb",
            "_g2": "#a18cd1",
            "_features": [],
            "_initial": "直"
          },
          {
            "image": "",
            "name": "羊毛针织开衫",
            "desc": "细针织 · 不起球",
            "price": "229",
            "origin": "389",
            "tag": "",
            "sales": "1208",
            "_i": 3,
            "_g1": "#f9d1c4",
            "_g2": "#e08b7a",
            "_features": [],
            "_initial": "羊"
          }
        ],
        "_g1": "#d4fc79",
        "_g2": "#4bbf8a"
      },
      "_s": "padding-top:12rpx;padding-bottom:20rpx;padding-left:24rpx;padding-right:24rpx",
      "_r": 0
    },
    {
      "id": "footer_mteaoyz5_e",
      "type": "footer",
      "props": {
        "text": "© 2026 示例科技有限公司 · 沪ICP备00000000号",
        "links": "关于我们 · 服务条款 · 隐私政策",
        "_g1": "#e0c3fc",
        "_g2": "#8ec5fc"
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
    wx.setNavigationBarTitle({ title: "全部分类" })
  },
  onShareAppMessage: function () {
    return { title: "全部分类", path: '/pages/category/index/index' }
  }
}))
