export default defineAppConfig({
  pages: [
    'pages/role-select/index',
    'pages/order/index',
    'pages/mine/index',
    'pages/login/index',
    'pages/order-detail/index',
    'pages/order-search/index',
    'pages/coupon-generate/index',
    'pages/coupon-apportion/index'
  ],
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: 'pages/order/index',
        text: '首页',
      },
      {
        pagePath: 'pages/coupon-apportion/index',
        text: '优惠券发放'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
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
    }
  },
})
