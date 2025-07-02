import Taro from '@tarojs/taro'
import { Tabbar } from '@nutui/nutui-react-taro'
import { Agenda, BellUnread, Calculator, Coupon, Find, People, User } from '@nutui/icons-react-taro'
import { useState, useEffect } from 'react'
import { TabInfo, useTabInfoStore } from '@/store/tabInfo'
import { Role } from '@/common/constants/constants'
import { useUserStore } from '@/store/user'
import { getTab } from '@/utils/utils'

export const supportTabList = [
  {
    pagePath: '/pages/order/index',
    text: '工单列表',
    icon: <Agenda size={18} />
  },
//   {
//     pagePath: '/pages/coupon-apportion/index',
//     text: '优惠券发放',
//     icon: <Coupon size={18} />
//   },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

export const supportManageTabList = [
  {
    pagePath: '/pages/device-stat/index',
    text: '设备统计',
    icon: <Agenda size={18} />
  },
  {
    pagePath: '/pages/order/index',
    text: '工单列表',
    icon: <Agenda size={18} />
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

export const adminTabList = [
  {
    pagePath: '/pages/device-stat/index',
    text: '设备统计',
    icon: <Calculator size={18} />
  },
  {
    pagePath: '/pages/order/index',
    text: '工单列表',
    icon: <Agenda size={18} />
  },
  {
    pagePath: '/pages/lost-reminder/index',
    text: '流失提醒',
    icon: <BellUnread size={18} />
  },
  {
    pagePath: '/pages/user-list/index',
    text: '员工列表',
    icon: <People size={18} />
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

export const financeTabList = [
//   {
//     pagePath: '/pages/finance/index',
//     text: '优惠券结算',
//     icon: <Coupon size={18} />
//   },
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
  const { userInfo } = useUserStore()
  const [tabList, setTabList] = useState<TabInfo[]>([])

  useEffect(() => {
    const role = userInfo?.role
    const tabList = getTab(role as Role)
    setTabList(tabList)
    if (!tabInfo) {
      setTabInfo(tabList[0])
    }


    // 添加小程序隐藏和卸载时的清理函数
    const clearTabInfo = () => {
      setTabInfo(null)
    }

    return () => {
      clearTabInfo()
      Taro.offAppHide(clearTabInfo)
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