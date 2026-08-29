import type { TemplateDef } from '../types'
import { node as n } from '../core/registry'
import { page, tab, S, title, hero, noticeBar, searchBar, footer, myPage } from './kit'

/* ================================================================== */
/* 1. 电商商城                                                          */
/* ================================================================== */
const mall: TemplateDef = {
  id: 'mall',
  name: '电商商城',
  industry: '电商零售',
  desc: '完整的购物闭环：首页推荐、分类浏览、购物车结算、会员中心，含秒杀与优惠券。',
  cover: 'linear-gradient(135deg,#ff9a9e,#ff4d4f)',
  tags: ['多规格商品', '秒杀', '优惠券', '购物车'],
  build: () => ({
    name: '潮流生活商城',
    appid: 'touristappid',
    description: '一套开箱即用的电商小程序模板',
    templateId: 'mall',
    theme: {
      primary: '#ff4d4f',
      primaryLight: '#fff1f0',
      secondary: '#ff4d4f',
      accent: '#ffb020',
      text: '#1a1d28',
      subText: '#7b8494',
      background: '#f5f6f9',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '首页', 'home'],
        ['category', '分类', 'grid'],
        ['cart', '购物车', 'cart'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#ff4d4f' },
    ),
    pages: [
      page('home', '首页', '潮流生活', [
        searchBar('搜索 连衣裙 / 数码 / 家居'),
        hero([
          { title: '秋季新风尚 全场 5 折起', desc: '限时 3 天 · 叠加满减券' },
          { title: '新人专享 满 199 减 50', desc: '注册即领 3 张券' },
          { title: '会员日 双倍积分', desc: '每周三 0 点开抢' },
        ]),
        n('grid', {
          items: [
            { icon: 'bag', text: '女装', badge: '' },
            { icon: 'camera', text: '数码', badge: '' },
            { icon: 'home', text: '家居', badge: '' },
            { icon: 'coffee', text: '食品', badge: '' },
            { icon: 'heart', text: '美妆', badge: 'HOT' },
            { icon: 'dumbbell', text: '运动', badge: '' },
            { icon: 'book', text: '母婴', badge: '' },
            { icon: 'gift', text: '领券', badge: '' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('coupon', {
          items: [
            { amount: '20', condition: '满 99 可用', name: '新人券', tag: '领取' },
            { amount: '50', condition: '满 299 可用', name: '店铺券', tag: '领取' },
            { amount: '100', condition: '满 599 可用', name: '会员券', tag: '领取' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 4 }),
        n('seckill', {
          title: '限时秒杀',
          sub: '距结束 02:18:45',
          items: [
            { image: '', name: '轻奢通勤包', price: '59', origin: '129' },
            { image: '', name: '真丝方巾', price: '88', origin: '199' },
            { image: '', name: '香薰礼盒', price: '139', origin: '299' },
            { image: '', name: '保温杯', price: '39', origin: '89' },
          ],
        }, { ...S.card, paddingTop: 14, paddingBottom: 12 }),
        title('为你推荐', '根据浏览记录生成'),
        n('goods', {
          layout: 'grid',
          columns: 2,
          items: [
            { image: '', name: '法式复古连衣裙', desc: '垂坠感面料 · 显瘦版型', price: '279', origin: '459', tag: '热卖', sales: '2381' },
            { image: '', name: '轻薄羽绒马甲', desc: '90 白鸭绒 · 三色可选', price: '199', origin: '329', tag: '新品', sales: '1042' },
            { image: '', name: '真无线蓝牙耳机', desc: '主动降噪 · 40h 续航', price: '349', origin: '499', tag: '', sales: '5620' },
            { image: '', name: '北欧风陶瓷餐具', desc: '四件套 · 可入洗碗机', price: '128', origin: '218', tag: '折扣', sales: '863' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        n('serviceBar', {
          items: [
            { icon: 'shield', text: '正品保障' },
            { icon: 'truck', text: '极速发货' },
            { icon: 'repeat', text: '七天退换' },
            { icon: 'headset', text: '专属客服' },
          ],
        }, { paddingTop: 12, paddingBottom: 4 }),
        footer(),
      ]),
      page('category', '分类', '全部分类', [
        searchBar('搜索商品'),
        n('grid', {
          items: [
            { icon: 'bag', text: '女装' },
            { icon: 'camera', text: '数码' },
            { icon: 'home', text: '家居' },
            { icon: 'coffee', text: '食品' },
            { icon: 'heart', text: '美妆' },
            { icon: 'dumbbell', text: '运动' },
            { icon: 'book', text: '母婴' },
            { icon: 'car', text: '车品' },
            { icon: 'gift', text: '礼盒' },
            { icon: 'tag', text: '清仓' },
          ],
          columns: 5,
        }, { ...S.card, paddingLeft: 8, paddingRight: 8, paddingTop: 14, paddingBottom: 14, marginTop: 10 }),
        title('热门榜单', '实时更新'),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '经典款风衣外套', desc: '双层面料 · 抗皱免烫 · 三色', price: '459', origin: '699', tag: '', sales: '1832' },
            { image: '', name: '高定衬衫', desc: '新疆长绒棉 · 免烫工艺', price: '189', origin: '299', tag: '', sales: '2671' },
            { image: '', name: '直筒牛仔裤', desc: '弹力面料 · 修饰腿型', price: '169', origin: '269', tag: '', sales: '3904' },
            { image: '', name: '羊毛针织开衫', desc: '细针织 · 不起球', price: '229', origin: '389', tag: '', sales: '1208' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 10 }),
        footer(),
      ]),
      page('cart', '购物车', '购物车', [
        n('notice', { text: '🎉 满 299 减 50，再凑 ¥68 即可享受', icon: 'gift', more: false }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 6 }),
        n('goods', {
          layout: 'list',
          showPrice: true,
          items: [
            { image: '', name: '法式复古连衣裙', desc: '米白色 / M 码', price: '279', origin: '459', tag: '', sales: '' },
            { image: '', name: '真无线蓝牙耳机', desc: '星空黑 / 标准版', price: '349', origin: '499', tag: '', sales: '' },
            { image: '', name: '北欧风陶瓷餐具', desc: '四件套 / 奶油白', price: '128', origin: '218', tag: '', sales: '' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4, marginTop: 6 }),
        n('coupon', {
          items: [{ amount: '50', condition: '满 299 可用', name: '店铺满减券', tag: '去凑单' }],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 8 }),
        title('你可能还想要', ''),
        n('goods', {
          layout: 'row',
          items: [
            { image: '', name: '真丝方巾', desc: '多色可选', price: '88', origin: '199', tag: '', sales: '642' },
            { image: '', name: '香薰礼盒', desc: '送礼首选', price: '139', origin: '299', tag: '', sales: '318' },
            { image: '', name: '保温杯', desc: '316 不锈钢', price: '39', origin: '89', tag: '', sales: '2201' },
          ],
        }, { paddingTop: 4, paddingBottom: 20 }),
        n('cartBar', { total: '￥756.00', count: 3, buttonText: '去结算', tip: '已优惠 ￥50', fixed: true }),
      ]),
      page('my', '我的', '我的', myPage({
        stats: [
          { value: '3', label: '待付款' },
          { value: '2', label: '待收货' },
          { value: '12', label: '优惠券' },
          { value: '368', label: '积分' },
        ],
        desc: '黄金会员 · 成长值 3280',
        grid: [
          { icon: 'list', text: '全部订单' },
          { icon: 'cart', text: '购物车' },
          { icon: 'heart', text: '收藏夹' },
          { icon: 'pin', text: '收货地址' },
          { icon: 'headset', text: '客服中心' },
          { icon: 'coupon', text: '优惠券' },
          { icon: 'award', text: '会员中心' },
          { icon: 'gift', text: '邀请有礼' },
        ],
        banner: { title: '开通 PLUS 会员', sub: '全年免运费 · 专享 9 折', buttonText: '立即开通' },
        rows: [
          { icon: 'clock', label: '浏览足迹', value: '128 件' },
          { icon: 'truck', label: '物流查询', value: '' },
          { icon: 'message', label: '我的评价', value: '6 条待评' },
          { icon: 'phone', label: '联系客服', value: '400-888-8888', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 2. 餐饮点餐                                                          */
/* ================================================================== */
const food: TemplateDef = {
  id: 'food',
  name: '餐饮点餐',
  industry: '本地餐饮',
  desc: '扫码点餐、外卖下单、门店信息、订单进度与会员中心，餐厅数字化必备。',
  cover: 'linear-gradient(135deg,#ffd3a5,#ff7a1a)',
  tags: ['扫码点餐', '菜单分类', '订单进度', '到店自取'],
  build: () => ({
    name: '巷子里·融合菜',
    appid: 'touristappid',
    description: '餐饮门店点餐小程序模板',
    templateId: 'food',
    theme: {
      primary: '#ff7a1a',
      primaryLight: '#fff6ec',
      secondary: '#ff3b30',
      accent: '#ffb020',
      text: '#1f1d1a',
      subText: '#8b8177',
      background: '#f7f5f2',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '首页', 'home'],
        ['menu', '点餐', 'coffee'],
        ['order', '订单', 'list'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#ff7a1a' },
    ),
    pages: [
      page('home', '门店首页', '巷子里·融合菜', [
        searchBar('搜索菜品 / 套餐'),
        hero([
          { title: '招牌双人餐 限时 168', desc: '原价 268 · 含 6 道招牌' },
          { title: '工作日午市 7 折', desc: '11:00-14:00 到店专享' },
          { title: '生日当月 送长寿面', desc: '提前一天预订即可' },
        ], 158),
        n('grid', {
          items: [
            { icon: 'camera', text: '扫码点餐' },
            { icon: 'truck', text: '外卖配送' },
            { icon: 'calendar', text: '餐位预订' },
            { icon: 'clock', text: '排队取号' },
            { icon: 'gift', text: '优惠活动' },
            { icon: 'award', text: '会员权益' },
            { icon: 'message', text: '我要评价' },
            { icon: 'phone', text: '联系门店' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        noticeBar('🍜 今日推荐：秘制红烧肉，每日限量 30 份，售完即止'),
        n('shop', {
          name: '巷子里·融合菜（静安店）',
          desc: '本帮菜 · 川湘菜 · 人均 ¥88',
          tags: ['可停车', '有包间', '免费 WiFi'],
          rating: '4.8',
          address: '上海市静安区愚园路 128 号 1F',
          phone: '021-6666 8888',
          hours: '10:30 - 22:00',
        }, { ...S.card }),
        title('招牌必点', '店长推荐，点单率 TOP'),
        n('goods', {
          layout: 'row',
          items: [
            { image: '', name: '秘制红烧肉', desc: '招牌 · 肥而不腻', price: '68', origin: '88', tag: '招牌', sales: '2381' },
            { image: '', name: '藤椒鲈鱼', desc: '现杀 · 麻辣鲜香', price: '98', origin: '', tag: '', sales: '1642' },
            { image: '', name: '松茸鸡汤', desc: '文火慢炖 4h', price: '58', origin: '', tag: '新品', sales: '903' },
            { image: '', name: '手工小笼包', desc: '现包现蒸', price: '28', origin: '', tag: '', sales: '3120' },
          ],
        }, { paddingTop: 4, paddingBottom: 8 }),
        n('comment', {
          title: '食客评价',
          rating: '4.8',
          count: '3246',
          items: [
            { name: '王**', rating: 5, content: '红烧肉入口即化，服务也很到位，包间环境安静，家庭聚餐首选。', date: '08-27', tags: '味道赞,服务好' },
            { name: '李**', rating: 5, content: '午市套餐性价比很高，上菜速度快，工作日中午经常来。', date: '08-25', tags: '性价比高,上菜快' },
          ],
        }, { ...S.card }),
        footer('© 2026 巷子里餐饮管理有限公司'),
      ]),
      page('menu', '点餐', '点餐', [
        searchBar('搜索菜名'),
        n('tabs', { items: [{ text: '招牌推荐' }, { text: '热菜' }, { text: '凉菜' }, { text: '汤羹' }, { text: '主食' }, { text: '饮品' }], active: 0 }),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '秘制红烧肉', desc: '三层五花 · 慢炖 90 分钟 · 微甜口', price: '68', origin: '88', tag: '招牌', sales: '2381 份' },
            { image: '', name: '藤椒鲈鱼', desc: '鲜活鲈鱼 · 青花椒 · 中辣', price: '98', origin: '', tag: '', sales: '1642 份' },
            { image: '', name: '手撕包菜', desc: '猛火快炒 · 微辣', price: '32', origin: '', tag: '', sales: '2210 份' },
            { image: '', name: '松茸鸡汤', desc: '云南松茸 · 文火 4 小时', price: '58', origin: '', tag: '新品', sales: '903 份' },
            { image: '', name: '扬州炒饭', desc: '粒粒分明 · 可加蛋', price: '26', origin: '', tag: '', sales: '4520 份' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10, marginTop: 8 }),
        title('超值套餐', '更适合 2-4 人'),
        n('goods', {
          layout: 'grid',
          columns: 2,
          items: [
            { image: '', name: '双人招牌套餐', desc: '4 菜 1 汤 2 米饭', price: '168', origin: '268', tag: '省100', sales: '1208' },
            { image: '', name: '四人聚餐套餐', desc: '8 菜 1 汤 · 含招牌', price: '328', origin: '528', tag: '热销', sales: '762' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 20 }),
        n('cartBar', { total: '￥162.00', count: 3, buttonText: '去下单', tip: '已优惠 ￥26' }),
      ]),
      page('order', '订单', '我的订单', [
        n('tabs', { items: [{ text: '全部' }, { text: '待付款' }, { text: '制作中' }, { text: '待评价' }, { text: '已完成' }], active: 2 }),
        n('timeline', {
          items: [
            { time: '今天 12:36', title: '订单已下单，等待商家确认', desc: '双人招牌套餐 ×1 · 秘制红烧肉 ×1' },
            { time: '今天 12:38', title: '商家已接单，正在备餐', desc: '预计 15 分钟后出餐' },
            { time: '今天 12:52', title: '出餐完成，等待上桌', desc: '桌号 A12 · 服务员正在配送' },
            { time: '待完成', title: '用餐完成，欢迎评价', desc: '评价可得 20 积分' },
          ],
        }, { ...S.card, marginTop: 8 }),
        title('历史订单', ''),
        n('article', {
          items: [
            { image: '', title: '巷子里·融合菜（静安店）', desc: '四人聚餐套餐 ×1 · 已完成', author: '¥328.00', date: '08-20', views: '已评价' },
            { image: '', title: '巷子里·融合菜（静安店）', desc: '双人招牌套餐 ×1 · 已完成', author: '¥168.00', date: '08-11', views: '已评价' },
            { image: '', title: '巷子里·融合菜（静安店）', desc: '秘制红烧肉 ×2 · 已退款', author: '¥136.00', date: '07-29', views: '已关闭' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('my', '我的', '我的', myPage({
        name: '美食达人 · 小明',
        desc: '白银会员 · 积分 1280',
        stats: [
          { value: '28', label: '用餐次数' },
          { value: '1280', label: '积分' },
          { value: '5', label: '优惠券' },
          { value: '3', label: '收藏门店' },
        ],
        grid: [
          { icon: 'list', text: '我的订单' },
          { icon: 'calendar', text: '餐位预订' },
          { icon: 'coupon', text: '优惠券' },
          { icon: 'heart', text: '收藏菜品' },
          { icon: 'pin', text: '地址管理' },
          { icon: 'headset', text: '门店客服' },
          { icon: 'award', text: '会员权益' },
          { icon: 'message', text: '我的评价' },
        ],
        banner: { title: '充值 500 送 80', sub: '会员储值 · 全门店通用', buttonText: '立即充值' },
        rows: [
          { icon: 'gift', label: '邀请好友', value: '各得 30 元券' },
          { icon: 'shield', label: '发票管理', value: '' },
          { icon: 'phone', label: '门店电话', value: '021-6666 8888', action: '拨打' },
          { icon: 'clock', label: '营业时间', value: '10:30 - 22:00' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 3. 美业预约                                                          */
/* ================================================================== */
const beauty: TemplateDef = {
  id: 'beauty',
  name: '美业预约',
  industry: '美业服务',
  desc: '美容美发、美甲美睫门店专属：项目展示、技师介绍、在线预约与门店导航。',
  cover: 'linear-gradient(135deg,#fbc2eb,#e8618c)',
  tags: ['在线预约', '技师展示', '门店导航', '会员卡'],
  build: () => ({
    name: '悦己美学空间',
    appid: 'touristappid',
    description: '美业门店预约小程序模板',
    templateId: 'beauty',
    theme: {
      primary: '#e8618c',
      primaryLight: '#fff0f5',
      secondary: '#e8618c',
      accent: '#ffb020',
      text: '#241c22',
      subText: '#8b7d85',
      background: '#f8f5f7',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '首页', 'home'],
        ['service', '项目', 'grid'],
        ['booking', '预约', 'calendar'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#e8618c' },
    ),
    pages: [
      page('home', '首页', '悦己美学空间', [
        hero([
          { title: '秋季焕肤季 5 折起', desc: '深层清洁 · 补水嫩肤' },
          { title: '新客专享 99 元体验', desc: '含面部护理 60 分钟' },
          { title: '储值 1000 送 300', desc: '全项目通用 · 不限时' },
        ]),
        n('grid', {
          items: [
            { icon: 'heart', text: '面部护理' },
            { icon: 'sparkles', text: '身体 SPA' },
            { icon: 'scissors', text: '美发造型' },
            { icon: 'edit', text: '美甲美睫' },
            { icon: 'calendar', text: '在线预约' },
            { icon: 'users', text: '技师团队' },
            { icon: 'gift', text: '会员卡' },
            { icon: 'phone', text: '联系门店' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('stats', {
          items: [
            { value: '8', label: '年品牌沉淀' },
            { value: '3.6w', label: '累计服务' },
            { value: '4.9', label: '大众评分' },
            { value: '26', label: '专业技师' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, radius: 14 }),
        title('热门项目', '本月预约 TOP'),
        n('goods', {
          layout: 'grid',
          columns: 2,
          items: [
            { image: '', name: '深层清洁补水', desc: '60 分钟 · 适合所有肤质', price: '298', origin: '498', tag: '热销', sales: '1862' },
            { image: '', name: '法式美甲单色', desc: '含修手 · 甲型设计', price: '168', origin: '238', tag: '', sales: '2340' },
            { image: '', name: '轻氧头皮 SPA', desc: '45 分钟 · 控油蓬松', price: '258', origin: '398', tag: '新品', sales: '943' },
            { image: '', name: '肩颈舒缓按摩', desc: '70 分钟 · 精油开背', price: '368', origin: '568', tag: '推荐', sales: '1276' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        title('明星技师', '预约可指定'),
        n('team', {
          items: [
            { avatar: '', name: '林薇', title: '高级美容师', desc: '从业 9 年 · 擅长敏感肌修复与抗衰护理', tags: '皮肤管理,抗衰' },
            { avatar: '', name: '苏晴', title: '资深美甲师', desc: '日式美甲认证 · 擅长晕染与延长', tags: '日式美甲,延长' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        n('comment', {
          title: '客户评价',
          rating: '4.9',
          count: '2874',
          items: [
            { name: '张**', rating: 5, content: '环境很舒服，技师手法专业，做完皮肤状态明显好了很多，已经办了年卡。', date: '08-26', tags: '手法专业,环境好' },
            { name: '周**', rating: 5, content: '预约很方便，到店不用等，美甲做了三周还很完整。', date: '08-21', tags: '持久度高,服务好' },
          ],
        }, { ...S.card }),
        footer('© 2026 悦己美学 · 静安旗舰店'),
      ]),
      page('service', '项目', '全部项目', [
        searchBar('搜索项目 / 技师'),
        n('tabs', { items: [{ text: '面部' }, { text: '身体' }, { text: '美发' }, { text: '美甲' }, { text: '美睫' }], active: 0 }),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '深层清洁补水', desc: '60 分钟 · 深层清洁 + 玻尿酸导入 + 舒缓面膜', price: '298', origin: '498', tag: '热销', sales: '1862 人做过' },
            { image: '', name: '黄金焕肤抗衰', desc: '90 分钟 · RF 射频 + 黄金精华导入', price: '698', origin: '1280', tag: '', sales: '642 人做过' },
            { image: '', name: '痘肌调理套餐', desc: '75 分钟 · 清痘 + 消炎 + 修复', price: '398', origin: '598', tag: '新品', sales: '318 人做过' },
            { image: '', name: '轻氧头皮 SPA', desc: '45 分钟 · 头皮检测 + 深层清洁', price: '258', origin: '398', tag: '', sales: '943 人做过' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10, marginTop: 8 }),
        title('会员套餐', '越买越划算'),
        n('priceCard', {
          items: [
            { name: '体验卡', price: '99', period: '/ 次', features: '任选 1 个基础项目\n60-90 分钟\n新客专享', highlight: false, btnText: '立即体验' },
            { name: '季卡', price: '1680', period: '/ 季', features: '12 次项目任选\n专属技师\n生日礼遇\n免费茶点', highlight: true, btnText: '立即购买' },
            { name: '年卡', price: '5680', period: '/ 年', features: '60 次项目任选\nVIP 包间\n优先预约\n家属共享 10 次', highlight: false, btnText: '咨询顾问' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 16 }),
      ]),
      page('booking', '预约', '在线预约', [
        n('shop', {
          name: '悦己美学空间（静安店）',
          desc: '静安区 · 营业中 · 今日可约',
          tags: ['地铁直达', '免费停车', '独立包间'],
          rating: '4.9',
          address: '上海市静安区南京西路 1266 号 5F',
          phone: '021-6688 6688',
          hours: '10:00 - 22:00',
        }, { ...S.card, marginTop: 10 }),
        n('form', {
          title: '填写预约信息',
          fields: [
            { label: '姓名', type: 'text', placeholder: '请输入您的称呼', required: true },
            { label: '手机号', type: 'phone', placeholder: '用于接收预约确认', required: true },
            { label: '预约项目', type: 'picker', placeholder: '请选择服务项目', required: true },
            { label: '预约时间', type: 'date', placeholder: '请选择到店时间', required: true },
            { label: '指定技师', type: 'picker', placeholder: '不指定（可选）', required: false },
            { label: '备注', type: 'textarea', placeholder: '如有特殊需求请说明', required: false },
          ],
          submitText: '提交预约',
          tip: '提交后顾问将在 10 分钟内与您电话确认',
        }, { ...S.card }),
        n('steps', {
          direction: 'row',
          items: [
            { icon: 'search', title: '选项目', desc: '浏览并挑选' },
            { icon: 'calendar', title: '约时间', desc: '选择到店时段' },
            { icon: 'check', title: '填信息', desc: '提交联系方式' },
            { icon: 'heart', title: '到店享受', desc: '专属服务' },
          ],
        }, { ...S.card }),
        n('map', {
          title: '悦己美学空间（静安店）',
          address: '上海市静安区南京西路 1266 号 5F',
          distance: '距您 1.8km',
          buttonText: '导航前往',
        }, { ...S.card }),
        n('contact', {
          items: [
            { icon: 'phone', label: '门店电话', value: '021-6688 6688', action: '拨打' },
            { icon: 'message', label: '客服微信', value: 'yueji_meixue', action: '复制' },
            { icon: 'clock', label: '营业时间', value: '周一至周日 10:00-22:00', action: '' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('my', '我的', '我的', myPage({
        name: '会员 · 安琪',
        desc: '钻石会员 · 剩余 32 次',
        stats: [
          { value: '2', label: '待到店' },
          { value: '32', label: '剩余次数' },
          { value: '4', label: '优惠券' },
          { value: '1.2w', label: '累计消费' },
        ],
        grid: [
          { icon: 'calendar', text: '我的预约' },
          { icon: 'list', text: '消费记录' },
          { icon: 'gift', text: '我的卡包' },
          { icon: 'heart', text: '收藏项目' },
          { icon: 'users', text: '我的技师' },
          { icon: 'coupon', text: '优惠券' },
          { icon: 'headset', text: '专属顾问' },
          { icon: 'message', text: '我的评价' },
        ],
        banner: { title: '邀请好友各得 100', sub: '好友首次到店即可到账', buttonText: '去邀请' },
        rows: [
          { icon: 'award', label: '会员等级', value: '钻石会员' },
          { icon: 'pin', label: '常用门店', value: '静安店' },
          { icon: 'phone', label: '联系顾问', value: 'Linda · 138****8888', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 4. 企业官网                                                          */
/* ================================================================== */
const corp: TemplateDef = {
  id: 'corp',
  name: '企业官网',
  industry: '企业服务',
  desc: '企业形象展示：业务矩阵、产品方案、客户案例、发展历程与联系方式。',
  cover: 'linear-gradient(135deg,#a8c0ff,#3459f7)',
  tags: ['品牌展示', '产品方案', '客户案例', '招商加盟'],
  build: () => ({
    name: '智联云科技',
    appid: 'touristappid',
    description: '企业官网展示型小程序模板',
    templateId: 'corp',
    theme: {
      primary: '#3459f7',
      primaryLight: '#eef4ff',
      secondary: '#ff6b35',
      accent: '#00c48c',
      text: '#141824',
      subText: '#6b7488',
      background: '#f4f6fa',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '首页', 'home'],
        ['product', '产品', 'grid'],
        ['case', '案例', 'briefcase'],
        ['about', '关于', 'user'],
      ],
      { selectedColor: '#3459f7' },
    ),
    pages: [
      page('home', '首页', '智联云科技', [
        hero([
          { title: '一站式企业数字化解决方案', desc: '已服务 3000+ 中大型企业' },
          { title: 'AI 智能中台 全新发布', desc: '降本 40% · 提效 3 倍' },
          { title: '免费预约产品演示', desc: '专属顾问 1v1 讲解' },
        ], 176),
        n('stats', {
          items: [
            { value: '3000+', label: '服务企业' },
            { value: '12', label: '年行业经验' },
            { value: '99.9%', label: '系统可用性' },
            { value: '36', label: '服务城市' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, radius: 14 }),
        title('核心业务', ''),
        n('grid', {
          items: [
            { icon: 'layout', text: '数字中台' },
            { icon: 'sparkles', text: 'AI 应用' },
            { icon: 'shield', text: '数据安全' },
            { icon: 'briefcase', text: '协同办公' },
            { icon: 'cart', text: '智慧零售' },
            { icon: 'truck', text: '供应链' },
            { icon: 'headset', text: '运维服务' },
            { icon: 'award', text: '咨询培训' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        title('产品方案', '按需组合，快速落地'),
        n('goods', {
          layout: 'list',
          showPrice: false,
          items: [
            { image: '', name: '企业数字中台', desc: '打通数据孤岛，统一业务口径，支撑前台快速创新。', price: '', origin: '', tag: '核心', sales: '1200+ 客户' },
            { image: '', name: 'AI 智能客服', desc: '大模型驱动的问答引擎，自动解决 85% 常见咨询。', price: '', origin: '', tag: '热门', sales: '860+ 客户' },
            { image: '', name: '数据可视化平台', desc: '拖拽式报表搭建，分钟级完成经营看板。', price: '', origin: '', tag: '', sales: '1500+ 客户' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10 }),
        n('banner', { title: '预约 1v1 产品演示', sub: '30 分钟讲清你能拿到什么', buttonText: '免费预约' }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 8 }),
        title('客户案例', ''),
        n('article', {
          items: [
            { image: '', title: '某零售集团：全渠道数字化升级', desc: '6 个月完成 800 家门店系统统一，库存周转提升 32%', author: '零售行业', date: '08-24', views: '3200' },
            { image: '', title: '某制造企业：智能工厂改造', desc: '设备联网率 98%，异常停机时间下降 65%', author: '制造行业', date: '08-18', views: '2860' },
            { image: '', title: '某金融机构：数据合规治理', desc: '一次性通过监管审计，数据调用效率提升 4 倍', author: '金融行业', date: '08-10', views: '2140' },
          ],
        }, { ...S.card }),
        n('serviceBar', {
          items: [
            { icon: 'shield', text: '等保三级' },
            { icon: 'award', text: 'CMMI5' },
            { icon: 'headset', text: '7×24 支持' },
            { icon: 'check', text: '源码交付' },
          ],
        }, { paddingTop: 12, paddingBottom: 4 }),
        footer('© 2026 智联云科技有限公司 · 沪ICP备00000000号'),
      ]),
      page('product', '产品', '产品中心', [
        n('tabs', { items: [{ text: '全部' }, { text: '数据中台' }, { text: 'AI 应用' }, { text: '协同办公' }, { text: '安全合规' }], active: 0 }),
        n('goods', {
          layout: 'grid',
          columns: 2,
          showPrice: false,
          items: [
            { image: '', name: '企业数字中台', desc: '统一数据与业务底座', price: '', origin: '', tag: '核心', sales: '1200+' },
            { image: '', name: 'AI 智能客服', desc: '大模型问答引擎', price: '', origin: '', tag: '热门', sales: '860+' },
            { image: '', name: '数据可视化', desc: '拖拽式经营看板', price: '', origin: '', tag: '', sales: '1500+' },
            { image: '', name: '协同办公套件', desc: '审批 / 文档 / 日程', price: '', origin: '', tag: '', sales: '2100+' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 8 }),
        title('服务报价', '透明定价，按需选择'),
        n('priceCard', {
          items: [
            { name: '标准版', price: '9800', period: '/ 年', features: '5 个账号\n基础功能模块\n工单支持\n公有云部署', highlight: false, btnText: '立即咨询' },
            { name: '专业版', price: '36800', period: '/ 年', features: '30 个账号\n全量功能模块\n专属客户成功\n私有化可选\n定制报表', highlight: true, btnText: '预约演示' },
            { name: '旗舰版', price: '定制', period: '', features: '不限账号\n源码交付\n独立部署\n专属研发团队\n7×24 响应', highlight: false, btnText: '联系销售' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 12 }),
        n('faq', {
          items: [
            { q: '支持私有化部署吗？', a: '专业版及以上均支持私有化部署，可部署在客户自有服务器或指定云环境。' },
            { q: '实施周期大概多久？', a: '标准版通常 1-2 周完成上线，专业版根据定制范围约 4-8 周。' },
            { q: '是否提供试用？', a: '提供 15 天全功能免费试用，并配备专属顾问协助完成 POC 验证。' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('case', '案例', '客户案例', [
        n('tabs', { items: [{ text: '全部' }, { text: '零售' }, { text: '制造' }, { text: '金融' }, { text: '医疗' }], active: 0 }),
        n('article', {
          items: [
            { image: '', title: '某零售集团：全渠道数字化升级', desc: '6 个月完成 800 家门店系统统一，库存周转提升 32%，人力成本下降 18%。', author: '零售', date: '08-24', views: '3200' },
            { image: '', title: '某制造企业：智能工厂改造', desc: '设备联网率 98%，异常停机时间下降 65%，质检效率提升 3 倍。', author: '制造', date: '08-18', views: '2860' },
            { image: '', title: '某城商行：数据中台建设', desc: '打通 12 个业务系统，报表产出从 3 天缩短到 2 小时。', author: '金融', date: '08-12', views: '2410' },
            { image: '', title: '某三甲医院：智慧随访系统', desc: '随访覆盖率从 41% 提升至 89%，患者满意度提高 22 分。', author: '医疗', date: '08-05', views: '1980' },
          ],
        }, { ...S.card, marginTop: 8 }),
        n('stats', {
          items: [
            { value: '32%', label: '平均库存周转提升' },
            { value: '65%', label: '停机时间下降' },
            { value: '4x', label: '数据调用提效' },
            { value: '98%', label: '客户续约率' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, radius: 14 }),
        n('comment', {
          title: '客户口碑',
          rating: '4.9',
          count: '1268',
          items: [
            { name: '某零售集团 CIO', rating: 5, content: '实施团队非常专业，系统上线后业务侧反馈很好，二期已经追加采购。', date: '08-20', tags: '实施专业,效果显著' },
            { name: '某制造企业 IT 总监', rating: 5, content: '设备数据采集稳定，告警及时，帮我们避免了很多次产线停机。', date: '08-14', tags: '稳定可靠,响应快' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('about', '关于', '关于我们', [
        n('swiper', {
          items: [{ image: '', title: '让每一家企业都用得起数字化', desc: '成立于 2014 年 · 上海' }],
          height: 150,
          radius: 14,
          indicator: 'none',
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 6 }),
        n('text', {
          content:
            '智联云科技成立于 2014 年，是一家专注企业数字化转型的技术服务商。我们坚持"技术落地业务"的理念，为零售、制造、金融、医疗等行业客户提供从咨询规划到系统落地的全链路服务。\n\n目前公司拥有研发人员 300 余人，累计获得软件著作权 86 项，服务客户覆盖全国 36 个城市。',
          size: 13,
          color: '#5b6472',
          lineHeight: 1.85,
        }, { ...S.card, paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14 }),
        title('发展历程', ''),
        n('timeline', {
          items: [
            { time: '2026', title: 'AI 智能中台正式发布', desc: '接入主流大模型，为企业提供开箱即用的 AI 能力' },
            { time: '2023', title: '服务客户突破 3000 家', desc: '完成 B+ 轮融资，估值超 20 亿' },
            { time: '2019', title: '获得 CMMI5 认证', desc: '研发流程通过国际最高等级评估' },
            { time: '2014', title: '公司成立于上海', desc: '创始团队来自头部互联网与咨询公司' },
          ],
        }, { ...S.card }),
        title('核心团队', ''),
        n('team', {
          items: [
            { avatar: '', name: '陈立言', title: '创始人 & CEO', desc: '前头部科技公司事业部总经理，连续创业者', tags: '战略,增长' },
            { avatar: '', name: '沈亦然', title: 'CTO', desc: '十五年架构经验，主导多个千万级并发系统', tags: '架构,研发' },
            { avatar: '', name: '何清', title: '客户成功负责人', desc: '服务过 500+ 中大型企业数字化项目', tags: '交付,服务' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        n('map', { title: '智联云科技 · 上海总部', address: '上海市杨浦区创智天地 3 号楼 12F', distance: '地铁 10 号线', buttonText: '导航前往' }, { ...S.card }),
        n('contact', {
          items: [
            { icon: 'phone', label: '商务合作', value: '400-888-0000', action: '拨打' },
            { icon: 'message', label: '企业邮箱', value: 'business@zhilianyun.com', action: '复制' },
            { icon: 'pin', label: '公司地址', value: '上海市杨浦区创智天地 3 号楼 12F', action: '导航' },
            { icon: 'clock', label: '工作时间', value: '周一至周五 09:00-18:30', action: '' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
    ],
  }),
}

/* ================================================================== */
/* 5. 教育培训                                                          */
/* ================================================================== */
const edu: TemplateDef = {
  id: 'edu',
  name: '教育培训',
  industry: '教育培训',
  desc: '课程展示、名师介绍、试听报名与学习中心，适用于 K12、职教与兴趣机构。',
  cover: 'linear-gradient(135deg,#c2e9fb,#3b6ef5)',
  tags: ['课程分类', '名师团队', '试听报名', '学习中心'],
  build: () => ({
    name: '启明在线学堂',
    appid: 'touristappid',
    description: '教育机构课程小程序模板',
    templateId: 'edu',
    theme: {
      primary: '#3b6ef5',
      primaryLight: '#eef4ff',
      secondary: '#ff6b35',
      accent: '#00c48c',
      text: '#151b2b',
      subText: '#6b7488',
      background: '#f4f6fa',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '首页', 'home'],
        ['course', '课程', 'book'],
        ['teacher', '名师', 'users'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#3b6ef5' },
    ),
    pages: [
      page('home', '首页', '启明在线学堂', [
        searchBar('搜索课程 / 老师'),
        hero([
          { title: '暑期特训营 限时 6 折', desc: '限前 200 名 · 送全套资料' },
          { title: '0 元试听课 免费领', desc: '任选一门 · 45 分钟 1v1' },
          { title: '老学员续费立减 500', desc: '活动截止 8 月 31 日' },
        ]),
        n('grid', {
          items: [
            { icon: 'book', text: '少儿编程' },
            { icon: 'edit', text: '学科辅导' },
            { icon: 'message', text: '语言培训' },
            { icon: 'camera', text: '美术书法' },
            { icon: 'play', text: '免费试听' },
            { icon: 'calendar', text: '课程表' },
            { icon: 'award', text: '学员作品' },
            { icon: 'headset', text: '课程顾问' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('stats', {
          items: [
            { value: '8.6w', label: '在读学员' },
            { value: '1200', label: '签约讲师' },
            { value: '96%', label: '完课率' },
            { value: '4.9', label: '学员评分' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, radius: 14 }),
        title('热门课程', '本周报名最多'),
        n('goods', {
          layout: 'grid',
          columns: 2,
          items: [
            { image: '', name: 'Python 少儿编程入门', desc: '32 课时 · 适合 8-12 岁', price: '1980', origin: '3280', tag: '热报', sales: '1268' },
            { image: '', name: '初中数学思维提升', desc: '48 课时 · 同步校内', price: '2680', origin: '3980', tag: '', sales: '2041' },
            { image: '', name: '雅思 7 分冲刺班', desc: '60 课时 · 小班教学', price: '4980', origin: '6980', tag: '限时', sales: '862' },
            { image: '', name: '零基础素描课', desc: '24 课时 · 一对一指导', price: '1580', origin: '2380', tag: '', sales: '573' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        title('名师团队', '平均教龄 8 年'),
        n('team', {
          items: [
            { avatar: '', name: '顾清和', title: '少儿编程主讲', desc: '前大厂工程师 · 累计授课 5000+ 课时', tags: 'Python,算法' },
            { avatar: '', name: '苏晚', title: '英语教研负责人', desc: '雅思 8.5 · 十年出国考试教学经验', tags: '雅思,口语' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        n('comment', {
          title: '学员评价',
          rating: '4.9',
          count: '6428',
          items: [
            { name: '家长 王女士', rating: 5, content: '孩子特别喜欢编程课，老师讲得生动，现在能自己写小游戏了。', date: '08-26', tags: '老师负责,孩子喜欢' },
            { name: '学员 小陈', rating: 5, content: '雅思从 5.5 提到 7 分，写作模板和批改非常有用。', date: '08-19', tags: '提分明显,批改细致' },
          ],
        }, { ...S.card }),
        footer('© 2026 启明在线教育科技'),
      ]),
      page('course', '课程', '全部课程', [
        searchBar('搜索课程'),
        n('tabs', { items: [{ text: '全部' }, { text: '少儿编程' }, { text: '学科辅导' }, { text: '语言' }, { text: '兴趣' }], active: 0 }),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: 'Python 少儿编程入门', desc: '32 课时 · 直播 + 录播 · 赠送硬件套件', price: '1980', origin: '3280', tag: '热报', sales: '1268 人报名' },
            { image: '', name: 'Scratch 创意编程', desc: '24 课时 · 适合 6-9 岁零基础', price: '1280', origin: '1980', tag: '', sales: '2340 人报名' },
            { image: '', name: '初中数学思维提升', desc: '48 课时 · 同步校内 · 含阶段测评', price: '2680', origin: '3980', tag: '', sales: '2041 人报名' },
            { image: '', name: '高中物理重难点突破', desc: '40 课时 · 名校讲师授课', price: '2980', origin: '4280', tag: '新品', sales: '687 人报名' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10, marginTop: 8 }),
        title('学习路径', '循序渐进，效果可见'),
        n('steps', {
          direction: 'column',
          items: [
            { icon: 'search', title: '基础入门（第 1-8 课时）', desc: '建立知识框架，掌握核心概念与工具使用' },
            { icon: 'edit', title: '进阶实战（第 9-24 课时）', desc: '完成 6 个完整项目，积累实战经验' },
            { icon: 'award', title: '项目冲刺（第 25-32 课时）', desc: '独立作品输出，获得结课证书与作品集' },
          ],
        }, { ...S.card }),
        n('form', {
          title: '免费预约试听',
          fields: [
            { label: '学生姓名', type: 'text', placeholder: '请输入学生姓名', required: true },
            { label: '家长手机', type: 'phone', placeholder: '请输入手机号', required: true },
            { label: '意向课程', type: 'picker', placeholder: '请选择课程', required: true },
            { label: '期望时间', type: 'date', placeholder: '请选择试听时间', required: false },
          ],
          submitText: '预约试听',
          tip: '顾问将在 1 个工作日内与您联系',
        }, { ...S.card }),
      ]),
      page('teacher', '名师', '名师团队', [
        n('tabs', { items: [{ text: '全部' }, { text: '编程' }, { text: '学科' }, { text: '语言' }, { text: '艺术' }], active: 0 }),
        n('team', {
          items: [
            { avatar: '', name: '顾清和', title: '少儿编程主讲', desc: '前大厂工程师 · 累计授课 5000+ 课时 · 带出 12 位信息学奥赛获奖学员', tags: 'Python,C++,算法' },
            { avatar: '', name: '苏晚', title: '英语教研负责人', desc: '雅思 8.5 · 十年出国考试教学经验 · 出版教材 3 部', tags: '雅思,口语,写作' },
            { avatar: '', name: '林知远', title: '数学竞赛教练', desc: '省级优秀教师 · 带出清华北大生源 46 人', tags: '奥数,中考,高考' },
            { avatar: '', name: '叶青', title: '美术主讲', desc: '美院硕士 · 作品多次入选省级展览', tags: '素描,水彩,速写' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10 }),
        n('stats', {
          items: [
            { value: '1200', label: '签约讲师' },
            { value: '8', label: '平均教龄' },
            { value: '5', label: '轮筛选' },
            { value: '96%', label: '好评率' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 8, radius: 14 }),
        n('faq', {
          items: [
            { q: '可以中途换老师吗？', a: '可以。若对授课风格不满意，可随时申请更换，不额外收费。' },
            { q: '课程有效期多久？', a: '录播课程有效期 24 个月，直播课程回放保留 12 个月。' },
            { q: '不满意可以退款吗？', a: '前 4 课时内可无理由全额退款，超过后按剩余课时比例退款。' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('my', '我的', '学习中心', myPage({
        name: '学员 · 小宇',
        desc: '在读 3 门课程 · 累计学时 86h',
        stats: [
          { value: '3', label: '在读课程' },
          { value: '86', label: '累计学时' },
          { value: '12', label: '完成作品' },
          { value: '2', label: '获得证书' },
        ],
        grid: [
          { icon: 'play', text: '继续学习' },
          { icon: 'calendar', text: '课程表' },
          { icon: 'list', text: '我的订单' },
          { icon: 'heart', text: '收藏课程' },
          { icon: 'award', text: '我的证书' },
          { icon: 'edit', text: '作业提交' },
          { icon: 'message', text: '课后评价' },
          { icon: 'headset', text: '课程顾问' },
        ],
        banner: { title: '邀请好友各得 200', sub: '好友首单立减 · 你得好课券', buttonText: '去邀请' },
        rows: [
          { icon: 'book', label: '学习报告', value: '本周已学 6.5h' },
          { icon: 'users', label: '我的班主任', value: '李老师' },
          { icon: 'phone', label: '客服电话', value: '400-666-0000', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 6. 房产租房                                                          */
/* ================================================================== */
const house: TemplateDef = {
  id: 'house',
  name: '房产租房',
  industry: '房产家居',
  desc: '房源列表、筛选找房、房源详情与经纪人联系，长租公寓与中介门店通用。',
  cover: 'linear-gradient(135deg,#96e6a1,#2f8f6b)',
  tags: ['房源筛选', '地图找房', '经纪人', '预约看房'],
  build: () => ({
    name: '安居好房',
    appid: 'touristappid',
    description: '房产租房小程序模板',
    templateId: 'house',
    theme: {
      primary: '#2f8f6b',
      primaryLight: '#eaf7f1',
      secondary: '#ff6b35',
      accent: '#ffb020',
      text: '#16211d',
      subText: '#6b7a75',
      background: '#f4f7f6',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '找房', 'home'],
        ['list', '房源', 'grid'],
        ['detail', '详情', 'pin'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#2f8f6b' },
    ),
    pages: [
      page('home', '找房', '安居好房', [
        searchBar('搜索小区 / 地铁 / 区域'),
        n('grid', {
          items: [
            { icon: 'home', text: '整租' },
            { icon: 'users', text: '合租' },
            { icon: 'pin', text: '地图找房' },
            { icon: 'camera', text: 'VR 看房' },
            { icon: 'calendar', text: '预约看房' },
            { icon: 'briefcase', text: '租房百科' },
            { icon: 'headset', text: '管家服务' },
            { icon: 'tag', text: '特价房源' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14, marginTop: 8 }),
        n('banner', { title: '毕业季租房补贴', sub: '认证学生立减一个月租金', buttonText: '立即认证' }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 8 }),
        title('精选好房', '真房源 · 已核验'),
        n('goods', {
          layout: 'row',
          items: [
            { image: '', name: '静安寺 · 精装一居', desc: '58㎡ · 朝南 · 近地铁', price: '6800', origin: '7500', tag: '直降', sales: '' },
            { image: '', name: '徐家汇 · 两室一厅', desc: '86㎡ · 全新装修', price: '9200', origin: '', tag: '', sales: '' },
            { image: '', name: '陆家嘴 · 江景公寓', desc: '42㎡ · 拎包入住', price: '7800', origin: '', tag: '新上', sales: '' },
          ],
        }, { paddingTop: 4, paddingBottom: 8 }),
        title('热门小区', ''),
        n('article', {
          items: [
            { image: '', title: '静安府', desc: '静安区 · 在租 86 套 · 均价 7200 元/月', author: '2018 年建成', date: '地铁 2/7 号线', views: '1286 人关注' },
            { image: '', title: '汇成新苑', desc: '徐汇区 · 在租 42 套 · 均价 5800 元/月', author: '2015 年建成', date: '地铁 1/9 号线', views: '893 人关注' },
            { image: '', title: '海悦花园', desc: '浦东新区 · 在租 63 套 · 均价 6500 元/月', author: '2019 年建成', date: '地铁 4 号线', views: '1042 人关注' },
          ],
        }, { ...S.card }),
        n('serviceBar', {
          items: [
            { icon: 'shield', text: '真房源' },
            { icon: 'tag', text: '押一付一' },
            { icon: 'headset', text: '专属管家' },
            { icon: 'check', text: '免中介费' },
          ],
        }, { paddingTop: 12, paddingBottom: 4 }),
        footer('© 2026 安居好房信息科技'),
      ]),
      page('list', '房源', '房源列表', [
        searchBar('搜索小区 / 区域'),
        n('tabs', { items: [{ text: '不限' }, { text: '整租' }, { text: '合租' }, { text: '一居' }, { text: '两居' }, { text: '三居+' }], active: 0 }),
        n('notice', { text: '📍 当前定位：上海市静安区 · 已为你筛选附近 156 套房源', icon: 'pin', more: false }, { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 6 }),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '静安寺 · 精装一居室', desc: '58㎡ · 12F/28F · 朝南 · 独立卫浴 · 近地铁 2 号线', price: '6800', origin: '7500', tag: '直降700', sales: '3 人看过' },
            { image: '', name: '曹家渡 · 两室一厅', desc: '86㎡ · 6F/18F · 南北通透 · 全新装修 · 家电齐全', price: '9200', origin: '', tag: '新上', sales: '7 人看过' },
            { image: '', name: '中山公园 · 一室一厅', desc: '48㎡ · 15F/32F · 精装修 · 拎包入住', price: '5600', origin: '6200', tag: '', sales: '12 人看过' },
            { image: '', name: '大宁 · 三室两厅', desc: '128㎡ · 8F/26F · 豪华装修 · 带车位', price: '14800', origin: '', tag: '优选', sales: '5 人看过' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10 }),
        n('map', { title: '地图找房', address: '已为你标注 156 套房源位置', distance: '上海市静安区', buttonText: '查看地图' }, { ...S.card }),
        n('form', {
          title: '委托找房',
          fields: [
            { label: '称呼', type: 'text', placeholder: '请输入您的称呼', required: true },
            { label: '手机号', type: 'phone', placeholder: '请输入手机号', required: true },
            { label: '期望区域', type: 'picker', placeholder: '请选择区域', required: false },
            { label: '预算范围', type: 'picker', placeholder: '请选择预算', required: false },
          ],
          submitText: '提交需求',
          tip: '提交后 30 分钟内为您匹配合适房源',
        }, { ...S.card }),
        footer(),
      ]),
      page('detail', '详情', '房源详情', [
        n('swiper', {
          items: [
            { image: '', title: '静安寺 · 精装一居室', desc: '1/5 · 客厅' },
            { image: '', title: '静安寺 · 精装一居室', desc: '2/5 · 主卧' },
            { image: '', title: '静安寺 · 精装一居室', desc: '3/5 · 厨房' },
          ],
          height: 220,
          radius: 0,
          indicator: 'number',
        }, { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }),
        n('text', {
          content: '静安寺 · 精装一居室\n6800 元/月  押一付一\n58㎡ · 12F/28F · 朝南 · 独立卫浴\n\n房屋亮点：全新装修首次出租，家具家电全配，拎包入住。步行 5 分钟到地铁 2/7 号线静安寺站，周边商业配套成熟。',
          size: 13,
          color: '#5b6472',
          lineHeight: 1.8,
        }, { ...S.card, paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14 }),
        title('房屋配套', ''),
        n('grid', {
          items: [
            { icon: 'home', text: '独立卫浴' },
            { icon: 'sparkles', text: '精装修' },
            { icon: 'shield', text: '智能门锁' },
            { icon: 'truck', text: '电梯房' },
            { icon: 'coffee', text: '独立厨房' },
            { icon: 'dumbbell', text: '健身房' },
            { icon: 'car', text: '停车位' },
            { icon: 'headset', text: '管家服务' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('shop', {
          name: '张明 · 资深置业顾问',
          desc: '服务 1286 位租客 · 好评率 98%',
          tags: ['实名认证', '从业 6 年'],
          rating: '4.9',
          address: '负责区域：静安 / 黄浦 / 徐汇',
          phone: '138****8888',
          hours: '响应时间：平均 5 分钟',
        }, { ...S.card }),
        n('map', { title: '静安寺 · 精装一居室', address: '上海市静安区愚园路 168 号', distance: '距您 1.2km', buttonText: '导航前往' }, { ...S.card }),
        n('comment', {
          title: '租客评价',
          rating: '4.9',
          count: '386',
          items: [
            { name: '租客 小周', rating: 5, content: '房子和图片一致，管家很负责，签约过程没有任何隐形费用。', date: '08-24', tags: '房源真实,无中介费' },
          ],
        }, { ...S.card }),
        n('cartBar', { total: '6800 元/月', count: 0, buttonText: '预约看房', tip: '押一付一' }),
      ]),
      page('my', '我的', '我的', myPage({
        name: '租客 · 小林',
        desc: '实名认证 · 已签约 2 次',
        stats: [
          { value: '6', label: '看房预约' },
          { value: '12', label: '收藏房源' },
          { value: '3', label: '我的委托' },
          { value: '2', label: '合同' },
        ],
        grid: [
          { icon: 'calendar', text: '看房预约' },
          { icon: 'heart', text: '收藏房源' },
          { icon: 'briefcase', text: '我的合同' },
          { icon: 'list', text: '账单缴费' },
          { icon: 'headset', text: '管家服务' },
          { icon: 'edit', text: '报修申请' },
          { icon: 'shield', text: '身份认证' },
          { icon: 'message', text: '我的评价' },
        ],
        banner: { title: '邀请室友立减 500', sub: '合租拼房更划算', buttonText: '去邀请' },
        rows: [
          { icon: 'pin', label: '当前住址', value: '静安区愚园路' },
          { icon: 'clock', label: '到期时间', value: '2027-03-31' },
          { icon: 'phone', label: '客服热线', value: '400-100-8888', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 7. 酒店民宿                                                          */
/* ================================================================== */
const hotel: TemplateDef = {
  id: 'hotel',
  name: '酒店民宿',
  industry: '酒旅住宿',
  desc: '房型展示、日期预订、套餐价格与入住服务，酒店与民宿均可直接使用。',
  cover: 'linear-gradient(135deg,#ffecd2,#c08b5c)',
  tags: ['房型展示', '日期预订', '套餐房价', '周边攻略'],
  build: () => ({
    name: '云栖山居民宿',
    appid: 'touristappid',
    description: '酒店民宿预订小程序模板',
    templateId: 'hotel',
    theme: {
      primary: '#c08b5c',
      primaryLight: '#faf3ea',
      secondary: '#e0682f',
      accent: '#8fb98a',
      text: '#2a2118',
      subText: '#8a7d6f',
      background: '#f7f4f0',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '首页', 'home'],
        ['rooms', '房型', 'bed'],
        ['booking', '预订', 'calendar'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#c08b5c' },
    ),
    pages: [
      page('home', '首页', '云栖山居', [
        searchBar('搜索城市 / 民宿 / 景点'),
        hero([
          { title: '山景露台房 中秋特惠', desc: '含双早 · 立减 300' },
          { title: '连住三晚 送下午茶', desc: '有效期至 9 月 30 日' },
          { title: '携宠入住 专属房型', desc: '限 6 间 · 需提前预约' },
        ], 186),
        n('grid', {
          items: [
            { icon: 'bed', text: '全部房型' },
            { icon: 'calendar', text: '立即预订' },
            { icon: 'coffee', text: '餐饮服务' },
            { icon: 'camera', text: '周边景点' },
            { icon: 'gift', text: '优惠套餐' },
            { icon: 'star', text: '会员权益' },
            { icon: 'headset', text: '前台服务' },
            { icon: 'phone', text: '联系我们' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('stats', {
          items: [
            { value: '4.9', label: '综合评分' },
            { value: '2864', label: '累计入住' },
            { value: '36', label: '精品房型' },
            { value: '98%', label: '好评率' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, radius: 14 }),
        title('精选房型', '每间都有独立的山景视野'),
        n('goods', {
          layout: 'grid',
          columns: 2,
          items: [
            { image: '', name: '山景露台大床房', desc: '38㎡ · 2 人 · 含双早', price: '688', origin: '988', tag: '特惠', sales: '1286' },
            { image: '', name: '星空亲子套房', desc: '56㎡ · 4 人 · 含儿童乐园', price: '1088', origin: '1588', tag: '亲子', sales: '642' },
            { image: '', name: '庭院温泉房', desc: '45㎡ · 2 人 · 私汤入户', price: '1288', origin: '1688', tag: '热门', sales: '908' },
            { image: '', name: 'loft 家庭房', desc: '68㎡ · 6 人 · 双卫带厨房', price: '1588', origin: '2188', tag: '', sales: '386' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        title('住客评价', ''),
        n('comment', {
          title: '真实住客反馈',
          rating: '4.9',
          count: '2864',
          items: [
            { name: '客人 王先生', rating: 5, content: '露台正对山谷，早上云雾缭绕，早餐也很用心，老板亲自做的。', date: '08-27', tags: '视野绝美,早餐赞' },
            { name: '客人 李女士', rating: 5, content: '带娃入住了亲子套房，小朋友在乐园玩得不想走，房间很干净。', date: '08-22', tags: '亲子友好,干净整洁' },
          ],
        }, { ...S.card }),
        n('article', {
          items: [
            { image: '', title: '云栖山居周边游玩攻略', desc: '3 条经典徒步路线 + 2 家本地人才知道的土菜馆', author: '民宿管家', date: '08-26', views: '1862' },
            { image: '', title: '秋季摄影最佳机位指南', desc: '日出、云海、梯田，附最佳拍摄时间表', author: '摄影达人', date: '08-18', views: '1240' },
          ],
        }, { ...S.card }),
        footer('© 2026 云栖山居民宿'),
      ]),
      page('rooms', '房型', '全部房型', [
        n('notice', { text: '🗓 当前选择：8 月 30 日 - 9 月 1 日 · 共 2 晚', icon: 'calendar', more: true }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 6 }),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '山景露台大床房', desc: '38㎡ · 宜住 2 人 · 大床 1.8m · 含双早 · 免费停车', price: '688', origin: '988', tag: '特惠', sales: '1286 人住过' },
            { image: '', name: '庭院温泉房', desc: '45㎡ · 宜住 2 人 · 私汤入户 · 含双早', price: '1288', origin: '1688', tag: '热门', sales: '908 人住过' },
            { image: '', name: '星空亲子套房', desc: '56㎡ · 宜住 4 人 · 儿童乐园 · 含四早', price: '1088', origin: '1588', tag: '亲子', sales: '642 人住过' },
            { image: '', name: 'loft 家庭房', desc: '68㎡ · 宜住 6 人 · 双卫 · 带开放式厨房', price: '1588', origin: '2188', tag: '', sales: '386 人住过' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10, marginTop: 4 }),
        title('住宿套餐', '房费 + 体验，一次搞定'),
        n('priceCard', {
          items: [
            { name: '纯住宿', price: '688', period: '/ 晚', features: '山景露台房 1 晚\n双份早餐\n免费停车\nWiFi', highlight: false, btnText: '立即预订' },
            { name: '山野度假', price: '1588', period: '/ 2晚', features: '房型任选 2 晚\n双人下午茶\n徒步向导服务\n接送站一次', highlight: true, btnText: '立即抢购' },
            { name: '团建包栋', price: '6888', period: '/ 晚', features: '整栋 12 间\n专属管家\n自助烧烤\n会议室使用', highlight: false, btnText: '电话咨询' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 12 }),
        n('serviceBar', {
          items: [
            { icon: 'coffee', text: '含早餐' },
            { icon: 'car', text: '免费停车' },
            { icon: 'shield', text: '免费取消' },
            { icon: 'headset', text: '24h 前台' },
          ],
        }, { paddingTop: 8, paddingBottom: 4 }),
        footer(),
      ]),
      page('booking', '预订', '填写订单', [
        n('shop', {
          name: '云栖山居民宿 · 主楼',
          desc: '莫干山镇 · 营业中 · 今日有房',
          tags: ['免费停车', '含早餐', '可带宠物'],
          rating: '4.9',
          address: '浙江省湖州市德清县莫干山镇后坞村',
          phone: '0572-888 6666',
          hours: '入住 14:00 后 · 退房 12:00 前',
        }, { ...S.card, marginTop: 10 }),
        n('form', {
          title: '预订信息',
          fields: [
            { label: '入住人', type: 'text', placeholder: '请输入入住人姓名', required: true },
            { label: '手机号', type: 'phone', placeholder: '用于接收确认短信', required: true },
            { label: '入住日期', type: 'date', placeholder: '请选择入住日期', required: true },
            { label: '离店日期', type: 'date', placeholder: '请选择离店日期', required: true },
            { label: '房间数', type: 'picker', placeholder: '1 间', required: true },
            { label: '特殊需求', type: 'textarea', placeholder: '如高楼层、无烟房等（选填）', required: false },
          ],
          submitText: '提交订单',
          tip: '入住前 3 天可免费取消',
        }, { ...S.card }),
        n('coupon', {
          items: [
            { amount: '300', condition: '满 1200 可用', name: '中秋专享券', tag: '已领取' },
            { amount: '100', condition: '满 600 可用', name: '新客券', tag: '领取' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 4 }),
        n('map', { title: '云栖山居民宿', address: '浙江省湖州市德清县莫干山镇后坞村', distance: '距高铁站 28km', buttonText: '导航前往' }, { ...S.card }),
        n('cartBar', { total: '￥1588', count: 2, buttonText: '立即支付', tip: '已优惠 ￥300' }),
      ]),
      page('my', '我的', '我的', myPage({
        name: '旅客 · 苏苏',
        desc: '银卡会员 · 积分 2680',
        stats: [
          { value: '1', label: '待入住' },
          { value: '8', label: '历史订单' },
          { value: '2680', label: '积分' },
          { value: '3', label: '优惠券' },
        ],
        grid: [
          { icon: 'list', text: '我的订单' },
          { icon: 'calendar', text: '入住日历' },
          { icon: 'heart', text: '收藏民宿' },
          { icon: 'coupon', text: '优惠券' },
          { icon: 'award', text: '会员权益' },
          { icon: 'headset', text: '联系前台' },
          { icon: 'edit', text: '发票管理' },
          { icon: 'message', text: '我的评价' },
        ],
        banner: { title: '成为金卡会员', sub: '房价 9 折 · 免费升房', buttonText: '立即升级' },
        rows: [
          { icon: 'clock', label: '入住提醒', value: '8 月 30 日 14:00' },
          { icon: 'phone', label: '前台电话', value: '0572-888 6666', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 8. 医疗健康                                                          */
/* ================================================================== */
const clinic: TemplateDef = {
  id: 'clinic',
  name: '医疗健康',
  industry: '医疗健康',
  desc: '预约挂号、专家介绍、健康科普与报告查询，诊所与体检中心适用。',
  cover: 'linear-gradient(135deg,#c2e9fb,#2aa9a0)',
  tags: ['预约挂号', '专家团队', '健康科普', '报告查询'],
  build: () => ({
    name: '康和门诊',
    appid: 'touristappid',
    description: '医疗服务小程序模板',
    templateId: 'clinic',
    theme: {
      primary: '#2aa9a0',
      primaryLight: '#e8f8f6',
      secondary: '#ff6b35',
      accent: '#4f9bf5',
      text: '#152421',
      subText: '#6b7a78',
      background: '#f3f7f7',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '首页', 'home'],
        ['dept', '科室', 'grid'],
        ['doctor', '专家', 'users'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#2aa9a0' },
    ),
    pages: [
      page('home', '首页', '康和门诊', [
        searchBar('搜索科室 / 医生 / 症状'),
        n('grid', {
          items: [
            { icon: 'calendar', text: '预约挂号' },
            { icon: 'message', text: '在线问诊' },
            { icon: 'book', text: '报告查询' },
            { icon: 'pin', text: '到院导航' },
            { icon: 'heartPulse', text: '健康档案' },
            { icon: 'clock', text: '排队叫号' },
            { icon: 'bag', text: '药房取药' },
            { icon: 'headset', text: '客服中心' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14, marginTop: 8 }),
        noticeBar('🏥 即日起，65 岁以上老人可享受免费挂号，详情请咨询导医台'),
        n('banner', { title: '秋季体检套餐 8 折', sub: '含 32 项检查 · 报告当天出', buttonText: '立即预约' }, { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 }),
        n('stats', {
          items: [
            { value: '30', label: '临床科室' },
            { value: '286', label: '执业医师' },
            { value: '12w', label: '年门诊量' },
            { value: '4.9', label: '患者评分' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 8, radius: 14 }),
        title('热门科室', ''),
        n('goods', {
          layout: 'row',
          showPrice: false,
          items: [
            { image: '', name: '内科', desc: '今日号源 86', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '儿科', desc: '今日号源 42', price: '', origin: '', tag: '紧张', sales: '' },
            { image: '', name: '皮肤科', desc: '今日号源 63', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '口腔科', desc: '今日号源 28', price: '', origin: '', tag: '', sales: '' },
          ],
        }, { paddingTop: 4, paddingBottom: 8 }),
        title('健康科普', ''),
        n('article', {
          items: [
            { image: '', title: '换季咳嗽别急着吃抗生素', desc: '医生教你区分病毒性与细菌性感染', author: '呼吸内科', date: '08-27', views: '1.8w' },
            { image: '', title: '体检报告上的箭头都代表什么', desc: '一文看懂 12 个常见指标异常', author: '检验科', date: '08-23', views: '2.4w' },
            { image: '', title: '久坐族的腰椎保护指南', desc: '5 个动作，每天 10 分钟', author: '康复科', date: '08-16', views: '9860' },
          ],
        }, { ...S.card }),
        n('serviceBar', {
          items: [
            { icon: 'shield', text: '医保定点' },
            { icon: 'clock', text: '无需排队' },
            { icon: 'headset', text: '在线客服' },
            { icon: 'check', text: '隐私保护' },
          ],
        }, { paddingTop: 12, paddingBottom: 4 }),
        footer('医疗内容仅供参考，具体诊疗请遵医嘱'),
      ]),
      page('dept', '科室', '全部科室', [
        searchBar('搜索科室'),
        n('tabs', { items: [{ text: '全部' }, { text: '内科' }, { text: '外科' }, { text: '妇儿' }, { text: '中医' }], active: 0 }),
        n('goods', {
          layout: 'list',
          showPrice: false,
          items: [
            { image: '', name: '心血管内科', desc: '主任医师 6 名 · 擅长高血压、冠心病、心律失常诊治', price: '', origin: '', tag: '重点', sales: '今日号源 52' },
            { image: '', name: '儿科', desc: '副主任医师 8 名 · 儿童呼吸、消化系统疾病', price: '', origin: '', tag: '', sales: '今日号源 42' },
            { image: '', name: '皮肤科', desc: '主任医师 4 名 · 痤疮、湿疹、银屑病专病门诊', price: '', origin: '', tag: '', sales: '今日号源 63' },
            { image: '', name: '骨科', desc: '主任医师 5 名 · 关节置换、脊柱微创手术', price: '', origin: '', tag: '', sales: '今日号源 31' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10, marginTop: 8 }),
        title('就诊流程', ''),
        n('steps', {
          direction: 'row',
          items: [
            { icon: 'search', title: '选科室', desc: '按症状查找' },
            { icon: 'calendar', title: '约号源', desc: '选择时段' },
            { icon: 'check', title: '到院签到', desc: '自助机取号' },
            { icon: 'heartPulse', title: '就诊', desc: '叫号看诊' },
          ],
        }, { ...S.card }),
        n('faq', {
          items: [
            { q: '可以提前几天预约？', a: '支持提前 7 天预约，每日 08:00 放号，专家号建议提前预约。' },
            { q: '预约后如何取消？', a: '就诊前 4 小时可在"我的预约"中取消，逾期未取消将计入违约。' },
            { q: '可以使用医保吗？', a: '本院为医保定点单位，就诊时请携带社保卡与身份证。' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('doctor', '专家', '专家团队', [
        n('tabs', { items: [{ text: '全部' }, { text: '主任医师' }, { text: '副主任医师' }, { text: '主治医师' }], active: 0 }),
        n('team', {
          items: [
            { avatar: '', name: '周国栋', title: '主任医师 · 心血管内科', desc: '从业 32 年 · 完成介入手术 8000 余例 · 国家科技进步二等奖', tags: '高血压,冠心病,心律失常' },
            { avatar: '', name: '许静怡', title: '副主任医师 · 儿科', desc: '从业 18 年 · 擅长儿童呼吸道疾病与生长发育评估', tags: '小儿咳嗽,哮喘,生长发育' },
            { avatar: '', name: '范志远', title: '主任医师 · 骨科', desc: '从业 25 年 · 专注关节置换与运动损伤修复', tags: '关节置换,运动损伤' },
            { avatar: '', name: '林巧云', title: '主治医师 · 皮肤科', desc: '从业 12 年 · 痤疮与色素性皮肤病专病门诊', tags: '痤疮,湿疹,色斑' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10 }),
        n('comment', {
          title: '患者评价',
          rating: '4.9',
          count: '8632',
          items: [
            { name: '患者 陈先生', rating: 5, content: '周主任看得很仔细，把我的用药方案调整后血压控制得很好，非常感谢。', date: '08-25', tags: '耐心细致,医术高超' },
            { name: '患者 刘女士', rating: 5, content: '儿科许医生特别有耐心，孩子不哭不闹，讲解也很清楚。', date: '08-20', tags: '态度和蔼,解释清楚' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('my', '我的', '个人中心', myPage({
        name: '就诊人 · 陈先生',
        desc: '已绑定 3 位家庭成员',
        stats: [
          { value: '2', label: '待就诊' },
          { value: '6', label: '就诊记录' },
          { value: '4', label: '体检报告' },
          { value: '1', label: '在院订单' },
        ],
        grid: [
          { icon: 'calendar', text: '我的预约' },
          { icon: 'book', text: '报告查询' },
          { icon: 'heartPulse', text: '健康档案' },
          { icon: 'users', text: '就诊人管理' },
          { icon: 'bag', text: '药品订单' },
          { icon: 'clock', text: '排队叫号' },
          { icon: 'message', text: '在线问诊' },
          { icon: 'headset', text: '客服中心' },
        ],
        banner: { title: '秋季体检套餐 8 折', sub: '32 项检查 · 报告当天出', buttonText: '立即预约' },
        rows: [
          { icon: 'shield', label: '医保电子凭证', value: '已激活' },
          { icon: 'pin', label: '默认就诊院区', value: '康和门诊 · 总院' },
          { icon: 'phone', label: '门诊电话', value: '021-6000 1200', action: '拨打' },
        ],
      })),
    ],
  }),
}

export const PART_A: TemplateDef[] = [mall, food, beauty, corp, edu, house, hotel, clinic]
