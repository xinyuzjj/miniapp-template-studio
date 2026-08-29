/**
 * 小程序通用渲染器
 *
 * 导出方案：把页面 schema 编译成数据，页面 WXML 通过递归 template 渲染。
 * 好处是任意组合的组件树都能被渲染，且生成的代码可读、可二次修改。
 */

/** 图片：有网络地址用 image，否则用渐变占位 */
const IMG = (cls: string, expr: string, style = '') =>
  `<image wx:if="{{${expr}.image}}" src="{{${expr}.image}}" mode="aspectFill" class="${cls}"${style ? ` style="${style}"` : ''}/>` +
  `<view wx:else class="${cls}" style="background:linear-gradient(135deg,{{${expr}._g1}},{{${expr}._g2}});${style}"></view>`

/** 动态图标名（来自数据） */
const ICON = (name: string, size: number | string, prefix = 'p') =>
  `<image src="/images/icons/${prefix}_{{${name}}}.png" class="mp-ic" style="width:${size}rpx;height:${size}rpx"/>`

/** 静态图标名（写死路径，兼容性最好） */
const IC = (name: string, size: number | string, prefix = 'p') =>
  `<image src="/images/icons/${prefix}_${name}.png" class="mp-ic" style="width:${size}rpx;height:${size}rpx"/>`

export const RENDER_WXML = `<template name="mp-node">

  <!-- ============ 基础 ============ -->
  <view wx:if="{{node.type === 'view'}}" style="{{node._s}}">
    <view class="mp-flex {{node.props.direction === 'row' ? 'mp-row' : 'mp-col'}}" style="gap:{{node.props.gap * 2}}rpx;align-items:{{node.props.direction === 'row' ? (node.props.align === 'stretch' ? 'stretch' : node.props.align) : 'stretch'}}">
      <view wx:if="{{!node.children || node.children.length === 0}}" class="mp-empty">空容器</view>
      <block wx:for="{{node.children}}" wx:for-item="child" wx:key="id">
        <template is="mp-node" data="{{node: child, T: T}}"/>
      </block>
    </view>
  </view>

  <view wx:elif="{{node.type === 'title'}}" class="mp-title" style="{{node._s}}">
    <view class="mp-title-main" style="text-align:{{node.props.align === 'center' ? 'center' : 'left'}}">
      <view class="mp-title-1" style="font-size:{{node.props.size * 2}}rpx;color:{{node.props.color || T.text}}">{{node.props.content}}</view>
      <view wx:if="{{node.props.sub}}" class="mp-title-2" style="color:{{node.props.subColor || T.subText}}">{{node.props.sub}}</view>
    </view>
    <view wx:if="{{node.props.more}}" class="mp-title-more" style="color:{{T.subText}}">
      <text>{{node.props.moreText}}</text>
      ${IC('chevronRight', 24, 's')}
    </view>
  </view>

  <view wx:elif="{{node.type === 'text'}}" style="{{node._s}}">
    <view class="mp-text" style="font-size:{{node.props.size * 2}}rpx;color:{{node.props.color || T.subText}};font-weight:{{node.props.weight}};text-align:{{node.props.align}};line-height:{{node.props.lineHeight}}">{{node.props.content}}</view>
  </view>

  <view wx:elif="{{node.type === 'image'}}" style="{{node._s}}">
    ${IMG('mp-img', 'node.props', `width:100%;height:{{node.props.height * 2}}rpx;border-radius:{{node.props.radius * 2}}rpx`)}
    <view wx:if="{{node.props.caption}}" class="mp-caption" style="color:{{T.subText}}">{{node.props.caption}}</view>
  </view>

  <view wx:elif="{{node.type === 'video'}}" style="{{node._s}}">
    <video wx:if="{{node.props.src}}" src="{{node.props.src}}" poster="{{node.props.poster}}" controls="{{node.props.controls !== false}}" autoplay="{{node.props.autoplay}}" style="width:100%;height:{{node.props.height * 2}}rpx;border-radius:{{node.props.radius * 2}}rpx"></video>
    <view wx:else class="mp-video" style="height:{{node.props.height * 2}}rpx;border-radius:{{node.props.radius * 2}}rpx;background:linear-gradient(135deg,{{node._g1}},{{node._g2}})">
      ${IC('play', 52, 'w')}
    </view>
  </view>

  <view wx:elif="{{node.type === 'divider'}}" style="{{node._s}}">
    <view style="height:0;border-top:{{node.props.height}}px {{node.props.dashed ? 'dashed' : 'solid'}} {{node.props.color}}"></view>
  </view>

  <view wx:elif="{{node.type === 'blank'}}" style="{{node._s}};height:{{node.props.height * 2}}rpx"></view>

  <!-- ============ 导航 ============ -->
  <view wx:elif="{{node.type === 'search'}}" style="{{node._s}}">
    <view class="mp-search" style="height:76rpx;border-radius:{{node.props.radius * 2}}rpx;background:{{node.props.background}};justify-content:{{node.props.align === 'center' ? 'center' : 'flex-start'}}">
      ${IC('search', 30, 's')}
      <text class="mp-search-ph">{{node.props.placeholder}}</text>
    </view>
  </view>

  <view wx:elif="{{node.type === 'notice'}}" style="{{node._s}}">
    <view class="mp-notice" style="background:{{node.props.background}}">
      ${ICON('node.props.icon', 30)}
      <text class="mp-notice-tx" style="color:{{node.props.color}}">{{node.props.text}}</text>
      ${IC('chevronRight', 26)}
    </view>
  </view>

  <view wx:elif="{{node.type === 'swiper'}}" style="{{node._s}}">
    <swiper class="mp-swiper" style="height:{{node.props.height * 2}}rpx;border-radius:{{node.props.radius * 2}}rpx" autoplay="{{node.props.autoplay}}" circular="{{true}}" indicator-dots="{{node.props.indicator === 'dot'}}" indicator-color="rgba(255,255,255,.55)" indicator-active-color="#ffffff">
      <swiper-item wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i">
        <view class="mp-swiper-item" style="border-radius:{{node.props.radius * 2}}rpx">
          ${IMG('mp-swiper-img', 'it', `height:{{node.props.height * 2}}rpx`)}
          <view class="mp-swiper-mask"></view>
          <view class="mp-swiper-txt">
            <view class="mp-swiper-t1">{{it.title}}</view>
            <view wx:if="{{it.desc}}" class="mp-swiper-t2">{{it.desc}}</view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>

  <view wx:elif="{{node.type === 'grid'}}" style="{{node._s}}">
    <view class="mp-grid">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-grid-item" style="width:{{100 / node.props.columns}}%">
        <view class="mp-grid-ic" style="background:{{node.props.iconBg || T.primaryLight}};width:92rpx;height:92rpx;border-radius:28rpx">
          ${ICON('it.icon', 'node.props.iconSize * 2')}
          <view wx:if="{{it.badge}}" class="mp-grid-badge" style="background:{{T.secondary}}">{{it.badge}}</view>
        </view>
        <view class="mp-grid-tx" style="color:{{T.text}};font-size:{{node.props.fontSize * 2}}rpx">{{it.text}}</view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'tabs'}}" style="{{node._s}};background:{{node.props.background}}">
    <scroll-view scroll-x class="mp-tabs">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-tab {{index === node.props.active ? 'on' : ''}}">
        <text style="color:{{index === node.props.active ? (node.props.activeColor || T.primary) : T.subText}};font-weight:{{index === node.props.active ? 600 : 400}}">{{it.text}}</text>
        <view wx:if="{{index === node.props.active}}" class="mp-tab-line" style="background:{{node.props.activeColor || T.primary}}"></view>
      </view>
    </scroll-view>
  </view>

  <view wx:elif="{{node.type === 'floatBtn'}}" class="mp-fab mp-fab-{{node.props.position}}" style="{{node._s}}">
    <view class="mp-fab-btn" style="background:{{node.props.bg || T.primary}}" bindtap="onFab" data-action="{{node.props.action}}" data-phone="{{node.props.phone}}">
      ${ICON('node.props.icon', 36, 'w')}
      <text wx:if="{{node.props.text}}" class="mp-fab-tx">{{node.props.text}}</text>
    </view>
  </view>

  <!-- ============ 营销 ============ -->
  <view wx:elif="{{node.type === 'coupon'}}" style="{{node._s}}">
    <scroll-view scroll-x class="mp-coupons">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-coupon" style="background:{{node.props.background}};border-color:{{T._sec25}}">
        <view class="mp-cp-l" style="border-right-color:{{T._sec35}}">
          <view class="mp-cp-amt" style="color:{{T.secondary}}"><text class="mp-cp-y">¥</text>{{it.amount}}</view>
          <view class="mp-cp-cond" style="color:{{T.subText}}">{{it.condition}}</view>
        </view>
        <view class="mp-cp-m">
          <view class="mp-cp-name" style="color:{{T.text}}">{{it.name}}</view>
          <view class="mp-cp-exp" style="color:{{T.subText}}">有效期至 2026.12.31</view>
        </view>
        <view class="mp-cp-btn" style="background:{{T.secondary}}">{{it.tag}}</view>
      </view>
    </scroll-view>
  </view>

  <view wx:elif="{{node.type === 'seckill'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view class="mp-sk-head">
      <view class="mp-sk-title" style="color:{{T.text}}">{{node.props.title}}</view>
      <view class="mp-sk-time" style="color:{{T.subText}}">
        ${IC('clock', 24, 's')}
        <text>{{node.props.sub}}</text>
      </view>
    </view>
    <scroll-view scroll-x class="mp-sk-list">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-sk-item">
        ${IMG('mp-sk-img', 'it')}
        <view class="mp-sk-name" style="color:{{T.text}}">{{it.name}}</view>
        <view class="mp-sk-price">
          <text class="mp-sk-p1" style="color:{{T.secondary}}">¥{{it.price}}</text>
          <text class="mp-sk-p2">¥{{it.origin}}</text>
        </view>
      </view>
    </scroll-view>
  </view>

  <view wx:elif="{{node.type === 'banner'}}" style="{{node._s}}">
    <view class="mp-banner" style="border-radius:{{(node._r || 12) * 2}}rpx">
      ${IMG('mp-banner-bg', 'node.props')}
      <view class="mp-banner-mask"></view>
      <view class="mp-banner-txt">
        <view class="mp-banner-t1">{{node.props.title}}</view>
        <view class="mp-banner-t2">{{node.props.sub}}</view>
        <view wx:if="{{node.props.buttonText}}" class="mp-banner-btn">{{node.props.buttonText}}</view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'countdown'}}" style="{{node._s}}">
    <view class="mp-cd" style="background:linear-gradient(120deg,{{T.primary}},{{T._pri72}})">
      <view class="mp-cd-title">{{node.props.title}}</view>
      <view class="mp-cd-box">
        <block wx:if="{{node.props.days}}"><text class="mp-cd-num">{{node.props.days}}</text><text class="mp-cd-lb">天</text></block>
        <block wx:if="{{node.props.hours}}"><text class="mp-cd-num">{{node.props.hours}}</text><text class="mp-cd-lb">时</text></block>
        <block wx:if="{{node.props.minutes}}"><text class="mp-cd-num">{{node.props.minutes}}</text><text class="mp-cd-lb">分</text></block>
        <block wx:if="{{node.props.seconds}}"><text class="mp-cd-num">{{node.props.seconds}}</text><text class="mp-cd-lb">秒</text></block>
      </view>
    </view>
  </view>

  <!-- ============ 交易 ============ -->
  <view wx:elif="{{node.type === 'goods'}}" style="{{node._s}}">
    <!-- 横向滑动 -->
    <scroll-view wx:if="{{node.props.layout === 'row'}}" scroll-x class="mp-g-row">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-g-row-item" style="background:{{T.cardBg}}">
        <view class="mp-g-row-img">
          ${IMG('mp-fill', 'it')}
          <view wx:if="{{it.tag}}" class="mp-g-tag" style="background:{{T.secondary}}">{{it.tag}}</view>
        </view>
        <view class="mp-g-row-body">
          <view class="mp-g-name" style="color:{{T.text}}">{{it.name}}</view>
          <view class="mp-g-desc" style="color:{{T.subText}}">{{it.desc}}</view>
          <view wx:if="{{node.props.showPrice !== false}}" class="mp-g-price">
            <text class="mp-g-p1" style="color:{{T.secondary}}">¥{{it.price}}</text>
            <text wx:if="{{it.origin}}" class="mp-g-p2">¥{{it.origin}}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 纵向列表 -->
    <view wx:elif="{{node.props.layout === 'list'}}" class="mp-g-list" style="background:{{T.cardBg}}">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-g-list-item">
        <view class="mp-g-list-img">
          ${IMG('mp-fill', 'it')}
        </view>
        <view class="mp-g-list-body">
          <view class="mp-g-name" style="color:{{T.text}}">{{it.name}}</view>
          <view class="mp-g-desc" style="color:{{T.subText}}">{{it.desc}}</view>
          <view class="mp-g-list-foot">
            <text wx:if="{{node.props.showPrice !== false}}" class="mp-g-p1" style="color:{{T.secondary}}">¥{{it.price}}</text>
            <text class="mp-g-sales" style="color:{{T.subText}}">{{it.sales}} 人已选</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 网格 -->
    <view wx:else class="mp-g-grid">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-g-grid-item" style="width:{{(100 - (node.props.columns - 1) * 2) / node.props.columns}}%;background:{{T.cardBg}}">
        <view class="mp-g-grid-img">
          ${IMG('mp-fill', 'it')}
          <view wx:if="{{it.tag}}" class="mp-g-tag" style="background:{{T.secondary}}">{{it.tag}}</view>
        </view>
        <view class="mp-g-grid-body">
          <view class="mp-g-name" style="color:{{T.text}}">{{it.name}}</view>
          <view class="mp-g-desc" style="color:{{T.subText}}">{{it.desc}}</view>
          <view class="mp-g-price">
            <text wx:if="{{node.props.showPrice !== false}}" class="mp-g-p1" style="color:{{T.secondary}}">¥{{it.price}}</text>
            <text class="mp-g-sales" style="color:{{T.subText}}">{{it.sales}} 已售</text>
          </view>
        </view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'shop'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view class="mp-shop">
      <view class="mp-shop-top">
        <view class="mp-shop-logo">
          ${IMG('mp-fill', 'node.props', 'border-radius:20rpx')}
          <view wx:if="{{!node.props.logo}}" class="mp-shop-logo-ic">${IC('pin', 44, 'w')}</view>
        </view>
        <view class="mp-shop-info">
          <view class="mp-shop-name" style="color:{{T.text}}">{{node.props.name}}</view>
          <view class="mp-shop-rate">
            <block wx:for="{{[1,2,3,4,5]}}" wx:key="*this">${IC('star', 24, 'p')}</block>
            <text class="mp-shop-score" style="color:{{T.secondary}}">{{node.props.rating}}</text>
            <text class="mp-shop-desc" style="color:{{T.subText}}">{{node.props.desc}}</text>
          </view>
          <view class="mp-shop-tags">
            <text wx:for="{{node.props.tags}}" wx:for-item="tg" wx:key="*this" class="mp-shop-tag" style="color:{{T.primary}};background:{{T.primaryLight}}">{{tg}}</text>
          </view>
        </view>
      </view>
      <view class="mp-shop-line"></view>
      <view class="mp-shop-row">
        ${IC('pin', 28, 's')}
        <text class="mp-shop-addr" style="color:{{T.subText}}">{{node.props.address}}</text>
      </view>
      <view class="mp-shop-row">
        ${IC('clock', 28, 's')}
        <text class="mp-shop-addr" style="color:{{T.subText}}">营业时间 {{node.props.hours}}</text>
        <text class="mp-shop-phone" style="color:{{T.primary}}">${IC('phone', 26)} {{node.props.phone}}</text>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'cartBar'}}" style="{{node._s}}">
    <view class="mp-cart {{node.props.fixed === false ? '' : 'mp-cart-fixed'}}">
      <view class="mp-cart-ic">
        ${IC('cart', 48)}
        <view wx:if="{{node.props.count}}" class="mp-cart-badge" style="background:{{T.secondary}}">{{node.props.count}}</view>
      </view>
      <view class="mp-cart-mid">
        <view class="mp-cart-total" style="color:{{T.text}}">{{node.props.total}}<text wx:if="{{node.props.tip}}" class="mp-cart-tip" style="color:{{T.secondary}}">{{node.props.tip}}</text></view>
      </view>
      <view class="mp-cart-btn" style="background:{{T.primary}}">{{node.props.buttonText}}</view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'priceCard'}}" style="{{node._s}}">
    <view class="mp-pcards">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-pcard {{it.highlight ? 'on' : ''}}" style="border-color:{{it.highlight ? T.primary : '#eef0f4'}};background:{{it.highlight ? T._pri08 : T.cardBg}}">
        <view wx:if="{{it.highlight}}" class="mp-pcard-hot" style="background:{{T.primary}}">最受欢迎</view>
        <view class="mp-pcard-name" style="color:{{it.highlight ? T.primary : T.subText}}">{{it.name}}</view>
        <view class="mp-pcard-price" style="color:{{T.text}}"><text class="mp-pcard-y">¥</text><text class="mp-pcard-v">{{it.price}}</text><text class="mp-pcard-per" style="color:{{T.subText}}">{{it.period}}</text></view>
        <view class="mp-pcard-list">
          <view wx:for="{{it._features}}" wx:for-item="ft" wx:key="*this" class="mp-pcard-row">
            ${IC('check', 22)}
            <text class="mp-pcard-ft" style="color:{{T.subText}}">{{ft}}</text>
          </view>
        </view>
        <view class="mp-pcard-btn" style="background:{{it.highlight ? T.primary : T._pri08}};color:{{it.highlight ? '#ffffff' : T.primary}}">{{it.btnText}}</view>
      </view>
    </view>
  </view>

  <!-- ============ 内容 ============ -->
  <view wx:elif="{{node.type === 'richText'}}" style="{{node._s}};background:{{node.props.background}};border-radius:{{node.props.radius * 2}}rpx">
    <rich-text class="mp-rich" nodes="{{node.props.html}}"></rich-text>
  </view>

  <view wx:elif="{{node.type === 'article'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view class="mp-articles">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-article">
        <view class="mp-article-body">
          <view class="mp-article-title" style="color:{{T.text}}">{{it.title}}</view>
          <view class="mp-article-desc" style="color:{{T.subText}}">{{it.desc}}</view>
          <view class="mp-article-meta" style="color:{{T.subText}}">
            <text>{{it.author}}</text><text class="mp-dot">·</text><text>{{it.date}}</text><text class="mp-dot">·</text><text>{{it.views}} 阅读</text>
          </view>
        </view>
        <view class="mp-article-img">${IMG('mp-fill', 'it')}</view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'comment'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view class="mp-cm">
      <view class="mp-cm-head">
        <view class="mp-cm-title" style="color:{{T.text}}">{{node.props.title}}<text class="mp-cm-count" style="color:{{T.subText}}">({{node.props.count}})</text></view>
        <view class="mp-cm-rate">
          <block wx:for="{{[1,2,3,4,5]}}" wx:key="*this">${IC('star', 22)}</block>
          <text class="mp-cm-score" style="color:{{T.secondary}}">{{node.props.rating}}</text>
        </view>
      </view>
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-cm-item">
        <view class="mp-cm-top">
          <view class="mp-cm-av">${IMG('mp-fill', 'it')}<text wx:if="{{!it.avatar}}" class="mp-cm-av-tx">{{it._initial}}</text></view>
          <view class="mp-cm-name" style="color:{{T.text}}">{{it.name}}</view>
          <view class="mp-cm-stars">
            <block wx:for="{{it._stars}}" wx:key="*this">${IC('star', 22)}</block>
          </view>
        </view>
        <view class="mp-cm-content">{{it.content}}</view>
        <view class="mp-cm-foot">
          <text wx:for="{{it._tags}}" wx:for-item="tg" wx:key="*this" class="mp-cm-tag" style="color:{{T.subText}};background:{{T._grayBg}}">{{tg}}</text>
          <text class="mp-cm-date" style="color:{{T.subText}}">{{it.date}}</text>
        </view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'team'}}" style="{{node._s}}">
    <view class="mp-team">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-team-item" style="background:{{T.cardBg}}">
        <view class="mp-team-av">${IMG('mp-fill', 'it')}<text wx:if="{{!it.avatar}}" class="mp-team-av-tx">{{it._initial}}</text></view>
        <view class="mp-team-body">
          <view class="mp-team-hd">
            <text class="mp-team-name" style="color:{{T.text}}">{{it.name}}</text>
            <text class="mp-team-title" style="color:{{T.primary}};background:{{T.primaryLight}}">{{it.title}}</text>
          </view>
          <view class="mp-team-desc" style="color:{{T.subText}}">{{it.desc}}</view>
          <view class="mp-team-tags">
            <text wx:for="{{it._tags}}" wx:for-item="tg" wx:key="*this" class="mp-team-tag" style="color:{{T.subText}};border-color:#eef0f4">{{tg}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'faq'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view class="mp-faq">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-faq-item">
        <view class="mp-faq-q">
          <text class="mp-faq-badge" style="color:{{T.primary}};background:{{T._pri12}}">Q</text>
          <text class="mp-faq-qt" style="color:{{T.text}}">{{it.q}}</text>
        </view>
        <view wx:if="{{index === 0}}" class="mp-faq-a" style="color:{{T.subText}}">{{it.a}}</view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'steps'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view wx:if="{{node.props.direction === 'column'}}" class="mp-steps-col">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-step-col">
        <view wx:if="{{index < node.props.items.length - 1}}" class="mp-step-line"></view>
        <view class="mp-step-ic" style="background:{{T._pri12}}">${ICON('it.icon', 26)}</view>
        <view class="mp-step-body">
          <view class="mp-step-t" style="color:{{T.text}}">{{it.title}}</view>
          <view class="mp-step-d" style="color:{{T.subText}}">{{it.desc}}</view>
        </view>
      </view>
    </view>
    <view wx:else class="mp-steps-row">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-step-row">
        <view wx:if="{{index > 0}}" class="mp-step-hl"></view>
        <view wx:if="{{index < node.props.items.length - 1}}" class="mp-step-hr"></view>
        <view class="mp-step-ic" style="background:{{T._pri12}}">${ICON('it.icon', 30)}</view>
        <view class="mp-step-rt" style="color:{{T.text}}">{{it.title}}</view>
        <view class="mp-step-rd" style="color:{{T.subText}}">{{it.desc}}</view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'stats'}}" style="{{node._s}}">
    <view class="mp-stats" style="background:{{node.props.background || T._priGrad}};border-radius:{{(node._r || 12) * 2}}rpx">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-stat">
        <view class="mp-stat-v">{{it.value}}</view>
        <view class="mp-stat-l">{{it.label}}</view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'timeline'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view class="mp-tl">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-tl-item">
        <view wx:if="{{index < node.props.items.length - 1}}" class="mp-tl-line"></view>
        <view class="mp-tl-dot" style="background:{{index === 0 ? T.primary : '#dfe3ea'}}"></view>
        <view class="mp-tl-body">
          <view class="mp-tl-time" style="color:{{T.primary}}">{{it.time}}</view>
          <view class="mp-tl-title" style="color:{{T.text}}">{{it.title}}</view>
          <view class="mp-tl-desc" style="color:{{T.subText}}">{{it.desc}}</view>
        </view>
      </view>
    </view>
  </view>

  <!-- ============ 表单 ============ -->
  <view wx:elif="{{node.type === 'form'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view class="mp-form">
      <view wx:if="{{node.props.title}}" class="mp-form-title" style="color:{{T.text}}">{{node.props.title}}</view>
      <view wx:for="{{node.props.fields}}" wx:for-item="fld" wx:key="_i" class="mp-field">
        <view class="mp-field-lb" style="color:{{T.subText}}">
          <text wx:if="{{fld.required}}" class="mp-req" style="color:{{T.secondary}}">*</text>{{fld.label}}
        </view>
        <input wx:if="{{fld.type === 'text' || fld.type === 'phone'}}" class="mp-input" type="{{fld.type === 'phone' ? 'number' : 'text'}}" placeholder="{{fld.placeholder}}" placeholder-class="mp-ph" maxlength="{{fld.type === 'phone' ? 11 : -1}}" bindinput="onInput" data-i="{{index}}"/>
        <textarea wx:elif="{{fld.type === 'textarea'}}" class="mp-input mp-textarea" placeholder="{{fld.placeholder}}" placeholder-class="mp-ph" bindinput="onInput" data-i="{{index}}"/>
        <picker wx:elif="{{fld.type === 'date'}}" mode="date" bindchange="onDate" data-i="{{index}}">
          <view class="mp-input mp-picker">{{fld.placeholder}}</view>
        </picker>
        <picker wx:elif="{{fld.type === 'picker'}}" range="{{['选项一','选项二','选项三']}}" bindchange="onPick" data-i="{{index}}">
          <view class="mp-input mp-picker">{{fld.placeholder}}</view>
        </picker>
      </view>
      <view class="mp-submit" style="background:{{T.primary}}" bindtap="onSubmit">{{node.props.submitText}}</view>
      <view wx:if="{{node.props.tip}}" class="mp-form-tip" style="color:{{T.subText}}">{{node.props.tip}}</view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'map'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view class="mp-map">
      <view class="mp-map-bg" style="background:{{node._mapBg}}">
        <view class="mp-map-marker">
          <view class="mp-map-bubble">{{node.props.title}}</view>
          ${IC('pin', 52, 'p')}
        </view>
      </view>
      <view class="mp-map-foot">
        <view class="mp-map-info">
          <view class="mp-map-title" style="color:{{T.text}}">{{node.props.title}}</view>
          <view class="mp-map-addr" style="color:{{T.subText}}">{{node.props.address}}</view>
        </view>
        <text class="mp-map-dist" style="color:{{T.subText}}">{{node.props.distance}}</text>
        <view class="mp-map-btn" style="background:{{T.primary}}" bindtap="onNavigate" data-lat="{{node.props.lat}}" data-lng="{{node.props.lng}}" data-name="{{node.props.title}}" data-addr="{{node.props.address}}">{{node.props.buttonText}}</view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'contact'}}" style="{{node._s}};background:{{T.cardBg}}">
    <view class="mp-contact">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-ct-item" bindtap="onContact" data-v="{{it.value}}" data-a="{{it.action}}">
        <view class="mp-ct-ic" style="background:{{T._pri12}}">${ICON('it.icon', 30)}</view>
        <view class="mp-ct-body">
          <view class="mp-ct-lb" style="color:{{T.subText}}">{{it.label}}</view>
          <view class="mp-ct-v" style="color:{{T.text}}">{{it.value}}</view>
        </view>
        <view wx:if="{{it.action}}" class="mp-ct-act" style="color:{{T.primary}};border-color:{{T._pri30}}">{{it.action}}</view>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'serviceBar'}}" style="{{node._s}}">
    <view class="mp-service">
      <view wx:for="{{node.props.items}}" wx:for-item="it" wx:key="_i" class="mp-service-item">
        ${ICON('it.icon', 26)}
        <text class="mp-service-tx" style="color:{{T.subText}}">{{it.text}}</text>
      </view>
    </view>
  </view>

  <view wx:elif="{{node.type === 'footer'}}" style="{{node._s}}">
    <view class="mp-footer">
      <view class="mp-footer-1" style="color:{{T.subText}}">{{node.props.text}}</view>
      <view wx:if="{{node.props.links}}" class="mp-footer-2">{{node.props.links}}</view>
    </view>
  </view>

  <view wx:else style="{{node._s}}">
    <view class="mp-empty">未知组件 {{node.type}}</view>
  </view>

</template>
`

export const RENDER_WXSS = `/* ============ 通用 ============ */
.mp-ic { display: block; }
.mp-fill { width: 100%; height: 100%; display: block; }
.mp-empty { border: 1rpx dashed #d5d9e2; border-radius: 20rpx; padding: 36rpx 0; text-align: center; color: #a6aebd; font-size: 24rpx; width: 100%; }
.mp-flex { display: flex; }
.mp-row { flex-direction: row; }
.mp-col { flex-direction: column; }
.mp-dot { margin: 0 6rpx; }

/* ============ 基础 ============ */
.mp-title { display: flex; align-items: flex-start; justify-content: space-between; }
.mp-title-main { flex: 1; }
.mp-title-1 { font-weight: 700; letter-spacing: 0.4rpx; line-height: 1.35; }
.mp-title-2 { font-size: 24rpx; margin-top: 8rpx; }
.mp-title-more { font-size: 24rpx; display: flex; align-items: center; gap: 4rpx; flex-shrink: 0; }
.mp-text { white-space: pre-wrap; word-break: break-all; }
.mp-img { width: 100%; display: block; }
.mp-caption { font-size: 24rpx; text-align: center; margin-top: 12rpx; }
.mp-video { width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.mp-video .mp-ic { opacity: .92; }

/* ============ 导航 ============ */
.mp-search { display: flex; align-items: center; gap: 12rpx; padding: 0 28rpx; }
.mp-search-ph { font-size: 26rpx; color: #9aa3b2; }
.mp-notice { display: flex; align-items: center; gap: 12rpx; padding: 18rpx 24rpx; border-radius: 20rpx; }
.mp-notice-tx { flex: 1; font-size: 24rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mp-swiper { width: 100%; overflow: hidden; }
.mp-swiper-item { position: relative; width: 100%; overflow: hidden; }
.mp-swiper-img { width: 100%; display: block; }
.mp-swiper-mask { position: absolute; left: 0; right: 0; bottom: 0; height: 55%; background: linear-gradient(0deg, rgba(0,0,0,.42), rgba(0,0,0,0)); }
.mp-swiper-txt { position: absolute; left: 32rpx; bottom: 28rpx; max-width: 78%; }
.mp-swiper-t1 { color: #fff; font-size: 34rpx; font-weight: 700; text-shadow: 0 1rpx 6rpx rgba(0,0,0,.25); }
.mp-swiper-t2 { color: rgba(255,255,255,.9); font-size: 22rpx; margin-top: 8rpx; }
.mp-grid { display: flex; flex-wrap: wrap; }
.mp-grid-item { display: flex; flex-direction: column; align-items: center; gap: 12rpx; padding: 8rpx 0 14rpx; }
.mp-grid-ic { display: flex; align-items: center; justify-content: center; position: relative; }
.mp-grid-badge { position: absolute; top: -8rpx; right: -12rpx; color: #fff; font-size: 18rpx; padding: 2rpx 8rpx; border-radius: 16rpx; line-height: 1.4; }
.mp-grid-tx { text-align: center; line-height: 1.3; padding: 0 6rpx; }
.mp-tabs { white-space: nowrap; width: 100%; box-sizing: border-box; padding: 12rpx 28rpx; }
.mp-tab { display: inline-block; position: relative; padding: 0 18rpx 12rpx; font-size: 28rpx; }
.mp-tab.on { font-size: 30rpx; }
.mp-tab-line { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 40rpx; height: 6rpx; border-radius: 3rpx; }
.mp-fab { position: fixed; z-index: 60; }
.mp-fab-br { right: 26rpx; bottom: calc(48rpx + env(safe-area-inset-bottom)); }
.mp-fab-bl { left: 26rpx; bottom: calc(48rpx + env(safe-area-inset-bottom)); }
.mp-fab-tr { right: 26rpx; top: 44rpx; }
.mp-fab-tl { left: 26rpx; top: 44rpx; }
.mp-fab-btn { display: inline-flex; align-items: center; gap: 8rpx; padding: 18rpx 30rpx; border-radius: 999rpx; color: #fff; font-size: 26rpx; font-weight: 600; box-shadow: 0 6rpx 18rpx rgba(16,24,40,.22); }
.mp-fab-tx { font-size: 26rpx; }

/* ============ 营销 ============ */
.mp-coupons { white-space: nowrap; width: 100%; }
.mp-coupon { display: inline-flex; align-items: center; min-width: 336rpx; border-radius: 20rpx; overflow: hidden; border: 1rpx solid; margin-right: 16rpx; }
.mp-cp-l { padding: 20rpx 24rpx; text-align: center; border-right: 1rpx dashed; }
.mp-cp-amt { font-weight: 700; font-size: 40rpx; line-height: 1.1; }
.mp-cp-y { font-size: 22rpx; }
.mp-cp-cond { font-size: 20rpx; margin-top: 4rpx; }
.mp-cp-m { flex: 1; padding: 16rpx 20rpx; }
.mp-cp-name { font-size: 26rpx; font-weight: 600; }
.mp-cp-exp { font-size: 22rpx; margin-top: 6rpx; }
.mp-cp-btn { color: #fff; font-size: 22rpx; padding: 10rpx 18rpx; border-radius: 40rpx; margin-right: 16rpx; white-space: nowrap; }
.mp-sk-head { display: flex; align-items: center; justify-content: space-between; padding: 0 28rpx 20rpx; }
.mp-sk-title { font-size: 32rpx; font-weight: 700; display: flex; align-items: center; gap: 8rpx; }
.mp-sk-time { font-size: 24rpx; display: flex; align-items: center; gap: 8rpx; }
.mp-sk-list { white-space: nowrap; width: 100%; box-sizing: border-box; padding: 0 28rpx 8rpx; }
.mp-sk-item { display: inline-block; width: 192rpx; margin-right: 20rpx; vertical-align: top; }
.mp-sk-img { width: 192rpx; height: 192rpx; border-radius: 16rpx; }
.mp-sk-name { font-size: 24rpx; margin-top: 10rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mp-sk-price { display: flex; align-items: baseline; gap: 8rpx; margin-top: 4rpx; }
.mp-sk-p1 { font-weight: 700; font-size: 28rpx; }
.mp-sk-p2 { font-size: 20rpx; color: #b9c0cc; text-decoration: line-through; }
.mp-banner { position: relative; height: 208rpx; overflow: hidden; }
.mp-banner-bg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.mp-banner-mask { position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: linear-gradient(90deg, rgba(0,0,0,.45), rgba(0,0,0,0)); }
.mp-banner-txt { position: absolute; left: 32rpx; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; gap: 12rpx; }
.mp-banner-t1 { color: #fff; font-size: 34rpx; font-weight: 700; }
.mp-banner-t2 { color: rgba(255,255,255,.85); font-size: 24rpx; }
.mp-banner-btn { align-self: flex-start; background: #fff; color: #e0553a; font-size: 22rpx; font-weight: 600; padding: 10rpx 24rpx; border-radius: 40rpx; }
.mp-cd { margin: 0 28rpx; border-radius: 24rpx; padding: 24rpx 28rpx; display: flex; align-items: center; justify-content: space-between; }
.mp-cd-title { color: #fff; font-size: 30rpx; font-weight: 600; flex: 1; }
.mp-cd-box { display: flex; align-items: center; gap: 6rpx; flex-shrink: 0; }
.mp-cd-num { background: rgba(255,255,255,.22); color: #fff; font-size: 24rpx; font-weight: 700; padding: 6rpx 12rpx; border-radius: 8rpx; min-width: 48rpx; text-align: center; }
.mp-cd-lb { color: rgba(255,255,255,.8); font-size: 22rpx; }

/* ============ 交易 ============ */
.mp-g-row { white-space: nowrap; width: 100%; box-sizing: border-box; padding: 8rpx 24rpx; }
.mp-g-row-item { display: inline-block; width: 264rpx; margin-right: 20rpx; border-radius: 24rpx; overflow: hidden; vertical-align: top; }
.mp-g-row-img { position: relative; width: 264rpx; height: 264rpx; }
.mp-g-row-body { padding: 14rpx 16rpx 18rpx; }
.mp-g-name { font-size: 26rpx; font-weight: 500; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mp-g-desc { font-size: 20rpx; margin-top: 6rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mp-g-price { display: flex; align-items: baseline; gap: 8rpx; margin-top: 8rpx; }
.mp-g-p1 { font-weight: 700; font-size: 28rpx; }
.mp-g-p2 { font-size: 20rpx; color: #b9c0cc; text-decoration: line-through; }
.mp-g-tag { position: absolute; left: 12rpx; top: 12rpx; color: #fff; font-size: 20rpx; padding: 4rpx 12rpx; border-radius: 8rpx; }
.mp-g-list { border-radius: 24rpx; overflow: hidden; }
.mp-g-list-item { display: flex; gap: 20rpx; padding: 20rpx; border-bottom: 1rpx solid #f2f4f7; }
.mp-g-list-item:last-child { border-bottom: none; }
.mp-g-list-img { width: 172rpx; height: 172rpx; border-radius: 16rpx; overflow: hidden; flex-shrink: 0; }
.mp-g-list-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.mp-g-list-foot { display: flex; align-items: baseline; justify-content: space-between; margin-top: auto; }
.mp-g-sales { font-size: 20rpx; color: #b0b8c9; }
.mp-g-grid { display: flex; flex-wrap: wrap; gap: 20rpx; padding: 8rpx 4rpx; }
.mp-g-grid-item { border-radius: 24rpx; overflow: hidden; box-shadow: 0 1rpx 8rpx rgba(16,24,40,.04); }
.mp-g-grid-img { position: relative; width: 100%; height: 0; padding-bottom: 100%; }
.mp-g-grid-img .mp-fill { position: absolute; left: 0; top: 0; }
.mp-g-grid-body { padding: 16rpx 18rpx 20rpx; }
.mp-g-grid-body .mp-g-name { height: 72rpx; line-height: 1.4; overflow: hidden; white-space: normal; }
.mp-shop { padding: 28rpx; }
.mp-shop-top { display: flex; gap: 24rpx; }
.mp-shop-logo { position: relative; width: 116rpx; height: 116rpx; border-radius: 20rpx; overflow: hidden; flex-shrink: 0; }
.mp-shop-logo-ic { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.mp-shop-info { flex: 1; min-width: 0; }
.mp-shop-name { font-size: 32rpx; font-weight: 700; }
.mp-shop-rate { display: flex; align-items: center; gap: 10rpx; margin-top: 10rpx; }
.mp-shop-score { font-size: 24rpx; font-weight: 600; }
.mp-shop-desc { font-size: 22rpx; }
.mp-shop-tags { display: flex; gap: 10rpx; margin-top: 14rpx; flex-wrap: wrap; }
.mp-shop-tag { font-size: 20rpx; padding: 4rpx 14rpx; border-radius: 8rpx; }
.mp-shop-line { height: 1rpx; background: #f0f2f6; margin: 24rpx 0; }
.mp-shop-row { display: flex; align-items: center; gap: 16rpx; margin-top: 14rpx; }
.mp-shop-addr { flex: 1; font-size: 24rpx; line-height: 1.6; }
.mp-shop-phone { font-size: 24rpx; display: flex; align-items: center; gap: 6rpx; flex-shrink: 0; }
.mp-cart { display: flex; align-items: center; gap: 20rpx; padding: 18rpx 28rpx; background: #fff; border-top: 1rpx solid #eef0f4; box-shadow: 0 -2rpx 24rpx rgba(16,24,40,.06); }
.mp-cart-fixed { position: fixed; left: 0; right: 0; bottom: 0; z-index: 99; padding-bottom: calc(18rpx + env(safe-area-inset-bottom)); }
.mp-cart-ic { position: relative; }
.mp-cart-badge { position: absolute; top: -8rpx; right: -14rpx; color: #fff; font-size: 18rpx; min-width: 30rpx; height: 30rpx; border-radius: 15rpx; display: flex; align-items: center; justify-content: center; padding: 0 6rpx; }
.mp-cart-mid { flex: 1; }
.mp-cart-total { font-size: 30rpx; font-weight: 700; }
.mp-cart-tip { font-size: 20rpx; font-weight: 400; margin-left: 12rpx; }
.mp-cart-btn { color: #fff; font-size: 26rpx; font-weight: 600; padding: 16rpx 44rpx; border-radius: 44rpx; }
.mp-pcards { display: flex; gap: 18rpx; padding: 8rpx 4rpx; }
.mp-pcard { flex: 1; border: 1rpx solid; border-radius: 24rpx; padding: 24rpx 20rpx; position: relative; }
.mp-pcard-hot { position: absolute; top: -18rpx; left: 50%; transform: translateX(-50%); color: #fff; font-size: 20rpx; padding: 4rpx 16rpx; border-radius: 20rpx; white-space: nowrap; }
.mp-pcard-name { font-size: 26rpx; text-align: center; font-weight: 500; }
.mp-pcard-price { text-align: center; margin-top: 16rpx; display: flex; align-items: baseline; justify-content: center; gap: 4rpx; }
.mp-pcard-price .mp-pcard-y { font-size: 26rpx; }
.mp-pcard-v { font-size: 48rpx; font-weight: 700; line-height: 1; }
.mp-pcard-per { font-size: 20rpx; }
.mp-pcard-list { margin-top: 20rpx; display: flex; flex-direction: column; gap: 12rpx; }
.mp-pcard-row { display: flex; align-items: center; gap: 8rpx; }
.mp-pcard-ft { font-size: 22rpx; line-height: 1.4; }
.mp-pcard-btn { margin-top: 24rpx; text-align: center; font-size: 24rpx; font-weight: 600; padding: 14rpx 0; border-radius: 40rpx; }

/* ============ 内容 ============ */
.mp-rich { font-size: 26rpx; line-height: 1.7; color: #5b6472; padding: 24rpx 28rpx; }
.mp-rich image, .mp-rich img { max-width: 100%; border-radius: 12rpx; }
.mp-rich view, .mp-rich text, .mp-rich p, .mp-rich div { line-height: 1.7; }
.mp-rich h1 { font-size: 38rpx; font-weight: 700; color: #1a1d28; margin: 4rpx 0 16rpx; }
.mp-rich h2 { font-size: 34rpx; font-weight: 700; color: #1a1d28; margin: 4rpx 0 14rpx; }
.mp-rich h3 { font-size: 30rpx; font-weight: 600; color: #1a1d28; margin: 4rpx 0 12rpx; }
.mp-rich h4 { font-size: 28rpx; font-weight: 600; color: #1a1d28; margin: 4rpx 0 10rpx; }
.mp-rich p { margin: 0 0 14rpx; }
.mp-rich a { color: #3459f7; }
.mp-rich ul { padding-left: 36rpx; margin: 0 0 14rpx; }
.mp-rich li { margin: 6rpx 0; }
.mp-rich b, .mp-rich strong { font-weight: 700; color: #1a1d28; }
.mp-articles { border-radius: 24rpx; overflow: hidden; }
.mp-article { display: flex; gap: 20rpx; padding: 24rpx; border-bottom: 1rpx solid #f2f4f7; }
.mp-article:last-child { border-bottom: none; }
.mp-article-body { flex: 1; min-width: 0; }
.mp-article-title { font-size: 28rpx; font-weight: 500; line-height: 1.45; }
.mp-article-desc { font-size: 22rpx; margin-top: 10rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mp-article-meta { display: flex; align-items: center; font-size: 20rpx; margin-top: 14rpx; }
.mp-article-img { width: 184rpx; height: 132rpx; border-radius: 16rpx; overflow: hidden; flex-shrink: 0; }
.mp-cm { border-radius: 24rpx; padding: 24rpx 0; }
.mp-cm-head { display: flex; align-items: center; justify-content: space-between; padding: 0 28rpx 20rpx; }
.mp-cm-title { font-size: 30rpx; font-weight: 600; }
.mp-cm-count { font-size: 22rpx; font-weight: 400; margin-left: 12rpx; }
.mp-cm-rate { display: flex; align-items: center; gap: 8rpx; }
.mp-cm-score { font-size: 26rpx; font-weight: 700; }
.mp-cm-item { padding: 20rpx 28rpx; border-top: 1rpx dashed #f2f4f7; }
.mp-cm-top { display: flex; align-items: center; gap: 16rpx; }
.mp-cm-av { position: relative; width: 60rpx; height: 60rpx; border-radius: 30rpx; overflow: hidden; flex-shrink: 0; }
.mp-cm-av-tx { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22rpx; }
.mp-cm-name { flex: 1; font-size: 26rpx; font-weight: 500; }
.mp-cm-stars { display: flex; align-items: center; gap: 2rpx; }
.mp-cm-content { font-size: 24rpx; color: #5b6472; line-height: 1.7; margin-top: 14rpx; }
.mp-cm-foot { display: flex; align-items: center; gap: 12rpx; margin-top: 14rpx; }
.mp-cm-tag { font-size: 20rpx; padding: 4rpx 14rpx; border-radius: 8rpx; }
.mp-cm-date { font-size: 20rpx; color: #b0b8c9; margin-left: auto; }
.mp-team { display: flex; flex-direction: column; gap: 20rpx; }
.mp-team-item { display: flex; gap: 24rpx; border-radius: 24rpx; padding: 24rpx; box-shadow: 0 1rpx 8rpx rgba(16,24,40,.04); }
.mp-team-av { position: relative; width: 124rpx; height: 124rpx; border-radius: 62rpx; overflow: hidden; flex-shrink: 0; }
.mp-team-av-tx { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 40rpx; font-weight: 600; }
.mp-team-body { flex: 1; min-width: 0; }
.mp-team-hd { display: flex; align-items: center; gap: 14rpx; }
.mp-team-name { font-size: 30rpx; font-weight: 600; }
.mp-team-title { font-size: 22rpx; padding: 2rpx 12rpx; border-radius: 8rpx; }
.mp-team-desc { font-size: 22rpx; margin-top: 10rpx; line-height: 1.6; }
.mp-team-tags { display: flex; gap: 10rpx; margin-top: 14rpx; flex-wrap: wrap; }
.mp-team-tag { font-size: 20rpx; padding: 2rpx 12rpx; border-radius: 8rpx; border: 1rpx solid; }
.mp-faq { border-radius: 24rpx; overflow: hidden; }
.mp-faq-item { padding: 24rpx 28rpx; border-bottom: 1rpx solid #f2f4f7; }
.mp-faq-item:last-child { border-bottom: none; }
.mp-faq-q { display: flex; align-items: center; gap: 16rpx; }
.mp-faq-badge { width: 36rpx; height: 36rpx; border-radius: 10rpx; font-size: 22rpx; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.mp-faq-qt { flex: 1; font-size: 26rpx; font-weight: 500; }
.mp-faq-a { font-size: 24rpx; line-height: 1.75; margin-top: 14rpx; padding-left: 52rpx; }
.mp-steps-col { padding: 16rpx 28rpx 24rpx; }
.mp-step-col { display: flex; gap: 20rpx; position: relative; padding-bottom: 28rpx; }
.mp-step-line { position: absolute; left: 24rpx; top: 54rpx; bottom: 0; width: 1rpx; background: #e6e9f0; }
.mp-step-ic { position: relative; z-index: 2; width: 50rpx; height: 50rpx; border-radius: 25rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 2; margin-top: 4rpx; }
.mp-step-body { flex: 1; }
.mp-step-t { font-size: 26rpx; font-weight: 500; }
.mp-step-d { font-size: 22rpx; margin-top: 6rpx; line-height: 1.5; }
.mp-steps-row { display: flex; padding: 12rpx 16rpx 20rpx; }
.mp-step-row { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
.mp-step-hl { position: absolute; top: 30rpx; left: 0; width: 50%; height: 1rpx; background: #e6e9f0; }
.mp-step-hr { position: absolute; top: 30rpx; left: 50%; width: 50%; height: 1rpx; background: #e6e9f0; }
.mp-step-rt { font-size: 24rpx; font-weight: 500; margin-top: 12rpx; text-align: center; }
.mp-step-rd { font-size: 20rpx; margin-top: 6rpx; text-align: center; line-height: 1.4; padding: 0 4rpx; }
.mp-stats { padding: 28rpx 16rpx; display: flex; margin: 0; }
.mp-stat { flex: 1; text-align: center; }
.mp-stat-v { color: #fff; font-size: 40rpx; font-weight: 700; line-height: 1.2; }
.mp-stat-l { color: rgba(255,255,255,.82); font-size: 20rpx; margin-top: 8rpx; }
.mp-tl { border-radius: 24rpx; padding: 24rpx 28rpx; }
.mp-tl-item { display: flex; gap: 24rpx; position: relative; padding-bottom: 32rpx; }
.mp-tl-line { position: absolute; left: 6rpx; top: 24rpx; bottom: 0; width: 1rpx; background: #eef0f4; }
.mp-tl-dot { width: 14rpx; height: 14rpx; border-radius: 8rpx; margin-top: 10rpx; flex-shrink: 0; z-index: 2; }
.mp-tl-body { flex: 1; }
.mp-tl-time { font-size: 20rpx; font-weight: 600; }
.mp-tl-title { font-size: 26rpx; font-weight: 500; margin-top: 6rpx; }
.mp-tl-desc { font-size: 22rpx; margin-top: 6rpx; line-height: 1.6; }

/* ============ 表单 ============ */
.mp-form { border-radius: 24rpx; padding: 28rpx; }
.mp-form-title { font-size: 30rpx; font-weight: 600; margin-bottom: 20rpx; }
.mp-field { margin-bottom: 20rpx; }
.mp-field-lb { font-size: 24rpx; margin-bottom: 10rpx; }
.mp-req { margin-right: 4rpx; }
.mp-input { min-height: 76rpx; border-radius: 16rpx; border: 1rpx solid #eef0f4; background: #fafbfc; padding: 18rpx 22rpx; font-size: 24rpx; color: #333; box-sizing: border-box; }
.mp-textarea { height: 148rpx; }
.mp-picker { display: flex; align-items: center; color: #b3bac6; }
.mp-ph { color: #b3bac6; }
.mp-submit { margin-top: 28rpx; color: #fff; text-align: center; font-size: 28rpx; font-weight: 600; padding: 22rpx 0; border-radius: 48rpx; }
.mp-form-tip { font-size: 20rpx; text-align: center; margin-top: 16rpx; }
.mp-map { border-radius: 24rpx; overflow: hidden; }
.mp-map-bg { position: relative; height: 264rpx; background-color: #eef2f5; background-image: repeating-linear-gradient(0deg, rgba(255,255,255,.75) 0 1rpx, transparent 1rpx 56rpx), repeating-linear-gradient(90deg, rgba(255,255,255,.75) 0 1rpx, transparent 1rpx 56rpx); }
.mp-map-bg::after { content: ''; position: absolute; left: -20rpx; top: 40%; width: 140%; height: 12rpx; background: rgba(255,255,255,.9); transform: rotate(-12deg); }
.mp-map-marker { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; z-index: 3; }
.mp-map-bubble { background: #fff; border-radius: 16rpx; padding: 8rpx 16rpx; font-size: 20rpx; color: #1a1d28; box-shadow: 0 4rpx 16rpx rgba(0,0,0,.12); margin-bottom: 8rpx; white-space: nowrap; }
.mp-map-foot { display: flex; align-items: center; gap: 16rpx; padding: 22rpx 28rpx; background: #fff; }
.mp-map-info { flex: 1; min-width: 0; }
.mp-map-title { font-size: 26rpx; font-weight: 500; }
.mp-map-addr { font-size: 22rpx; margin-top: 8rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mp-map-dist { font-size: 20rpx; flex-shrink: 0; }
.mp-map-btn { color: #fff; font-size: 22rpx; padding: 12rpx 24rpx; border-radius: 36rpx; flex-shrink: 0; }
.mp-contact { border-radius: 24rpx; overflow: hidden; }
.mp-ct-item { display: flex; align-items: center; gap: 20rpx; padding: 24rpx 28rpx; border-bottom: 1rpx solid #f2f4f7; }
.mp-ct-item:last-child { border-bottom: none; }
.mp-ct-ic { width: 60rpx; height: 60rpx; border-radius: 30rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mp-ct-body { flex: 1; min-width: 0; }
.mp-ct-lb { font-size: 22rpx; }
.mp-ct-v { font-size: 26rpx; margin-top: 4rpx; }
.mp-ct-act { font-size: 22rpx; padding: 8rpx 20rpx; border-radius: 32rpx; border: 1rpx solid; flex-shrink: 0; }
.mp-service { display: flex; align-items: center; justify-content: space-around; }
.mp-service-item { display: flex; align-items: center; gap: 8rpx; font-size: 22rpx; }
.mp-footer { text-align: center; }
.mp-footer-1 { font-size: 22rpx; color: #b0b8c9; }
.mp-footer-2 { font-size: 20rpx; color: #c3cad6; margin-top: 12rpx; }
`
