import type { ComponentDef, MpNode, NodeStyle, PropField } from '../types'

/* ------------------------------------------------------------------ */
/* 工具                                                                */
/* ------------------------------------------------------------------ */

let seq = 0
export function uid(prefix = 'n'): string {
  seq += 1
  return `${prefix}_${Date.now().toString(36)}_${seq.toString(36)}`
}

export function node(type: string, props: Record<string, any> = {}, style: NodeStyle = {}, children?: MpNode[]): MpNode {
  const def = REGISTRY[type]
  return {
    id: uid(type),
    type,
    props: { ...(def?.defaultProps ?? {}), ...props },
    style: { ...(def?.defaultStyle ?? {}), ...style },
    children: def?.container || children ? children ?? (def?.defaultChildren?.() ?? []) : undefined,
  }
}

const f = {
  text: (key: string, label: string, placeholder?: string): PropField => ({ key, label, type: 'text', placeholder }),
  textarea: (key: string, label: string, placeholder?: string): PropField => ({ key, label, type: 'textarea', placeholder }),
  number: (key: string, label: string, o: Partial<PropField> = {}): PropField => ({ key, label, type: 'number', ...o }) as PropField,
  switch: (key: string, label: string): PropField => ({ key, label, type: 'switch' }),
  color: (key: string, label: string): PropField => ({ key, label, type: 'color' }),
  select: (key: string, label: string, options: { label: string; value: string }[]): PropField => ({ key, label, type: 'select', options }),
  image: (key: string, label: string): PropField => ({ key, label, type: 'image' }),
  imageList: (key: string, label: string): PropField => ({ key, label, type: 'imageList' }),
  list: (key: string, label: string, itemLabel: string, fields: PropField[], defaultItem: Record<string, any>): PropField => ({
    key,
    label,
    type: 'list',
    itemLabel,
    fields,
    defaultItem,
  }),
} as const

const IMG_FIELDS = [f.image('image', '图片'), f.text('title', '标题'), f.text('desc', '副标题')]

/* ------------------------------------------------------------------ */
/* 组件定义                                                            */
/* ------------------------------------------------------------------ */

const DEFS: ComponentDef[] = [
  /* ---------------- 基础 ---------------- */
  {
    type: 'view',
    name: '自由容器',
    group: '基础',
    icon: 'layout',
    desc: '可嵌套任意组件的空白容器',
    container: true,
    defaultProps: { direction: 'column', gap: 12, align: 'stretch' },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 12, background: 'transparent', radius: 0 },
    fields: [
      f.select('direction', '排列方向', [
        { label: '纵向', value: 'column' },
        { label: '横向', value: 'row' },
      ]),
      f.number('gap', '子项间距', { min: 0, max: 60, suffix: 'px' }),
      f.select('align', '对齐方式', [
        { label: '拉伸', value: 'stretch' },
        { label: '居中', value: 'center' },
        { label: '靠上/左', value: 'flex-start' },
        { label: '靠下/右', value: 'flex-end' },
      ]),
    ],
  },
  {
    type: 'title',
    name: '标题栏',
    group: '基础',
    icon: 'type',
    desc: '带副标题与更多入口的段落标题',
    defaultProps: { content: '热门推荐', sub: '为你精选', more: true, moreText: '更多', align: 'left', size: 18, color: '', subColor: '' },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 8 },
    fields: [
      f.text('content', '主标题'),
      f.text('sub', '副标题'),
      f.number('size', '字号', { min: 12, max: 32, suffix: 'px' }),
      f.switch('more', '显示"更多"'),
      f.text('moreText', '更多文案'),
      f.select('align', '对齐', [
        { label: '左', value: 'left' },
        { label: '中', value: 'center' },
      ]),
      f.color('color', '主标题色'),
      f.color('subColor', '副标题色'),
    ],
  },
  {
    type: 'text',
    name: '文字',
    group: '基础',
    icon: 'type',
    desc: '段落文本，支持富文本换行',
    defaultProps: { content: '这是一段说明文字，可在右侧属性面板自由编辑内容、字号、颜色与对齐方式。', size: 14, color: '#5b6472', weight: '400', align: 'left', lineHeight: 1.7 },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6 },
    fields: [
      f.textarea('content', '文本内容'),
      f.number('size', '字号', { min: 10, max: 32, suffix: 'px' }),
      f.number('lineHeight', '行高', { min: 1, max: 3, step: 0.1 }),
      f.select('weight', '字重', [
        { label: '常规', value: '400' },
        { label: '中等', value: '500' },
        { label: '加粗', value: '700' },
      ]),
      f.select('align', '对齐', [
        { label: '左', value: 'left' },
        { label: '中', value: 'center' },
        { label: '右', value: 'right' },
      ]),
      f.color('color', '文字颜色'),
    ],
  },
  {
    type: 'image',
    name: '单图',
    group: '基础',
    icon: 'image',
    desc: '一张图片，未配置时显示渐变占位',
    defaultProps: { src: '', height: 160, radius: 12, caption: '', fit: 'cover' },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6 },
    fields: [f.image('src', '图片'), f.number('height', '高度', { min: 40, max: 500, suffix: 'px' }), f.number('radius', '圆角', { min: 0, max: 40 }), f.text('caption', '图注')],
  },
  {
    type: 'video',
    name: '视频',
    group: '基础',
    icon: 'video',
    desc: '嵌入宣传片 / 课程视频，支持封面与自动播放',
    defaultProps: { src: '', poster: '', height: 200, radius: 14, controls: true, autoplay: false },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 },
    fields: [
      f.text('src', '视频地址'),
      f.image('poster', '封面图'),
      f.number('height', '高度', { min: 100, max: 500, suffix: 'px' }),
      f.number('radius', '圆角', { min: 0, max: 40 }),
      f.switch('controls', '显示控件'),
      f.switch('autoplay', '自动播放'),
    ],
  },
  {
    type: 'divider',
    name: '分割线',
    group: '基础',
    icon: 'rows',
    desc: '分隔内容区块',
    defaultProps: { color: '#eef0f4', height: 1, dashed: false },
    defaultStyle: { paddingTop: 6, paddingBottom: 6 },
    fields: [f.color('color', '颜色'), f.number('height', '粗细', { min: 1, max: 8 }), f.switch('dashed', '虚线')],
  },
  {
    type: 'blank',
    name: '空白间距',
    group: '基础',
    icon: 'blank',
    desc: '撑开一段垂直留白',
    defaultProps: { height: 16 },
    fields: [f.number('height', '高度', { min: 4, max: 200, suffix: 'px' })],
  },

  /* ---------------- 导航 ---------------- */
  {
    type: 'search',
    name: '搜索栏',
    group: '导航',
    icon: 'search',
    desc: '顶部搜索入口',
    defaultProps: { placeholder: '搜索你想要的内容', radius: 20, background: '#f4f6f9', align: 'center', showScan: false },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 10 },
    fields: [f.text('placeholder', '提示文案'), f.number('radius', '圆角', { min: 0, max: 30 }), f.color('background', '背景色'), f.switch('showScan', '显示扫码图标')],
  },
  {
    type: 'notice',
    name: '公告栏',
    group: '导航',
    icon: 'bell',
    desc: '滚动公告 / 提示条',
    defaultProps: { text: '🎉 新用户下单立减 20 元，活动持续到本月底', more: true, icon: 'bell', color: '#d97706', background: '#fff8e6' },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 },
    fields: [f.textarea('text', '公告内容'), f.color('color', '文字色'), f.color('background', '背景色'), f.switch('more', '显示箭头')],
  },
  {
    type: 'swiper',
    name: '轮播图',
    group: '导航',
    icon: 'image',
    desc: '首页 Banner，支持多张轮播',
    defaultProps: {
      items: [
        { image: '', title: '品质好物 一站购齐', desc: '新人专享 满 199 减 50' },
        { image: '', title: '春季上新 限时特惠', desc: '全场低至 5 折起' },
        { image: '', title: '会员日 双倍积分', desc: '每周三 敬请期待' },
      ],
      height: 168,
      radius: 14,
      autoplay: true,
      indicator: 'dot',
    },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 },
    fields: [
      f.list('items', '轮播项', '轮播', IMG_FIELDS, { image: '', title: '标题', desc: '副标题' }),
      f.number('height', '高度', { min: 80, max: 400, suffix: 'px' }),
      f.number('radius', '圆角', { min: 0, max: 30 }),
      f.switch('autoplay', '自动播放'),
      f.select('indicator', '指示器', [
        { label: '圆点', value: 'dot' },
        { label: '数字', value: 'number' },
        { label: '不显示', value: 'none' },
      ]),
    ],
  },
  {
    type: 'grid',
    name: '宫格导航',
    group: '导航',
    icon: 'grid',
    desc: '分类入口图标网格',
    defaultProps: {
      items: [
        { icon: 'star', text: '新品上市', badge: '' },
        { icon: 'fire', text: '热销榜单', badge: '' },
        { icon: 'gift', text: '优惠活动', badge: '' },
        { icon: 'tag', text: '限时折扣', badge: '' },
        { icon: 'award', text: '品牌专区', badge: '' },
        { icon: 'truck', text: '物流查询', badge: '' },
        { icon: 'headset', text: '在线客服', badge: '' },
        { icon: 'user', text: '会员中心', badge: '' },
      ],
      columns: 4,
      iconBg: '',
      iconColor: '',
      iconSize: 26,
      fontSize: 12,
    },
    defaultStyle: { paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, background: '#ffffff', radius: 14, marginTop: 8, marginBottom: 8 },
    fields: [
      f.list(
        'items',
        '导航项',
        '分类',
        [f.text('icon', '图标名'), f.text('text', '文字'), f.text('badge', '角标')],
        { icon: 'star', text: '新分类', badge: '' },
      ),
      f.select('columns', '每行个数', [
        { label: '3 个', value: '3' },
        { label: '4 个', value: '4' },
        { label: '5 个', value: '5' },
      ]),
      f.color('iconBg', '图标底色'),
      f.color('iconColor', '图标颜色'),
      f.number('iconSize', '图标大小', { min: 14, max: 48 }),
    ],
  },
  {
    type: 'tabs',
    name: '分类标签',
    group: '导航',
    icon: 'columns',
    desc: '横向滑动的分类切换',
    defaultProps: { items: [{ text: '全部' }, { text: '推荐' }, { text: '最新' }, { text: '热门' }, { text: '附近' }], active: 0, background: '#ffffff', activeColor: '' },
    defaultStyle: { paddingTop: 4, paddingBottom: 4 },
    fields: [f.list('items', '标签项', '标签', [f.text('text', '文字')], { text: '新标签' }), f.number('active', '选中项', { min: 0, max: 20 }), f.color('activeColor', '选中色')],
  },
  {
    type: 'floatBtn',
    name: '悬浮按钮',
    group: '导航',
    icon: 'plus',
    desc: '固定在屏幕角落的快捷操作入口',
    defaultProps: { icon: 'headset', text: '客服', bg: '', position: 'br', action: 'none', phone: '' },
    defaultStyle: { marginTop: 8, marginBottom: 8 },
    fields: [
      f.text('icon', '图标名'),
      f.text('text', '按钮文字'),
      f.select('position', '位置', [
        { label: '右下', value: 'br' },
        { label: '左下', value: 'bl' },
        { label: '右上', value: 'tr' },
        { label: '左上', value: 'tl' },
      ]),
      f.color('bg', '按钮底色'),
      f.select('action', '点击行为', [
        { label: '无（提示）', value: 'none' },
        { label: '拨打电话', value: 'call' },
        { label: '回到顶部', value: 'top' },
        { label: '唤起分享', value: 'share' },
      ]),
      f.text('phone', '电话号码（拨号用）'),
    ],
  },

  /* ---------------- 营销 ---------------- */
  {
    type: 'coupon',
    name: '优惠券',
    group: '营销',
    icon: 'coupon',
    desc: '可领取的优惠券列表',
    defaultProps: {
      items: [
        { amount: '20', condition: '满 99 可用', name: '新人券', tag: '立即领取' },
        { amount: '50', condition: '满 299 可用', name: '店铺券', tag: '立即领取' },
        { amount: '100', condition: '满 599 可用', name: '会员券', tag: '立即领取' },
      ],
      background: '#fff1f0',
    },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 },
    fields: [
      f.list(
        'items',
        '券列表',
        '优惠券',
        [f.text('amount', '面额'), f.text('condition', '使用条件'), f.text('name', '券名称'), f.text('tag', '按钮文案')],
        { amount: '10', condition: '满 99 可用', name: '优惠券', tag: '立即领取' },
      ),
      f.color('background', '券背景色'),
    ],
  },
  {
    type: 'seckill',
    name: '限时秒杀',
    group: '营销',
    icon: 'fire',
    desc: '带倒计时的横滑秒杀商品',
    defaultProps: {
      title: '限时秒杀',
      sub: '距结束 02:18:45',
      items: [
        { image: '', name: '爆款单品', price: '59', origin: '129' },
        { image: '', name: '人气好物', price: '88', origin: '199' },
        { image: '', name: '超值套装', price: '139', origin: '299' },
      ],
    },
    defaultStyle: { paddingTop: 8, paddingBottom: 8, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [
      f.text('title', '标题'),
      f.text('sub', '倒计时文案'),
      f.list('items', '商品', '商品', [...IMG_FIELDS, f.text('price', '价格'), f.text('origin', '原价')], { image: '', name: '商品名', price: '99', origin: '199' }),
    ],
  },
  {
    type: 'banner',
    name: '活动横幅',
    group: '营销',
    icon: 'sparkles',
    desc: '带按钮的推广通栏',
    defaultProps: { image: '', title: '会员专享权益', sub: '开通即享全年免运费', buttonText: '立即开通', background: '' },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 },
    fields: [f.image('image', '背景图'), f.text('title', '标题'), f.text('sub', '副标题'), f.text('buttonText', '按钮文案')],
  },
  {
    type: 'countdown',
    name: '倒计时',
    group: '营销',
    icon: 'clock',
    desc: '活动倒计时条',
    defaultProps: { title: '618 大促 全场狂欢', days: '02', hours: '18', minutes: '45', seconds: '30' },
    defaultStyle: { paddingTop: 8, paddingBottom: 8, marginTop: 8, marginBottom: 8, radius: 12 },
    fields: [f.text('title', '标题'), f.text('days', '天'), f.text('hours', '时'), f.text('minutes', '分'), f.text('seconds', '秒')],
  },

  /* ---------------- 交易 ---------------- */
  {
    type: 'goods',
    name: '商品列表',
    group: '交易',
    icon: 'bag',
    desc: '商品 / 服务展示，支持三种布局',
    defaultProps: {
      layout: 'grid',
      columns: 2,
      showPrice: true,
      items: [
        { image: '', name: '精选商品 A', desc: '高颜值 · 品质保障', price: '199', origin: '299', tag: '热卖', sales: '1280' },
        { image: '', name: '精选商品 B', desc: '限时特惠 · 全国包邮', price: '299', origin: '459', tag: '新品', sales: '862' },
        { image: '', name: '精选商品 C', desc: '口碑之选 · 七天无理由', price: '128', origin: '188', tag: '', sales: '2351' },
        { image: '', name: '精选商品 D', desc: '爆款返场 · 库存有限', price: '88', origin: '158', tag: '折扣', sales: '4120' },
      ],
    },
    defaultStyle: { paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 6, background: 'transparent', radius: 0 },
    fields: [
      f.select('layout', '布局', [
        { label: '网格', value: 'grid' },
        { label: '横向滑动', value: 'row' },
        { label: '纵向列表', value: 'list' },
      ]),
      f.number('columns', '每行列数', { min: 1, max: 3 }),
      f.switch('showPrice', '显示价格'),
      f.list(
        'items',
        '商品',
        '商品',
        [...IMG_FIELDS, f.text('price', '价格'), f.text('origin', '原价'), f.text('tag', '角标'), f.text('sales', '销量')],
        { image: '', name: '新商品', desc: '一句话卖点', price: '99', origin: '', tag: '', sales: '0' },
      ),
    ],
  },
  {
    type: 'shop',
    name: '店铺信息',
    group: '交易',
    icon: 'pin',
    desc: '门店名、评分、地址与营业时间',
    defaultProps: {
      name: '示例门店 · 旗舰店',
      logo: '',
      desc: '十年老店，服务超 10 万用户',
      tags: ['品质保障', '极速响应', '官方认证'],
      rating: '4.9',
      address: '上海市静安区南京西路 100 号 3F',
      phone: '021-8888 8888',
      hours: '09:00 - 21:00',
    },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [f.image('logo', '门店 Logo'), f.text('name', '门店名称'), f.text('desc', '门店简介'), f.text('rating', '评分'), f.text('address', '地址'), f.text('phone', '电话'), f.text('hours', '营业时间')],
  },
  {
    type: 'cartBar',
    name: '结算栏',
    group: '交易',
    icon: 'cart',
    desc: '底部固定结算条',
    defaultProps: { total: '￥199.00', count: 3, buttonText: '立即结算', tip: '已优惠 ￥50', fixed: true },
    defaultStyle: {},
    fields: [f.text('total', '合计金额'), f.number('count', '件数'), f.text('buttonText', '按钮文案'), f.text('tip', '优惠提示'), f.switch('fixed', '吸底固定')],
  },
  {
    type: 'priceCard',
    name: '价格套餐',
    group: '交易',
    icon: 'tag',
    desc: '会员 / 服务套餐对比',
    defaultProps: {
      items: [
        { name: '体验版', price: '0', period: '/ 月', features: '基础功能\n10 次额度\n社区支持', highlight: false, btnText: '免费使用' },
        { name: '专业版', price: '99', period: '/ 月', features: '全部功能\n无限额度\n优先客服\n数据报表', highlight: true, btnText: '立即开通' },
        { name: '企业版', price: '399', period: '/ 月', features: '专属部署\n独立顾问\n定制开发\n7×24 服务', highlight: false, btnText: '联系销售' },
      ],
    },
    defaultStyle: { paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 },
    fields: [
      f.list(
        'items',
        '套餐',
        '套餐',
        [f.text('name', '名称'), f.text('price', '价格'), f.text('period', '周期'), f.textarea('features', '权益（每行一条）'), f.switch('highlight', '突出显示'), f.text('btnText', '按钮文案')],
        { name: '新套餐', price: '99', period: '/ 月', features: '权益一\n权益二', highlight: false, btnText: '立即购买' },
      ),
    ],
  },

  /* ---------------- 内容 ---------------- */
  {
    type: 'article',
    name: '文章列表',
    group: '内容',
    icon: 'book',
    desc: '资讯 / 攻略 / 动态',
    defaultProps: {
      items: [
        { image: '', title: '2026 年行业趋势白皮书', desc: '深度解读下半年值得关注的五个方向', author: '编辑部', date: '08-28', views: '1.2w' },
        { image: '', title: '新手入门完全指南', desc: '从零开始，10 分钟掌握全部核心流程', author: '攻略组', date: '08-25', views: '8600' },
        { image: '', title: '常见误区与避坑清单', desc: '我们整理了 20 个高频问题与解决方案', author: '研究院', date: '08-20', views: '6420' },
      ],
    },
    defaultStyle: { paddingTop: 6, paddingBottom: 6, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [
      f.list(
        'items',
        '文章',
        '文章',
        [...IMG_FIELDS, f.text('author', '作者'), f.text('date', '日期'), f.text('views', '阅读量')],
        { image: '', title: '文章标题', desc: '文章摘要', author: '作者', date: '08-28', views: '1000' },
      ),
    ],
  },
  {
    type: 'comment',
    name: '用户评价',
    group: '内容',
    icon: 'message',
    desc: '带评分的口碑展示',
    defaultProps: {
      title: '用户评价',
      rating: '4.9',
      count: '2386',
      items: [
        { name: '张**', avatar: '', rating: 5, content: '整体体验超出预期，客服响应很快，下次还会再来。', date: '08-26', tags: ['服务好', '环境佳'] },
        { name: '李**', avatar: '', rating: 5, content: '性价比很高，物流也快，包装很用心，推荐给大家。', date: '08-22', tags: ['性价比高', '物流快'] },
      ],
    },
    defaultStyle: { paddingTop: 6, paddingBottom: 6, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [
      f.text('title', '标题'),
      f.text('rating', '综合评分'),
      f.text('count', '评价数'),
      f.list(
        'items',
        '评价',
        '评价',
        [f.text('name', '昵称'), f.image('avatar', '头像'), f.number('rating', '星级', { min: 1, max: 5 }), f.textarea('content', '内容'), f.text('date', '日期'), f.text('tags', '标签（逗号分隔）')],
        { name: '用**', avatar: '', rating: 5, content: '好评内容', date: '08-28', tags: '服务好' },
      ),
    ],
  },
  {
    type: 'team',
    name: '团队介绍',
    group: '内容',
    icon: 'users',
    desc: '人物 / 讲师 / 医生卡片',
    defaultProps: {
      items: [
        { avatar: '', name: '王思远', title: '创始人 & CEO', desc: '连续创业者，深耕行业十二年', tags: ['战略', '增长'] },
        { avatar: '', name: '陈曼', title: '产品负责人', desc: '前一线大厂产品专家', tags: ['产品', '用户研究'] },
        { avatar: '', name: '刘子墨', title: '技术负责人', desc: '全栈工程师，开源项目作者', tags: ['架构', '研发'] },
      ],
    },
    defaultStyle: { paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 },
    fields: [
      f.list(
        'items',
        '成员',
        '成员',
        [f.image('avatar', '头像'), f.text('name', '姓名'), f.text('title', '职位'), f.text('desc', '简介'), f.text('tags', '标签（逗号分隔）')],
        { avatar: '', name: '姓名', title: '职位', desc: '一句话简介', tags: '标签1' },
      ),
    ],
  },
  {
    type: 'faq',
    name: '常见问题',
    group: '内容',
    icon: 'message',
    desc: '问答折叠列表',
    defaultProps: {
      items: [
        { q: '如何预约服务？', a: '在小程序内选择服务与时间，提交后 10 分钟内会有专人与您确认。' },
        { q: '支持退款吗？', a: '服务开始前 24 小时可无条件取消并全额退款。' },
        { q: '可以开发票吗？', a: '支持开具电子普票与专票，下单时备注抬头与税号即可。' },
      ],
    },
    defaultStyle: { paddingTop: 6, paddingBottom: 6, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [
      f.list('items', '问答', '问题', [f.text('q', '问题'), f.textarea('a', '答案')], { q: '新的问题', a: '答案内容' }),
    ],
  },
  {
    type: 'steps',
    name: '流程步骤',
    group: '内容',
    icon: 'list',
    desc: '服务流程 / 使用步骤',
    defaultProps: {
      direction: 'row',
      items: [
        { icon: 'search', title: '挑选服务', desc: '浏览并选择合适的项目' },
        { icon: 'calendar', title: '预约时间', desc: '选择到店或上门时间' },
        { icon: 'check', title: '确认下单', desc: '提交订单并完成支付' },
        { icon: 'award', title: '享受服务', desc: '完成后可评价与分享' },
      ],
    },
    defaultStyle: { paddingTop: 8, paddingBottom: 8, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [
      f.select('direction', '方向', [
        { label: '横向', value: 'row' },
        { label: '纵向', value: 'column' },
      ]),
      f.list(
        'items',
        '步骤',
        '步骤',
        [f.text('icon', '图标名'), f.text('title', '标题'), f.text('desc', '说明')],
        { icon: 'check', title: '新步骤', desc: '步骤说明' },
      ),
    ],
  },
  {
    type: 'stats',
    name: '数据统计',
    group: '内容',
    icon: 'sparkles',
    desc: '关键指标数字展示',
    defaultProps: {
      items: [
        { value: '12', label: '年行业经验' },
        { value: '10w+', label: '累计服务用户' },
        { value: '98%', label: '好评率' },
        { value: '36', label: '覆盖城市' },
      ],
      background: '',
    },
    defaultStyle: { paddingTop: 8, paddingBottom: 8, marginTop: 8, marginBottom: 8, radius: 14 },
    fields: [f.list('items', '指标', '指标', [f.text('value', '数值'), f.text('label', '说明')], { value: '100', label: '指标说明' }), f.color('background', '背景色')],
  },
  {
    type: 'timeline',
    name: '时间轴',
    group: '内容',
    icon: 'clock',
    desc: '发展历程 / 订单进度',
    defaultProps: {
      items: [
        { time: '2026.08', title: '全新版本上线', desc: '整体视觉升级，新增 12 项能力' },
        { time: '2026.03', title: '用户突破 10 万', desc: '服务覆盖全国 36 个城市' },
        { time: '2025.09', title: '获得 A 轮融资', desc: '获知名机构数千万投资' },
      ],
    },
    defaultStyle: { paddingTop: 8, paddingBottom: 8, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [f.list('items', '节点', '节点', [f.text('time', '时间'), f.text('title', '标题'), f.text('desc', '说明')], { time: '2026.08', title: '事件标题', desc: '事件描述' })],
  },

  /* ---------------- 表单 ---------------- */
  {
    type: 'form',
    name: '预约表单',
    group: '表单',
    icon: 'edit',
    desc: '可配置的报名 / 预约表单',
    defaultProps: {
      title: '在线预约',
      fields: [
        { label: '姓名', type: 'text', placeholder: '请输入您的姓名', required: true },
        { label: '手机号', type: 'phone', placeholder: '请输入手机号', required: true },
        { label: '预约日期', type: 'date', placeholder: '请选择日期', required: true },
        { label: '备注', type: 'textarea', placeholder: '补充说明（选填）', required: false },
      ],
      submitText: '提交预约',
      tip: '提交后工作人员将在 10 分钟内联系您',
    },
    defaultStyle: { paddingTop: 8, paddingBottom: 8, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [
      f.text('title', '表单标题'),
      f.list(
        'fields',
        '表单项',
        '字段',
        [
          f.text('label', '字段名'),
          f.select('type', '类型', [
            { label: '单行文本', value: 'text' },
            { label: '多行文本', value: 'textarea' },
            { label: '手机号', value: 'phone' },
            { label: '日期选择', value: 'date' },
            { label: '下拉选择', value: 'picker' },
          ]),
          f.text('placeholder', '占位提示'),
          f.switch('required', '必填'),
        ],
        { label: '新字段', type: 'text', placeholder: '请输入', required: false },
      ),
      f.text('submitText', '提交按钮文案'),
      f.text('tip', '底部提示'),
    ],
  },
  {
    type: 'map',
    name: '门店地图',
    group: '表单',
    icon: 'pin',
    desc: '位置展示与导航入口',
    defaultProps: { title: '示例门店 · 旗舰店', address: '上海市静安区南京西路 100 号 3F', distance: '距您 1.2km', buttonText: '导航前往', lat: 31.2304, lng: 121.4737 },
    defaultStyle: { paddingTop: 8, paddingBottom: 8, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [f.text('title', '标题'), f.text('address', '地址'), f.text('distance', '距离'), f.text('buttonText', '按钮文案')],
  },
  {
    type: 'contact',
    name: '联系方式',
    group: '表单',
    icon: 'phone',
    desc: '电话 / 微信 / 邮箱列表',
    defaultProps: {
      items: [
        { icon: 'phone', label: '客服电话', value: '400-888-8888', action: '拨打' },
        { icon: 'message', label: '在线微信', value: 'service_2026', action: '复制' },
        { icon: 'pin', label: '公司地址', value: '上海市静安区南京西路 100 号', action: '导航' },
        { icon: 'clock', label: '工作时间', value: '周一至周日 09:00-21:00', action: '' },
      ],
    },
    defaultStyle: { paddingTop: 6, paddingBottom: 6, marginTop: 8, marginBottom: 8, background: '#ffffff', radius: 14 },
    fields: [
      f.list(
        'items',
        '联系项',
        '联系',
        [f.text('icon', '图标名'), f.text('label', '名称'), f.text('value', '内容'), f.text('action', '操作文案')],
        { icon: 'phone', label: '名称', value: '内容', action: '拨打' },
      ),
    ],
  },
  {
    type: 'serviceBar',
    name: '服务保障',
    group: '表单',
    icon: 'shield',
    desc: '一排服务承诺标签',
    defaultProps: {
      items: [
        { icon: 'shield', text: '正品保障' },
        { icon: 'truck', text: '极速发货' },
        { icon: 'repeat', text: '七天退换' },
        { icon: 'headset', text: '专属客服' },
      ],
    },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 },
    fields: [f.list('items', '保障项', '保障', [f.text('icon', '图标名'), f.text('text', '文字')], { icon: 'shield', text: '新保障' })],
  },
  {
    type: 'footer',
    name: '页脚信息',
    group: '基础',
    icon: 'info',
    desc: '版权与备案信息',
    defaultProps: { text: '© 2026 示例科技有限公司', links: '关于我们 · 服务条款 · 隐私政策' },
    defaultStyle: { paddingTop: 18, paddingBottom: 24 },
    fields: [f.text('text', '版权文案'), f.text('links', '底部链接')],
  },
  {
    type: 'richText',
    name: '富文本',
    group: '内容',
    icon: 'type',
    desc: '图文混排长文，支持标题 / 列表 / 加粗等常见标签',
    defaultProps: {
      html: '<h3>关于我们</h3><p>我们是一家专注<a>数字化转型</a>的技术服务商，提供从咨询规划到系统落地的全链路服务。</p><ul><li>品质保障，全程可追溯</li><li>7×24 小时专属客服</li><li>已服务 3000+ 家企业</li></ul>',
      background: '#ffffff',
      radius: 14,
    },
    defaultStyle: { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 },
    fields: [
      f.textarea('html', 'HTML 内容（支持 h1-h4 / p / a / ul / li / b / i / img）'),
      f.color('background', '背景色'),
      f.number('radius', '圆角', { min: 0, max: 40 }),
    ],
  },
]

export const REGISTRY: Record<string, ComponentDef> = DEFS.reduce((acc, d) => {
  acc[d.type] = d
  return acc
}, {} as Record<string, ComponentDef>)

export const COMPONENT_GROUPS = ['基础', '导航', '营销', '交易', '内容', '表单'] as const

export const COMPONENTS_BY_GROUP = COMPONENT_GROUPS.map((group) => ({
  group,
  items: DEFS.filter((d) => d.group === group),
})).filter((g) => g.items.length > 0)

export function componentName(type: string): string {
  return REGISTRY[type]?.name ?? type
}
