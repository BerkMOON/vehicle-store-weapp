export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/order/index',
    'pages/mine/index',
    'pages/order-detail/index',
    'pages/order-search/index',
    'pages/coupon-generate/index',
    'pages/coupon-apportion/index',
    'pages/coupon-review/index',
    'pages/coupon-review/detail/index',
    'pages/finance/index',
    'pages/user-list/index',
  ],
  subPackages: [
    {
      root: 'package',
      pages: [
        'pages/change-password/index'
      ]
    }
  ],
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: 'pages/order/index',
        text: '首页',
      },
      {
        pagePath: 'pages/user-list/index',
        text: '员工列表'
      },
      {
        pagePath: 'pages/coupon-apportion/index',
        text: '优惠券发放'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
      },
      {
        pagePath: 'pages/coupon-review/index',
        text: '优惠券审核'
      },
      {
        pagePath: 'pages/finance/index',
        text: '优惠券结算'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4e54c8',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white',
  },
  permission: {
    "scope.userInfo": {
      desc: "获取用户信息"
    },
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序定位"
    }
  },
})
