import Taro from '@tarojs/taro'
import { Tabbar } from '@nutui/nutui-react-taro'
import { Agenda, Board, Coupon, Find, User, Voucher } from '@nutui/icons-react-taro'
import { useState, useEffect } from 'react'
import { TabInfo, useTabInfoStore } from '@/store/tabInfo'
import { Role } from '@/common/constants/constants'

const afterSaleTabList = [
  {
    pagePath: '/pages/order/index',
    text: '工单列表',
    icon: <Agenda size={18} />
  },
  {
    pagePath: '/pages/coupon-apportion/index',
    text: '优惠券发放',
    icon:  <Coupon size={18} />
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

const shopManagerTabList = [
  {
    pagePath: '/pages/accident-analysis/index',
    text: '统计分析',
    iconPath: '/assets/images/analysis.png',
    selectedIconPath: '/assets/images/analysis-active.png'
  },
  {
    pagePath: '/pages/coupon-review/index',
    text: '优惠券审核',
    icon: <Find size={18} />
  },
  {
    pagePath: '/pages/balance-clues/index',
    text: '线索余额',
    iconPath: '/assets/images/balance.png',
    selectedIconPath: '/assets/images/balance-active.png'
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

const financeTabList = [
  {
    pagePath: '/pages/finance/index',
    text: '优惠券结算',
    icon:  <Coupon size={18} />
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

function CustomTabBar() {
  const { 
    tabInfo,
    setTabInfo
  } = useTabInfoStore()
  const [tabList, setTabList] = useState<TabInfo[]>([])

  useEffect(() => {
    const role = Taro.getStorageSync('userRole')
    const tabList = role === Role.AfterSale ? afterSaleTabList : role === Role.ShopManager ? shopManagerTabList : financeTabList
    setTabList(tabList)
    if(!tabInfo) {
      setTabInfo(tabList[0])
    }
  }, [])
  

  const switchTab = (tabInfo: TabInfo) => {
    setTabInfo(tabInfo)
    Taro.switchTab({
      url: tabInfo.pagePath || ''
    })
  }

  return (
    <Tabbar
      fixed
      style={{
        zIndex: 999
      }}
      inactiveColor="#7d7e80" activeColor="#4e54c8"
      onSwitch={(value) => {
        switchTab(tabList[value])
      }}
      value={tabList.findIndex(item => tabInfo?.pagePath === item.pagePath)}
    >
      {
        tabList.map(item => (
          <Tabbar.Item title={item.text} icon={item.icon} />
        ))
      }
    </Tabbar>
  )
}

export default CustomTabBar