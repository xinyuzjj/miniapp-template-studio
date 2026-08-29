import type { TemplateDef } from '../types'
import { node as n } from '../core/registry'
import { page, tab, S, title, hero, noticeBar, searchBar, footer, myPage } from './kit'

/* ================================================================== */
/* 9. 健身运动                                                          */
/* ================================================================== */
const gym: TemplateDef = {
  id: 'gym',
  name: '健身运动',
  industry: '运动健身',
  desc: '课程排期、私教预约、教练展示与训练计划，健身房与瑜伽馆通用。',
  cover: 'linear-gradient(135deg,#ffd3a5,#ff5a3c)',
  tags: ['课程排期', '私教预约', '教练展示', '训练记录'],
  build: () => ({
    name: '力聚健身',
    appid: 'touristappid',
    description: '健身场馆小程序模板',
    templateId: 'gym',
    theme: {
      primary: '#ff5a3c',
      primaryLight: '#fff2ef',
      secondary: '#ff5a3c',
      accent: '#ffb020',
      text: '#1d1815',
      subText: '#7d736d',
      background: '#f7f5f4',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '首页', 'home'],
        ['course', '课程', 'calendar'],
        ['coach', '教练', 'users'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#ff5a3c' },
    ),
    pages: [
      page('home', '首页', '力聚健身', [
        hero([
          { title: '年卡限时 5 折', desc: '送 12 节私教课' },
          { title: '新人 9.9 元体验周', desc: '含体测 + 训练计划' },
          { title: '团课免费开放日', desc: '每周六 19:00' },
        ]),
        n('video', { src: '', poster: '', height: 200, radius: 14, controls: true, autoplay: false }, { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 }),
        n('grid', {
          items: [
            { icon: 'calendar', text: '团课预约' },
            { icon: 'dumbbell', text: '私教课程' },
            { icon: 'users', text: '教练团队' },
            { icon: 'clock', text: '训练打卡' },
            { icon: 'heartPulse', text: '体测报告' },
            { icon: 'award', text: '会员卡' },
            { icon: 'pin', text: '门店导航' },
            { icon: 'message', text: '运动社区' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('stats', {
          items: [
            { value: '5.2w', label: '累计会员' },
            { value: '68', label: '每周团课' },
            { value: '42', label: '持证教练' },
            { value: '18', label: '全国门店' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, radius: 14 }),
        noticeBar('🔥 今晚 19:00 动感单车课仅剩 3 个名额，点击立即预约'),
        title('今日课程', '8 月 29 日 星期六'),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '动感单车 · 燃脂冲刺', desc: '19:00-20:00 · 教练 阿凯 · 剩余 3 席', price: '69', origin: '99', tag: '热门', sales: '' },
            { image: '', name: '力量训练 · 胸背日', desc: '18:00-19:00 · 教练 王磊 · 剩余 8 席', price: '69', origin: '99', tag: '', sales: '' },
            { image: '', name: '瑜伽 · 舒缓流', desc: '20:15-21:15 · 教练 林悦 · 剩余 12 席', price: '59', origin: '89', tag: '', sales: '' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10 }),
        title('明星教练', ''),
        n('team', {
          items: [
            { avatar: '', name: '王磊', title: '高级私教 · 力量塑形', desc: 'NSCA-CPT 认证 · 从业 8 年 · 帮助 300+ 学员达成目标', tags: '增肌,体态矫正' },
            { avatar: '', name: '林悦', title: '瑜伽导师', desc: 'RYT-500 认证 · 擅长流瑜伽与孕产修复', tags: '流瑜伽,产后修复' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        n('shop', {
          name: '力聚健身（静安旗舰店）',
          desc: '2000㎡ · 24 小时营业',
          tags: ['进口器械', '恒温泳池', '免费淋浴'],
          rating: '4.8',
          address: '上海市静安区共和新路 1888 号 4F',
          phone: '021-5888 8888',
          hours: '全天 24 小时',
        }, { ...S.card }),
        footer('© 2026 力聚健身连锁'),
      ]),
      page('course', '课程', '课程预约', [
        n('tabs', { items: [{ text: '今天' }, { text: '明天' }, { text: '后天' }, { text: '本周' }], active: 0 }),
        n('notice', { text: '⏰ 课程开始前 2 小时可免费取消，逾期将扣减课时', icon: 'clock', more: false }, { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 6 }),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '动感单车 · 燃脂冲刺', desc: '19:00-20:00 · 60min · 教练 阿凯 · 剩余 3 席', price: '69', origin: '99', tag: '热门', sales: '' },
            { image: '', name: '力量训练 · 胸背日', desc: '18:00-19:00 · 60min · 教练 王磊 · 剩余 8 席', price: '69', origin: '99', tag: '', sales: '' },
            { image: '', name: '瑜伽 · 舒缓流', desc: '20:15-21:15 · 60min · 教练 林悦 · 剩余 12 席', price: '59', origin: '89', tag: '', sales: '' },
            { image: '', name: '搏击操 · 燃脂搏击', desc: '21:30-22:15 · 45min · 教练 张野 · 剩余 5 席', price: '79', origin: '109', tag: '新课', sales: '' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10 }),
        title('会员卡', '按需选择，随时可退'),
        n('priceCard', {
          items: [
            { name: '次卡', price: '69', period: '/ 次', features: '任意团课 1 次\n有效期 6 个月\n可转让', highlight: false, btnText: '立即购买' },
            { name: '月卡', price: '499', period: '/ 月', features: '不限次团课\n器械区全开放\n体测 1 次\n淋浴免费', highlight: true, btnText: '立即开通' },
            { name: '年卡', price: '3980', period: '/ 年', features: '全年不限次\n送 12 节私教\n泳池 + 团课\n全国通用', highlight: false, btnText: '咨询顾问' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 12 }),
        n('faq', {
          items: [
            { q: '完全没有基础可以参加吗？', a: '可以。所有团课均提供初级动作替代方案，教练会在课前进行简单指导。' },
            { q: '可以带朋友一起吗？', a: '非会员可购买单次体验卡入场，会员每月可带 1 位朋友免费体验一次。' },
            { q: '私教课怎么约？', a: '在教练主页选择"预约私教"，可指定教练与时间，支持按次或按套餐购买。' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('coach', '教练', '教练团队', [
        n('tabs', { items: [{ text: '全部' }, { text: '力量' }, { text: '有氧' }, { text: '瑜伽' }, { text: '康复' }], active: 0 }),
        n('team', {
          items: [
            { avatar: '', name: '王磊', title: '高级私教 · 力量塑形', desc: 'NSCA-CPT 认证 · 从业 8 年 · 帮助 300+ 学员达成增肌与体态目标', tags: '增肌,体态矫正,力量' },
            { avatar: '', name: '林悦', title: '瑜伽导师', desc: 'RYT-500 认证 · 擅长流瑜伽、阴瑜伽与孕产修复', tags: '流瑜伽,产后修复' },
            { avatar: '', name: '阿凯', title: '单车 & HIIT 教练', desc: '莱美认证教练 · 从业 6 年 · 单节课最高燃脂 900 kcal', tags: '动感单车,HIIT' },
            { avatar: '', name: '张野', title: '搏击 & 功能性训练', desc: '国家二级运动员 · 擅长搏击操与功能性体能提升', tags: '搏击操,功能训练' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10 }),
        n('form', {
          title: '预约私教体验课',
          fields: [
            { label: '姓名', type: 'text', placeholder: '请输入您的姓名', required: true },
            { label: '手机号', type: 'phone', placeholder: '请输入手机号', required: true },
            { label: '意向教练', type: 'picker', placeholder: '请选择教练', required: false },
            { label: '训练目标', type: 'picker', placeholder: '增肌 / 减脂 / 塑形', required: false },
          ],
          submitText: '提交预约',
          tip: '提交后教练将在 2 小时内与您联系',
        }, { ...S.card }),
        footer(),
      ]),
      page('my', '我的', '训练中心', myPage({
        name: '会员 · 阿杰',
        desc: '年卡会员 · 剩余 286 天',
        stats: [
          { value: '1', label: '今日课程' },
          { value: '48', label: '本月打卡' },
          { value: '12', label: '私教课时' },
          { value: '-6.4', label: '体重变化kg' },
        ],
        grid: [
          { icon: 'calendar', text: '我的课程' },
          { icon: 'clock', text: '打卡记录' },
          { icon: 'heartPulse', text: '体测报告' },
          { icon: 'dumbbell', text: '训练计划' },
          { icon: 'users', text: '我的教练' },
          { icon: 'award', text: '会员卡' },
          { icon: 'message', text: '运动社区' },
          { icon: 'headset', text: '门店客服' },
        ],
        banner: { title: '邀请好友各得 100', sub: '好友首单立减 · 你得续费券', buttonText: '去邀请' },
        rows: [
          { icon: 'pin', label: '常用门店', value: '静安旗舰店' },
          { icon: 'clock', label: '会员到期', value: '2027-06-11' },
          { icon: 'phone', label: '门店电话', value: '021-5888 8888', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 10. 家政服务                                                         */
/* ================================================================== */
const service: TemplateDef = {
  id: 'service',
  name: '家政服务',
  industry: '到家服务',
  desc: '保洁、维修、月嫂、搬家等上门服务：服务分类、下单预约、阿姨展示。',
  cover: 'linear-gradient(135deg,#c2e9fb,#2f7ff0)',
  tags: ['上门服务', '在线下单', '服务人员', '订单跟踪'],
  build: () => ({
    name: '洁净到家',
    appid: 'touristappid',
    description: '家政上门服务小程序模板',
    templateId: 'service',
    theme: {
      primary: '#2f7ff0',
      primaryLight: '#eef5ff',
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
        ['service', '服务', 'grid'],
        ['order', '下单', 'edit'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#2f7ff0' },
    ),
    pages: [
      page('home', '首页', '洁净到家', [
        searchBar('搜索保洁 / 维修 / 月嫂'),
        hero([
          { title: '新客首单立减 50', desc: '全品类可用 · 限首单' },
          { title: '深度保洁 8 折', desc: '含除螨 · 限 8 月' },
          { title: '年卡会员 全年 9 折', desc: '不限次数 · 优先派单' },
        ]),
        n('grid', {
          items: [
            { icon: 'sparkles', text: '日常保洁' },
            { icon: 'home', text: '深度清洁' },
            { icon: 'wrench', text: '家电维修' },
            { icon: 'truck', text: '搬家搬厂' },
            { icon: 'heart', text: '月嫂育儿' },
            { icon: 'scissors', text: '衣物洗护' },
            { icon: 'shield', text: '除醛除螨' },
            { icon: 'clock', text: '临时钟点' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('stats', {
          items: [
            { value: '3.6w', label: '服务家庭' },
            { value: '2860', label: '认证阿姨' },
            { value: '4.9', label: '平均评分' },
            { value: '98%', label: '准时率' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, radius: 14 }),
        title('热门服务', ''),
        n('goods', {
          layout: 'grid',
          columns: 2,
          items: [
            { image: '', name: '日常保洁 · 4 小时', desc: '含擦窗 · 工具自带', price: '158', origin: '198', tag: '热销', sales: '8624' },
            { image: '', name: '深度保洁 · 全屋', desc: '8 小时 · 含厨房除油', price: '398', origin: '568', tag: '推荐', sales: '3862' },
            { image: '', name: '空调清洗 · 挂机', desc: '拆洗 · 高温杀菌', price: '128', origin: '168', tag: '', sales: '5210' },
            { image: '', name: '油烟机拆洗', desc: '免拆装 · 深度去油', price: '188', origin: '258', tag: '限时', sales: '2148' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        title('优质服务人员', ''),
        n('team', {
          items: [
            { avatar: '', name: '王秀兰', title: '金牌保洁 · 5 年经验', desc: '服务 1286 单 · 好评率 99% · 擅长精细收纳', tags: '日常保洁,收纳整理' },
            { avatar: '', name: '刘建国', title: '高级维修师傅', desc: '持证电工 · 服务 2140 单 · 擅长水电与家电维修', tags: '水电维修,家电维修' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        n('comment', {
          title: '用户评价',
          rating: '4.9',
          count: '2.6w',
          items: [
            { name: '用户 陈女士', rating: 5, content: '阿姨很细心，厨房油污清理得很干净，还主动帮我把杂物收纳了。', date: '08-27', tags: '干活细致,准时到达' },
            { name: '用户 王先生', rating: 5, content: '修空调的师傅很专业，20 分钟就搞定，价格也透明。', date: '08-24', tags: '技术专业,价格透明' },
          ],
        }, { ...S.card }),
        n('floatBtn', { icon: 'headset', text: '客服', bg: '', position: 'br', action: 'call', phone: '400-820-0000' }, { marginTop: 8, marginBottom: 8 }),
        footer('© 2026 洁净到家家政服务'),
      ]),
      page('service', '服务', '全部服务', [
        searchBar('搜索服务'),
        n('tabs', { items: [{ text: '保洁' }, { text: '维修' }, { text: '月嫂' }, { text: '搬家' }, { text: '洗护' }], active: 0 }),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '日常保洁 · 4 小时', desc: '含擦玻璃、地面清洁、厨卫基础清洁 · 工具耗材自带', price: '158', origin: '198', tag: '热销', sales: '8624 人预定' },
            { image: '', name: '深度保洁 · 全屋', desc: '8 小时 · 含厨房重油污、卫浴水垢、家具护理', price: '398', origin: '568', tag: '推荐', sales: '3862 人预定' },
            { image: '', name: '新居开荒保洁', desc: '按面积计费 · 装修后深度清洁', price: '6', origin: '8', tag: '', sales: '1240 人预定' },
            { image: '', name: '家电清洗套餐', desc: '空调 + 洗衣机 + 油烟机 · 高温杀菌', price: '328', origin: '468', tag: '省140', sales: '2876 人预定' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10, marginTop: 8 }),
        title('服务保障', ''),
        n('steps', {
          direction: 'row',
          items: [
            { icon: 'search', title: '选服务', desc: '按需挑选' },
            { icon: 'calendar', title: '约时间', desc: '指定上门' },
            { icon: 'users', title: '派阿姨', desc: '智能匹配' },
            { icon: 'check', title: '验收付款', desc: '满意再付' },
          ],
        }, { ...S.card }),
        n('serviceBar', {
          items: [
            { icon: 'shield', text: '实名认证' },
            { icon: 'award', text: '技能考核' },
            { icon: 'repeat', text: '不满意重做' },
            { icon: 'headset', text: '全程保险' },
          ],
        }, { paddingTop: 12, paddingBottom: 4 }),
        footer(),
      ]),
      page('order', '下单', '预约下单', [
        n('form', {
          title: '填写服务信息',
          fields: [
            { label: '联系人', type: 'text', placeholder: '请输入联系人姓名', required: true },
            { label: '手机号', type: 'phone', placeholder: '服务人员将联系此号码', required: true },
            { label: '服务地址', type: 'text', placeholder: '请输入详细地址', required: true },
            { label: '服务类型', type: 'picker', placeholder: '请选择服务类型', required: true },
            { label: '上门时间', type: 'date', placeholder: '请选择上门时间', required: true },
            { label: '房屋面积', type: 'picker', placeholder: '请选择面积区间', required: false },
            { label: '备注', type: 'textarea', placeholder: '宠物、门禁、重点清洁区域等', required: false },
          ],
          submitText: '提交订单',
          tip: '提交后 30 分钟内为您匹配服务人员',
        }, { ...S.card, marginTop: 10 }),
        n('coupon', {
          items: [
            { amount: '50', condition: '新客首单可用', name: '新客券', tag: '已领' },
            { amount: '20', condition: '满 158 可用', name: '保洁券', tag: '领取' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 4 }),
        n('steps', {
          direction: 'column',
          items: [
            { icon: 'edit', title: '提交需求', desc: '填写服务信息与上门时间' },
            { icon: 'users', title: '智能派单', desc: '系统按距离与评分匹配阿姨' },
            { icon: 'phone', title: '电话确认', desc: '阿姨与您确认细节' },
            { icon: 'truck', title: '上门服务', desc: '准时上门完成服务' },
            { icon: 'check', title: '验收评价', desc: '满意后付款并评价' },
          ],
        }, { ...S.card }),
        n('faq', {
          items: [
            { q: '需要自己准备工具吗？', a: '不需要。服务人员会自带全套清洁工具与常用耗材，特殊耗材需提前说明。' },
            { q: '可以指定阿姨吗？', a: '可以。在"我的阿姨"中将喜欢的阿姨加入常用，下单时优先派单。' },
            { q: '服务不满意怎么办？', a: '服务完成后 24 小时内可申请返工，核实后将安排免费重新服务。' },
          ],
        }, { ...S.card }),
        n('cartBar', { total: '￥158.00', count: 1, buttonText: '立即预约', tip: '新客减 50' }),
      ]),
      page('my', '我的', '我的', myPage({
        name: '用户 · 李女士',
        desc: '普通会员 · 已下单 18 次',
        stats: [
          { value: '1', label: '待服务' },
          { value: '18', label: '历史订单' },
          { value: '3', label: '优惠券' },
          { value: '2', label: '常用阿姨' },
        ],
        grid: [
          { icon: 'list', text: '我的订单' },
          { icon: 'users', text: '我的阿姨' },
          { icon: 'pin', text: '地址管理' },
          { icon: 'coupon', text: '优惠券' },
          { icon: 'award', text: '会员中心' },
          { icon: 'heart', text: '收藏服务' },
          { icon: 'headset', text: '客服中心' },
          { icon: 'message', text: '我的评价' },
        ],
        banner: { title: '开通年卡 全年 9 折', sub: '不限次数 · 优先派单', buttonText: '立即开通' },
        rows: [
          { icon: 'pin', label: '常用地址', value: '静安区共和新路' },
          { icon: 'phone', label: '客服热线', value: '400-820-0000', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 11. 二手交易                                                         */
/* ================================================================== */
const market: TemplateDef = {
  id: 'market',
  name: '二手交易',
  industry: '二手闲置',
  desc: '闲置发布、商品浏览、聊天议价与个人主页，校园和社区跳蚤市场适用。',
  cover: 'linear-gradient(135deg,#ffecd2,#ff8f1f)',
  tags: ['闲置发布', '商品浏览', '聊天议价', '个人主页'],
  build: () => ({
    name: '闲置集市',
    appid: 'touristappid',
    description: '二手闲置交易小程序模板',
    templateId: 'market',
    theme: {
      primary: '#ff8f1f',
      primaryLight: '#fff5e9',
      secondary: '#ff4d4f',
      accent: '#2f8f6b',
      text: '#1f1a15',
      subText: '#7d7469',
      background: '#f7f5f2',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '逛逛', 'home'],
        ['publish', '发布', 'plus'],
        ['message', '消息', 'message'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#ff8f1f' },
    ),
    pages: [
      page('home', '逛逛', '闲置集市', [
        searchBar('搜索你想淘的好物'),
        n('tabs', { items: [{ text: '推荐' }, { text: '数码' }, { text: '家居' }, { text: '服饰' }, { text: '图书' }, { text: '母婴' }], active: 0 }),
        n('grid', {
          items: [
            { icon: 'camera', text: '数码' },
            { icon: 'home', text: '家居' },
            { icon: 'bag', text: '箱包' },
            { icon: 'book', text: '图书' },
            { icon: 'car', text: '车品' },
            { icon: 'dumbbell', text: '运动' },
            { icon: 'heart', text: '母婴' },
            { icon: 'gift', text: '免费送' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14, marginTop: 8 }),
        n('notice', { text: '📦 平台担保交易，验货满意再放款，全程免费', icon: 'shield', more: false }, { paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6 }),
        title('今日上新', '刚刚有人发布了闲置'),
        n('goods', {
          layout: 'grid',
          columns: 2,
          items: [
            { image: '', name: 'iPhone 14 128G 国行', desc: '95 新 · 电池 92%', price: '3280', origin: '5999', tag: '可刀', sales: '86 人想要' },
            { image: '', name: '宜家书桌 + 椅子', desc: '自提 · 九成新', price: '180', origin: '', tag: '', sales: '32 人想要' },
            { image: '', name: 'Kindle Paperwhite', desc: '带保护套 · 无明显划痕', price: '420', origin: '998', tag: '', sales: '54 人想要' },
            { image: '', name: '婴儿推车 高景观', desc: '用了半年 · 已消毒', price: '360', origin: '1280', tag: '急出', sales: '41 人想要' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        title('免费送 · 同城自提', ''),
        n('goods', {
          layout: 'row',
          items: [
            { image: '', name: '绿植若干', desc: '搬家清仓', price: '0', origin: '', tag: '免费', sales: '' },
            { image: '', name: '考研资料全套', desc: '附笔记', price: '0', origin: '', tag: '免费', sales: '' },
            { image: '', name: '猫爬架', desc: '可拆卸', price: '0', origin: '', tag: '免费', sales: '' },
          ],
        }, { paddingTop: 4, paddingBottom: 8 }),
        n('serviceBar', {
          items: [
            { icon: 'shield', text: '担保交易' },
            { icon: 'check', text: '验货付款' },
            { icon: 'truck', text: '运费险' },
            { icon: 'headset', text: '纠纷仲裁' },
          ],
        }, { paddingTop: 12, paddingBottom: 4 }),
        footer('© 2026 闲置集市 · 让闲置流动起来'),
      ]),
      page('publish', '发布', '发布闲置', [
        n('form', {
          title: '宝贝信息',
          fields: [
            { label: '宝贝标题', type: 'text', placeholder: '例如：iPhone 14 128G 国行', required: true },
            { label: '宝贝描述', type: 'textarea', placeholder: '成色、购买渠道、转手原因等', required: true },
            { label: '分类', type: 'picker', placeholder: '请选择分类', required: true },
            { label: '成色', type: 'picker', placeholder: '全新 / 95新 / 9成新 / 8成新', required: true },
            { label: '转让价格', type: 'text', placeholder: '请输入价格（元）', required: true },
            { label: '原价', type: 'text', placeholder: '选填', required: false },
            { label: '交易方式', type: 'picker', placeholder: '快递 / 同城自提 / 都可', required: false },
          ],
          submitText: '发布宝贝',
          tip: '发布后可在"我的发布"中管理',
        }, { ...S.card, marginTop: 10 }),
        title('上传图片', '第一张为封面'),
        n('view',
          { direction: 'row', gap: 10, align: 'flex-start' },
          { paddingLeft: 14, paddingRight: 14, paddingTop: 4, paddingBottom: 8 },
          [
            n('image', { src: '', height: 92, radius: 10 }, { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }),
            n('image', { src: '', height: 92, radius: 10 }, { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }),
            n('image', { src: '', height: 92, radius: 10 }, { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }),
          ],
        ),
        n('steps', {
          direction: 'row',
          items: [
            { icon: 'edit', title: '填信息', desc: '描述真实' },
            { icon: 'camera', title: '传图片', desc: '实拍更可信' },
            { icon: 'tag', title: '定价格', desc: '参考行情' },
            { icon: 'check', title: '发布', desc: '坐等买家' },
          ],
        }, { ...S.card }),
        n('faq', {
          items: [
            { q: '平台收取手续费吗？', a: '当前完全免费，不向买家和卖家收取任何手续费。' },
            { q: '怎么保证不被骗？', a: '建议使用平台担保交易：买家付款后资金由平台托管，确认收货后放款给卖家。' },
            { q: '发布后能修改吗？', a: '可以。在"我的发布"中找到宝贝，支持修改价格、描述与图片，也可直接下架。' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('message', '消息', '消息', [
        n('search', { placeholder: '搜索聊天' }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 6 }),
        n('comment', {
          title: '最近联系',
          rating: '',
          count: '',
          items: [
            { name: '数码小铺', rating: 5, content: '你好，iPhone 14 还有货吗？可以小刀吗？', date: '刚刚', tags: '' },
            { name: '家居达人', rating: 5, content: '书桌还在的，方便的话今天下午可以来看。', date: '12:30', tags: '' },
            { name: '书虫老张', rating: 5, content: 'Kindle 已经帮你留着了，随时可以下单。', date: '昨天', tags: '' },
            { name: '闲置集市官方', rating: 5, content: '您的宝贝已通过审核，当前有 12 人浏览。', date: '08-27', tags: '' },
          ],
        }, { ...S.card, marginTop: 8 }),
        n('notice', { text: '💡 聊天中请勿脱离平台私下转账，避免资金风险', icon: 'shield', more: false }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 6 }),
        title('交易动态', ''),
        n('timeline', {
          items: [
            { time: '今天 12:20', title: '买家已付款，等待发货', desc: 'iPhone 14 128G · 担保交易中' },
            { time: '今天 10:05', title: '卖家已发货，运输中', desc: '顺丰速运 SF1234567890' },
            { time: '昨天 18:40', title: '买家已确认收货', desc: '款项将在 1 小时内到账' },
            { time: '08-26', title: '交易完成，双方互评', desc: '获得 5 星好评' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('my', '我的', '我的', myPage({
        name: '卖家 · 阿泽',
        desc: '已售 42 件 · 好评率 99%',
        stats: [
          { value: '6', label: '在售' },
          { value: '42', label: '已售' },
          { value: '3', label: '待发货' },
          { value: '2860', label: '钱包余额' },
        ],
        grid: [
          { icon: 'edit', text: '我的发布' },
          { icon: 'cart', text: '我买到的' },
          { icon: 'heart', text: '收藏宝贝' },
          { icon: 'message', text: '消息中心' },
          { icon: 'truck', text: '物流查询' },
          { icon: 'award', text: '信用分' },
          { icon: 'headset', text: '客服中心' },
          { icon: 'gift', text: '邀请好友' },
        ],
        banner: { title: '邀请好友得现金', sub: '好友首单你得 20 元', buttonText: '去邀请' },
        rows: [
          { icon: 'shield', label: '实名认证', value: '已认证' },
          { icon: 'award', label: '信用分', value: '优秀 96 分' },
          { icon: 'phone', label: '平台客服', value: '400-300-0000', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 12. 个人作品集                                                       */
/* ================================================================== */
const portfolio: TemplateDef = {
  id: 'portfolio',
  name: '个人作品集',
  industry: '创意个人',
  desc: '设计师、摄影师、独立开发者的个人主页：作品展示、文章、经历与联系方式。',
  cover: 'linear-gradient(135deg,#c7cbd6,#22262f)',
  tags: ['作品展示', '个人简介', '文章博客', '联系方式'],
  build: () => ({
    name: '林深的作品集',
    appid: 'touristappid',
    description: '个人作品集小程序模板',
    templateId: 'portfolio',
    theme: {
      primary: '#22262f',
      primaryLight: '#f0f1f4',
      secondary: '#c08b5c',
      accent: '#5b9df9',
      text: '#14161c',
      subText: '#7b8494',
      background: '#f5f6f8',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 18,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '主页', 'home'],
        ['works', '作品', 'camera'],
        ['blog', '文章', 'book'],
        ['about', '关于', 'user'],
      ],
      { selectedColor: '#22262f' },
    ),
    pages: [
      page('home', '主页', '林深 · 视觉设计', [
        n('shop', {
          name: '林深',
          logo: '',
          desc: '视觉设计师 / 独立创作者 · 上海',
          tags: ['品牌设计', '数字产品', '摄影'],
          rating: '5.0',
          address: '当前接单中 · 排期至 2026 年 10 月',
          phone: 'hi@linshen.design',
          hours: '通常 24 小时内回复',
        }, { ...S.card, marginTop: 10 }),
        n('stats', {
          items: [
            { value: '8', label: '年设计经验' },
            { value: '216', label: '交付项目' },
            { value: '46', label: '服务品牌' },
            { value: '18', label: '获奖记录' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, radius: 14 }),
        title('精选作品', 'Selected Works'),
        n('goods', {
          layout: 'grid',
          columns: 2,
          showPrice: false,
          items: [
            { image: '', name: '山海茶事 品牌全案', desc: '品牌 / 包装 / 2026', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '云笔记 App 改版', desc: 'UI / 交互 / 2025', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '城市漫游 摄影集', desc: '摄影 / 出版 / 2025', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '青禾咖啡 空间视觉', desc: '空间 / 导视 / 2024', price: '', origin: '', tag: '', sales: '' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        title('服务能力', ''),
        n('grid', {
          items: [
            { icon: 'sparkles', text: '品牌设计' },
            { icon: 'layout', text: 'UI/UX' },
            { icon: 'camera', text: '商业摄影' },
            { icon: 'edit', text: '插画绘制' },
            { icon: 'video', text: '动效视频' },
            { icon: 'book', text: '书籍装帧' },
          ],
          columns: 3,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('text', {
          content: '我相信好的设计不只是好看，而是让信息被准确、舒服地接收到。\n\n过去八年，我为消费品牌、科技公司与文化机构提供从策略到落地的完整设计服务，擅长把抽象的品牌气质转化为可执行的视觉系统。',
          size: 13,
          color: '#5b6472',
          lineHeight: 1.9,
        }, { ...S.card, paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14 }),
        n('banner', { title: '有项目想聊聊？', sub: '告诉我你的需求与预算区间', buttonText: '联系我' }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 8 }),
        footer('© 2026 林深 · All rights reserved'),
      ]),
      page('works', '作品', '作品集', [
        n('tabs', { items: [{ text: '全部' }, { text: '品牌' }, { text: '数字' }, { text: '摄影' }, { text: '插画' }], active: 0 }),
        n('goods', {
          layout: 'grid',
          columns: 2,
          showPrice: false,
          items: [
            { image: '', name: '山海茶事 品牌全案', desc: '标志 / 包装 / 空间 / 2026', price: '', origin: '', tag: '新作', sales: '' },
            { image: '', name: '云笔记 App 改版', desc: 'UI / 设计系统 / 2025', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '青禾咖啡 空间视觉', desc: '导视 / 物料 / 2024', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '城市漫游 摄影集', desc: '摄影 / 出版 / 2025', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '春日限定 插画系列', desc: '插画 / 商业授权 / 2024', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '拾光书店 视觉系统', desc: 'VI / 海报 / 2023', price: '', origin: '', tag: '', sales: '' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 8 }),
        title('项目过程', '从理解到落地'),
        n('steps', {
          direction: 'column',
          items: [
            { icon: 'search', title: '需求洞察', desc: '访谈、竞品分析，明确品牌定位与用户画像' },
            { icon: 'sparkles', title: '概念发散', desc: '提供 2-3 个方向的视觉提案供选择' },
            { icon: 'edit', title: '深化设计', desc: '确定方向后完成全套应用规范' },
            { icon: 'check', title: '交付落地', desc: '提供源文件、规范手册与落地支持' },
          ],
        }, { ...S.card }),
        n('comment', {
          title: '客户反馈',
          rating: '5.0',
          count: '86',
          items: [
            { name: '山海茶事 主理人', rating: 5, content: '新包装上线后复购率提升了 20%，很多客人说包装好看舍不得扔。', date: '07-18', tags: '专业,超出预期' },
            { name: '云笔记 产品经理', rating: 5, content: '设计系统交付得很完整，研发落地几乎没有走样，省了大量沟通成本。', date: '05-26', tags: '规范清晰,沟通高效' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('blog', '文章', '写作', [
        n('tabs', { items: [{ text: '全部' }, { text: '设计' }, { text: '方法' }, { text: '随笔' }], active: 0 }),
        n('article', {
          items: [
            { image: '', title: '如何建立一套可复用的设计系统', desc: '从颜色、字阶到组件状态，一次讲清设计系统的搭建方法', author: '林深', date: '08-24', views: '6820' },
            { image: '', title: '独立设计师的报价方法论', desc: '为什么我不再按小时计费，以及如何给创意定价', author: '林深', date: '08-11', views: '1.2w' },
            { image: '', title: '拍摄城市：我的五个构图习惯', desc: '不是器材决定照片，而是你站在哪里、等了多久', author: '林深', date: '07-29', views: '4860' },
            { image: '', title: '写给甲方：怎样提需求更高效', desc: '一份好的 brief 应该包含哪些信息', author: '林深', date: '07-06', views: '9240' },
          ],
        }, { ...S.card, marginTop: 8 }),
        n('banner', { title: '订阅我的 Newsletter', sub: '每月一封，只聊设计与创作', buttonText: '去订阅' }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 8 }),
        footer(),
      ]),
      page('about', '关于', '关于我', [
        n('text', {
          content:
            '我是林深，一名常驻上海的视觉设计师与独立创作者。\n\n2018 年从广告公司离职后独立接单，主要服务消费品牌与早期科技团队。我相信设计是一种翻译工作：把品牌想说的话，翻译成用户能一眼看懂、并且愿意记住的形式。\n\n工作之外，我拍照、写字，偶尔做一点小册子。',
          size: 13,
          color: '#5b6472',
          lineHeight: 1.9,
        }, { ...S.card, paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14, marginTop: 10 }),
        title('经历', ''),
        n('timeline', {
          items: [
            { time: '2023 - 至今', title: '独立设计师工作室', desc: '服务 46 个品牌，涵盖消费、科技与文化领域' },
            { time: '2019 - 2023', title: '某互联网公司 设计负责人', desc: '从 0 搭建设计团队与设计系统' },
            { time: '2016 - 2019', title: '4A 广告公司 美术指导', desc: '负责快消与汽车客户的品牌 campaign' },
            { time: '2014 - 2016', title: '视觉传达 本科', desc: '作品获全国大学生设计比赛金奖' },
          ],
        }, { ...S.card }),
        n('richText', {
          html: '<h3>我的工作方式</h3><p>每个项目都从一次长谈开始。我会先弄清楚你要解决的是什么问题，再谈视觉——设计不是把东西做得漂亮，而是让对的信息，在对的地方，被对的人看见。</p><ul><li>策略先行：先想清楚，再动手</li><li>过程透明：每个阶段都给你看</li><li>交付完整：源文件 + 规范手册 + 落地支持</li></ul>',
          background: '#ffffff',
          radius: 14,
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 8, paddingBottom: 8 }),
        title('获奖与展出', ''),
        n('stats', {
          items: [
            { value: '18', label: '获奖记录' },
            { value: '6', label: '联展参与' },
            { value: '3', label: '出版作品' },
            { value: '216', label: '交付项目' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 8, radius: 14 }),
        n('contact', {
          items: [
            { icon: 'message', label: '邮箱', value: 'hi@linshen.design', action: '复制' },
            { icon: 'phone', label: '微信', value: 'linshen_design', action: '复制' },
            { icon: 'pin', label: '所在城市', value: '中国上海', action: '' },
            { icon: 'clock', label: '当前状态', value: '接单中 · 排期至 10 月', action: '' },
          ],
        }, { ...S.card }),
        n('form', {
          title: '项目咨询',
          fields: [
            { label: '你的名字', type: 'text', placeholder: '请输入称呼', required: true },
            { label: '联系方式', type: 'phone', placeholder: '手机或微信', required: true },
            { label: '项目类型', type: 'picker', placeholder: '品牌 / UI / 摄影 / 其他', required: false },
            { label: '项目简介', type: 'textarea', placeholder: '简单描述项目背景、时间与预算', required: true },
          ],
          submitText: '发送需求',
          tip: '通常 24 小时内回复',
        }, { ...S.card }),
        footer('© 2026 林深 · 感谢你的时间'),
      ]),
    ],
  }),
}

/* ================================================================== */
/* 13. 汽车服务                                                         */
/* ================================================================== */
const auto: TemplateDef = {
  id: 'auto',
  name: '汽车服务',
  industry: '汽车后市场',
  desc: '洗车美容、保养维修、违章查询与门店预约，4S 店与汽修连锁通用。',
  cover: 'linear-gradient(135deg,#c2e9fb,#1f6feb)',
  tags: ['服务预约', '保养套餐', '门店导航', '爱车档案'],
  build: () => ({
    name: '速洁养车',
    appid: 'touristappid',
    description: '汽车服务小程序模板',
    templateId: 'auto',
    theme: {
      primary: '#1f6feb',
      primaryLight: '#eef5ff',
      secondary: '#ff6b35',
      accent: '#00c48c',
      text: '#141a26',
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
        ['service', '服务', 'grid'],
        ['booking', '预约', 'calendar'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#1f6feb' },
    ),
    pages: [
      page('home', '首页', '速洁养车', [
        hero([
          { title: '精洗打蜡套餐 129', desc: '原价 288 · 限时抢购' },
          { title: '保养套餐 立省 300', desc: '含全合成机油 + 机滤' },
          { title: '新客首单 5 折', desc: '洗车 / 打蜡 / 内饰清洁' },
        ]),
        n('grid', {
          items: [
            { icon: 'sparkles', text: '洗车美容' },
            { icon: 'wrench', text: '保养维修' },
            { icon: 'car', text: '轮胎轮毂' },
            { icon: 'shield', text: '车险续保' },
            { icon: 'search', text: '违章查询' },
            { icon: 'calendar', text: '预约到店' },
            { icon: 'pin', text: '门店导航' },
            { icon: 'headset', text: '道路救援' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('notice', { text: '🚗 您的爱车已行驶 4820 km，建议本月内完成保养', icon: 'car', more: true }, { paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6 }),
        title('热门服务', ''),
        n('goods', {
          layout: 'grid',
          columns: 2,
          items: [
            { image: '', name: '标准洗车', desc: '外观 + 内饰吸尘 · 30min', price: '45', origin: '68', tag: '热销', sales: '8624' },
            { image: '', name: '精洗打蜡套餐', desc: '含漆面打蜡 · 90min', price: '129', origin: '288', tag: '限时', sales: '3862' },
            { image: '', name: '小保养套餐', desc: '全合成机油 + 机滤 + 工时', price: '398', origin: '698', tag: '推荐', sales: '5210' },
            { image: '', name: '内饰深度清洁', desc: '真皮护理 · 空调除味', price: '268', origin: '398', tag: '', sales: '2148' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        title('附近门店', ''),
        n('shop', {
          name: '速洁养车（静安店）',
          desc: '5 个工位 · 当前无需排队',
          tags: ['免费接驳', '休息区', '质保 6 个月'],
          rating: '4.8',
          address: '上海市静安区汶水路 888 号',
          phone: '021-6688 0000',
          hours: '08:30 - 19:00',
        }, { ...S.card }),
        n('comment', {
          title: '车主评价',
          rating: '4.8',
          count: '1.2w',
          items: [
            { name: '车主 陈先生', rating: 5, content: '保养价格透明，没有乱加项目，做完还给了下次保养提醒贴纸。', date: '08-26', tags: '价格透明,服务好' },
            { name: '车主 周女士', rating: 5, content: '精洗做得很仔细，轮毂缝隙都清理干净了，比 4S 店便宜一半。', date: '08-21', tags: '洗得干净,性价比高' },
          ],
        }, { ...S.card }),
        footer('© 2026 速洁养车连锁'),
      ]),
      page('service', '服务', '全部服务', [
        searchBar('搜索服务 / 配件'),
        n('tabs', { items: [{ text: '洗车' }, { text: '保养' }, { text: '维修' }, { text: '美容' }, { text: '轮胎' }], active: 0 }),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '标准洗车', desc: '外观冲洗 + 内饰吸尘 + 轮胎护理 · 约 30 分钟', price: '45', origin: '68', tag: '热销', sales: '8624 人购买' },
            { image: '', name: '精洗打蜡套餐', desc: '深度清洁 + 漆面打蜡 + 轮毂除铁粉 · 约 90 分钟', price: '129', origin: '288', tag: '限时', sales: '3862 人购买' },
            { image: '', name: '小保养套餐', desc: '全合成机油 4L + 机滤 + 工时 · 含 21 项检查', price: '398', origin: '698', tag: '推荐', sales: '5210 人购买' },
            { image: '', name: '空调系统清洗', desc: '蒸发箱可视化清洗 + 杀菌除味', price: '168', origin: '268', tag: '', sales: '2876 人购买' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10, marginTop: 8 }),
        title('保养套餐', '按里程选择'),
        n('priceCard', {
          items: [
            { name: '基础保养', price: '398', period: '/ 次', features: '全合成机油\n机滤更换\n21 项安全检查\n免费洗车', highlight: false, btnText: '立即购买' },
            { name: '深度保养', price: '898', period: '/ 次', features: '全合成机油\n三滤全换\n刹车检测\n轮胎换位\n空调清洗', highlight: true, btnText: '立即抢购' },
            { name: '年度养护卡', price: '2680', period: '/ 年', features: '全年不限次洗车\n2 次基础保养\n12 次安全检查\n道路救援', highlight: false, btnText: '咨询顾问' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 12 }),
        n('serviceBar', {
          items: [
            { icon: 'shield', text: '正品配件' },
            { icon: 'award', text: '技师认证' },
            { icon: 'tag', text: '价格透明' },
            { icon: 'check', text: '质保 6 个月' },
          ],
        }, { paddingTop: 8, paddingBottom: 4 }),
        footer(),
      ]),
      page('booking', '预约', '预约到店', [
        n('form', {
          title: '填写预约信息',
          fields: [
            { label: '车牌号', type: 'text', placeholder: '请输入车牌号', required: true },
            { label: '联系人', type: 'text', placeholder: '请输入联系人', required: true },
            { label: '手机号', type: 'phone', placeholder: '请输入手机号', required: true },
            { label: '服务类型', type: 'picker', placeholder: '请选择服务', required: true },
            { label: '到店时间', type: 'date', placeholder: '请选择时间', required: true },
            { label: '备注', type: 'textarea', placeholder: '车辆状况或特殊需求', required: false },
          ],
          submitText: '提交预约',
          tip: '到店后凭预约码直接开工，无需排队',
        }, { ...S.card, marginTop: 10 }),
        n('shop', {
          name: '速洁养车（静安店）',
          desc: '5 个工位 · 当前无需排队',
          tags: ['免费接驳', '休息区', '质保 6 个月'],
          rating: '4.8',
          address: '上海市静安区汶水路 888 号',
          phone: '021-6688 0000',
          hours: '08:30 - 19:00',
        }, { ...S.card }),
        n('map', { title: '速洁养车（静安店）', address: '上海市静安区汶水路 888 号', distance: '距您 2.3km', buttonText: '导航前往' }, { ...S.card }),
        n('steps', {
          direction: 'row',
          items: [
            { icon: 'edit', title: '提交预约', desc: '选择服务时间' },
            { icon: 'car', title: '到店交接', desc: '登记车况' },
            { icon: 'wrench', title: '施工服务', desc: '休息区等候' },
            { icon: 'check', title: '验收取车', desc: '满意再付款' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('my', '我的', '我的爱车', myPage({
        name: '车主 · 陈先生',
        desc: '沪A·88888 · 已绑定 2 辆车',
        stats: [
          { value: '1', label: '待到店' },
          { value: '8', label: '服务记录' },
          { value: '3', label: '优惠券' },
          { value: '4820', label: '距保养km' },
        ],
        grid: [
          { icon: 'calendar', text: '我的预约' },
          { icon: 'car', text: '爱车档案' },
          { icon: 'list', text: '服务记录' },
          { icon: 'coupon', text: '优惠券' },
          { icon: 'search', text: '违章查询' },
          { icon: 'shield', text: '车险续保' },
          { icon: 'pin', text: '常用门店' },
          { icon: 'headset', text: '道路救援' },
        ],
        banner: { title: '年度养护卡 2680', sub: '全年不限次洗车 + 2 次保养', buttonText: '立即开通' },
        rows: [
          { icon: 'car', label: '默认车辆', value: '沪A·88888 大众' },
          { icon: 'clock', label: '下次保养', value: '2026-11-20' },
          { icon: 'phone', label: '门店电话', value: '021-6688 0000', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 14. 社区团购                                                         */
/* ================================================================== */
const group: TemplateDef = {
  id: 'group',
  name: '社区团购',
  industry: '社区生鲜',
  desc: '今日开团、接龙下单、自提点与团长管理，社区团购与生鲜配送适用。',
  cover: 'linear-gradient(135deg,#ff9a9e,#ff4d4f)',
  tags: ['今日开团', '接龙下单', '自提点', '团长中心'],
  build: () => ({
    name: '邻里团',
    appid: 'touristappid',
    description: '社区团购小程序模板',
    templateId: 'group',
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
        ['home', '开团', 'home'],
        ['group', '团购', 'gift'],
        ['order', '订单', 'list'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#ff4d4f' },
    ),
    pages: [
      page('home', '开团', '邻里团 · 静安 3 期', [
        noticeBar('📍 当前自提点：静安 3 期 · 3 号楼架空层 · 今日 18:00 前送达'),
        n('countdown', { title: '今日团 距截单', days: '00', hours: '05', minutes: '32', seconds: '18' }, { paddingTop: 8, paddingBottom: 8, radius: 12, marginTop: 8, marginBottom: 8 }),
        n('grid', {
          items: [
            { icon: 'coffee', text: '生鲜果蔬' },
            { icon: 'gift', text: '日用百货' },
            { icon: 'heart', text: '肉禽蛋品' },
            { icon: 'truck', text: '乳品烘焙' },
            { icon: 'star', text: '今日必抢' },
            { icon: 'users', text: '我的团长' },
            { icon: 'pin', text: '自提点' },
            { icon: 'list', text: '我的接龙' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        title('今日爆款', '截单后次日送达'),
        n('seckill', {
          title: '限时拼团',
          sub: '距截单 05:32:18',
          items: [
            { image: '', name: '阳光玫瑰葡萄', price: '39.9', origin: '68' },
            { image: '', name: '散养土鸡蛋 30枚', price: '29.9', origin: '45' },
            { image: '', name: '现摘麒麟西瓜', price: '19.9', origin: '35' },
            { image: '', name: '内蒙羔羊肉卷', price: '49.9', origin: '88' },
          ],
        }, { ...S.card, paddingTop: 14, paddingBottom: 12 }),
        title('本周热销', ''),
        n('goods', {
          layout: 'grid',
          columns: 2,
          items: [
            { image: '', name: '云南高原蓝莓', desc: '125g×4 盒 · 中大果', price: '49.9', origin: '79', tag: '拼团', sales: '1286' },
            { image: '', name: '山东红富士苹果', desc: '5 斤装 · 脆甜多汁', price: '29.9', origin: '45', tag: '', sales: '2362' },
            { image: '', name: '现磨豆浆粉', desc: '30 包 · 无添加蔗糖', price: '19.9', origin: '32', tag: '新品', sales: '864' },
            { image: '', name: '手工水饺 1kg', desc: '猪肉白菜 · 速冻', price: '25.9', origin: '39', tag: '', sales: '1520' },
          ],
        }, { paddingLeft: 12, paddingRight: 12, paddingBottom: 8 }),
        n('shop', {
          name: '静安 3 期自提点 · 团长王姐',
          desc: '服务 286 户邻居 · 好评率 99%',
          tags: ['当日送达', '坏果包赔', '缺重必补'],
          rating: '4.9',
          address: '上海市静安区共和新路 3000 弄 3 号楼架空层',
          phone: '138****6666',
          hours: '自提时间 18:00 - 21:00',
        }, { ...S.card }),
        n('serviceBar', {
          items: [
            { icon: 'shield', text: '坏果包赔' },
            { icon: 'truck', text: '次日达' },
            { icon: 'repeat', text: '缺重必补' },
            { icon: 'headset', text: '团长客服' },
          ],
        }, { paddingTop: 12, paddingBottom: 4 }),
        footer('© 2026 邻里团社区团购'),
      ]),
      page('group', '团购', '全部团购', [
        searchBar('搜索商品'),
        n('tabs', { items: [{ text: '今日开团' }, { text: '生鲜' }, { text: '日用' }, { text: '乳品' }, { text: '粮油' }], active: 0 }),
        n('goods', {
          layout: 'list',
          items: [
            { image: '', name: '云南高原蓝莓', desc: '125g×4 盒 · 中大果 · 甜度 14°+ · 冷链直发', price: '49.9', origin: '79', tag: '拼团', sales: '1286 人已拼' },
            { image: '', name: '散养土鸡蛋 30 枚', desc: '林下散养 · 无抗生素 · 破损包赔', price: '29.9', origin: '45', tag: '', sales: '2362 人已拼' },
            { image: '', name: '内蒙羔羊肉卷 500g', desc: '原切羊肉 · 涮火锅首选', price: '49.9', origin: '88', tag: '热销', sales: '942 人已拼' },
            { image: '', name: '现摘麒麟西瓜 8-10 斤', desc: '8424 品种 · 甜度高 · 不甜包退', price: '19.9', origin: '35', tag: '', sales: '3120 人已拼' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10, marginTop: 8 }),
        title('拼团规则', ''),
        n('steps', {
          direction: 'row',
          items: [
            { icon: 'cart', title: '参团下单', desc: '在线支付' },
            { icon: 'users', title: '拼团成功', desc: '达到成团数' },
            { icon: 'truck', title: '产地发货', desc: '次日送达' },
            { icon: 'pin', title: '到点自提', desc: '当天自提' },
          ],
        }, { ...S.card }),
        n('faq', {
          items: [
            { q: '什么时候可以自提？', a: '截单后次日 18:00 前送达自提点，团长会发通知，凭提货码取货。' },
            { q: '水果坏了怎么办？', a: '自提后 24 小时内拍照联系团长，核实后全额退款，无需退货。' },
            { q: '可以取消订单吗？', a: '截单前可随时取消并全额退款；截单后商品已采购，暂不支持取消。' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('order', '订单', '我的订单', [
        n('tabs', { items: [{ text: '全部' }, { text: '待成团' }, { text: '待自提' }, { text: '已完成' }], active: 1 }),
        n('timeline', {
          items: [
            { time: '今天 10:32', title: '订单已支付，等待成团', desc: '阳光玫瑰葡萄 ×2 · 还需 12 人成团' },
            { time: '待处理', title: '拼团成功，等待发货', desc: '成团后次日 18:00 前送达自提点' },
            { time: '待处理', title: '货品已到自提点', desc: '团长将发送提货通知' },
            { time: '待处理', title: '确认自提，交易完成', desc: '如有问题可申请售后' },
          ],
        }, { ...S.card, marginTop: 8 }),
        title('历史订单', ''),
        n('article', {
          items: [
            { image: '', title: '静安 3 期自提点', desc: '蓝莓 ×2 · 土鸡蛋 ×1 · 已完成', author: '¥129.70', date: '08-27', views: '已自提' },
            { image: '', title: '静安 3 期自提点', desc: '麒麟西瓜 ×1 · 豆浆粉 ×2 · 已完成', author: '¥59.70', date: '08-24', views: '已自提' },
            { image: '', title: '静安 3 期自提点', desc: '羔羊肉卷 ×1 · 已完成', author: '¥49.90', date: '08-21', views: '已评价' },
          ],
        }, { ...S.card }),
        n('contact', {
          items: [
            { icon: 'users', label: '我的团长', value: '王姐 · 138****6666', action: '拨打' },
            { icon: 'pin', label: '自提地址', value: '3 号楼架空层', action: '导航' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('my', '我的', '我的', myPage({
        name: '邻居 · 小林',
        desc: '已参团 42 次 · 省了 862 元',
        stats: [
          { value: '1', label: '待自提' },
          { value: '42', label: '参团次数' },
          { value: '862', label: '累计省' },
          { value: '5', label: '优惠券' },
        ],
        grid: [
          { icon: 'list', text: '我的订单' },
          { icon: 'pin', text: '自提点' },
          { icon: 'users', text: '我的团长' },
          { icon: 'heart', text: '收藏商品' },
          { icon: 'coupon', text: '优惠券' },
          { icon: 'edit', text: '申请团长' },
          { icon: 'headset', text: '客服中心' },
          { icon: 'message', text: '我的评价' },
        ],
        banner: { title: '申请成为团长', sub: '零成本在家赚钱', buttonText: '立即申请' },
        rows: [
          { icon: 'pin', label: '常用自提点', value: '静安 3 期 3 号楼' },
          { icon: 'phone', label: '平台客服', value: '400-200-0000', action: '拨打' },
        ],
      })),
    ],
  }),
}

/* ================================================================== */
/* 15. 效率工具                                                         */
/* ================================================================== */
const tool: TemplateDef = {
  id: 'tool',
  name: '效率工具',
  industry: '效率工具',
  desc: '记账、习惯打卡、数据统计与提醒，轻量工具型小程序的通用骨架。',
  cover: 'linear-gradient(135deg,#e0c3fc,#6c5ce7)',
  tags: ['快速记账', '习惯打卡', '数据统计', '云端同步'],
  build: () => ({
    name: '轻记账',
    appid: 'touristappid',
    description: '效率工具类小程序模板',
    templateId: 'tool',
    theme: {
      primary: '#6c5ce7',
      primaryLight: '#f2efff',
      secondary: '#ff6b35',
      accent: '#00c48c',
      text: '#171431',
      subText: '#6f6b8a',
      background: '#f5f4fa',
      cardBg: '#ffffff',
      radius: 14,
      fontTitle: 17,
      fontBody: 14,
    },
    tabBar: tab(
      [
        ['home', '记一笔', 'home'],
        ['stats', '统计', 'sparkles'],
        ['habit', '习惯', 'check'],
        ['my', '我的', 'user'],
      ],
      { selectedColor: '#6c5ce7' },
    ),
    pages: [
      page('home', '记一笔', '轻记账', [
        n('stats', {
          items: [
            { value: '2864.50', label: '本月支出' },
            { value: '8600', label: '本月收入' },
            { value: '5735.50', label: '结余' },
            { value: '86', label: '记账天数' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, radius: 14 }),
        n('grid', {
          items: [
            { icon: 'coffee', text: '餐饮' },
            { icon: 'truck', text: '交通' },
            { icon: 'bag', text: '购物' },
            { icon: 'home', text: '居住' },
            { icon: 'play', text: '娱乐' },
            { icon: 'heartPulse', text: '医疗' },
            { icon: 'book', text: '学习' },
            { icon: 'gift', text: '其他' },
          ],
          columns: 4,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('form', {
          title: '记一笔',
          fields: [
            { label: '金额', type: 'text', placeholder: '0.00', required: true },
            { label: '分类', type: 'picker', placeholder: '请选择分类', required: true },
            { label: '日期', type: 'date', placeholder: '请选择日期', required: true },
            { label: '备注', type: 'textarea', placeholder: '记点什么吧（选填）', required: false },
          ],
          submitText: '保存',
          tip: '数据仅保存在本机，可在设置中开启云端同步',
        }, { ...S.card }),
        title('今日明细', '8 月 29 日'),
        n('article', {
          items: [
            { image: '', title: '午餐 · 公司食堂', desc: '餐饮 · 12:30', author: '-28.00', date: '今天', views: '' },
            { image: '', title: '地铁通勤', desc: '交通 · 08:42', author: '-6.00', date: '今天', views: '' },
            { image: '', title: '咖啡', desc: '餐饮 · 09:15', author: '-18.00', date: '今天', views: '' },
            { image: '', title: '工资', desc: '收入 · 10:00', author: '+8600.00', date: '今天', views: '' },
          ],
        }, { ...S.card }),
        footer('© 2026 轻记账 · 让每一笔都有迹可循'),
      ]),
      page('stats', '统计', '数据统计', [
        n('tabs', { items: [{ text: '本周' }, { text: '本月' }, { text: '本年' }], active: 1 }),
        n('stats', {
          items: [
            { value: '2864.50', label: '总支出' },
            { value: '8600', label: '总收入' },
            { value: '-12.4%', label: '环比' },
            { value: '92.30', label: '日均' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, radius: 14, marginTop: 8 }),
        title('支出构成', ''),
        n('timeline', {
          items: [
            { time: '32.4%', title: '餐饮 · ¥928.00', desc: '共 42 笔 · 日均 ¥30.9' },
            { time: '24.1%', title: '居住 · ¥690.00', desc: '房租分摊 + 水电' },
            { time: '18.6%', title: '购物 · ¥533.00', desc: '共 16 笔 · 含日用品' },
            { time: '12.2%', title: '交通 · ¥349.50', desc: '地铁 + 打车' },
          ],
        }, { ...S.card }),
        title('近 7 天趋势', ''),
        n('article', {
          items: [
            { image: '', title: '08-29 星期六', desc: '支出 52.00', author: '4 笔', date: '今天', views: '' },
            { image: '', title: '08-28 星期五', desc: '支出 186.50', author: '7 笔', date: '昨天', views: '' },
            { image: '', title: '08-27 星期四', desc: '支出 68.00', author: '3 笔', date: '前天', views: '' },
            { image: '', title: '08-26 星期三', desc: '支出 342.00', author: '9 笔', date: '', views: '' },
          ],
        }, { ...S.card }),
        n('banner', { title: '开启预算提醒', sub: '超支前自动推送通知', buttonText: '去设置' }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 8 }),
        footer(),
      ]),
      page('habit', '习惯', '习惯打卡', [
        n('countdown', { title: '连续打卡挑战', days: '21', hours: '', minutes: '', seconds: '' }, { paddingTop: 8, paddingBottom: 8, radius: 12, marginTop: 8, marginBottom: 8 }),
        n('stats', {
          items: [
            { value: '21', label: '连续天数' },
            { value: '86', label: '累计打卡' },
            { value: '92%', label: '完成率' },
            { value: '4', label: '进行中' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 8, radius: 14 }),
        title('今日打卡', '2026-08-29'),
        n('goods', {
          layout: 'list',
          showPrice: false,
          items: [
            { image: '', name: '早起 6:30', desc: '已连续 21 天 · 今日已完成', price: '', origin: '', tag: '✓', sales: '' },
            { image: '', name: '阅读 30 分钟', desc: '已连续 12 天 · 今日已完成', price: '', origin: '', tag: '✓', sales: '' },
            { image: '', name: '运动 40 分钟', desc: '已连续 8 天 · 待完成', price: '', origin: '', tag: '', sales: '' },
            { image: '', name: '记账', desc: '已连续 86 天 · 待完成', price: '', origin: '', tag: '', sales: '' },
          ],
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 10 }),
        title('打卡日历', ''),
        n('grid', {
          items: [
            { icon: 'check', text: '周一' },
            { icon: 'check', text: '周二' },
            { icon: 'check', text: '周三' },
            { icon: 'check', text: '周四' },
            { icon: 'check', text: '周五' },
            { icon: 'check', text: '周六' },
            { icon: 'clock', text: '周日' },
          ],
          columns: 7,
          iconSize: 18,
          fontSize: 11,
        }, { ...S.card, paddingLeft: 10, paddingRight: 10, paddingTop: 14, paddingBottom: 14 }),
        n('comment', {
          title: '打卡动态',
          rating: '',
          count: '',
          items: [
            { name: '用户 小林', rating: 5, content: '坚持记账第 86 天，终于看清钱都花在哪了。', date: '今天', tags: '记账,自律' },
            { name: '用户 阿泽', rating: 5, content: '早起 21 天，早上多出来的两小时改变了很多。', date: '昨天', tags: '早起,效率' },
          ],
        }, { ...S.card }),
        footer(),
      ]),
      page('my', '我的', '设置', myPage({
        name: '用户 · 小林',
        desc: '已使用 86 天 · 记录 1240 笔',
        stats: [
          { value: '1240', label: '总记录' },
          { value: '86', label: '使用天数' },
          { value: '8', label: '账本' },
          { value: '21', label: '连续打卡' },
        ],
        grid: [
          { icon: 'book', text: '账本管理' },
          { icon: 'sparkles', text: '分类管理' },
          { icon: 'clock', text: '提醒设置' },
          { icon: 'shield', text: '云端同步' },
          { icon: 'edit', text: '数据导出' },
          { icon: 'star', text: '主题皮肤' },
          { icon: 'headset', text: '帮助反馈' },
          { icon: 'gift', text: '邀请好友' },
        ],
        banner: { title: '升级 Pro 版', sub: '解锁多账本与数据导出', buttonText: '了解详情' },
        rows: [
          { icon: 'shield', label: '数据备份', value: '已开启' },
          { icon: 'clock', label: '每日提醒', value: '21:00' },
          { icon: 'headset', label: '意见反馈', value: '期待你的建议' },
        ],
      })),
    ],
  }),
}

export const PART_B: TemplateDef[] = [gym, service, market, portfolio, auto, group, tool]
