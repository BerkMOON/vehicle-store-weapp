import { Role } from "@/common/constants/constants"
import Taro from "@tarojs/taro"
import { Agenda, BellUnread, Calculator, People, Truck, User } from '@nutui/icons-react-taro'

/**
 * 手机号加密显示
 * @param phone 手机号
 * @returns 加密后的手机号，例如：138****5678
 */
export const encryptPhone = (phone: string): string => {
  if (!phone || phone.length < 11) {
    return phone
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export const supportTabList = [
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

export const supportDirectorTabList = [
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
    pagePath: '/pages/mileage-reminder/index',
    text: '里程提醒',
    icon: <Truck size={18} />
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

export const supportManageTabList = [
  {
    pagePath: '/pages/factory-test/index',
    text: '入场检测',
    icon: <Calculator size={18} />
  },
  {
    pagePath: '/pages/device-stat/index',
    text: '设备统计',
    icon: <Agenda size={18} />
  },
  {
    pagePath: '/pages/lost-reminder/index',
    text: '流失提醒',
    icon: <BellUnread size={18} />
  },
  {
    pagePath: '/pages/mileage-reminder/index',
    text: '里程提醒',
    icon: <Truck size={18} />
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
    pagePath: '/pages/factory-test/index',
    text: '入场检测',
    icon: <Calculator size={18} />
  },
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
    pagePath: '/pages/mileage-reminder/index',
    text: '里程提醒',
    icon: <Truck size={18} />
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
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

export const salesManagerTabList = [
  {
    pagePath: '/pages/device-stat/index',
    text: '设备统计',
    icon: <Calculator size={18} />
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

export const maintenanceEngineerTabList = [
  {
    pagePath: '/pages/factory-test/index',
    text: '入场检测',
    icon: <Calculator size={18} />
  },
  {
    pagePath: '/pages/mine/index',
    text: '我的',
    icon: <User size={18} />
  }
]

export const initTab = (role: Role, setTabInfo: (tab: any) => void) => {
  const tabInfo = getTab(role)[0]
  setTabInfo(tabInfo)
  handleLoginSuccess(tabInfo.pagePath)
}

export const handleLoginSuccess = (defaultPath: string) => {
  const lastPage = Taro.getStorageSync('lastPage')
  if (lastPage && lastPage !== '/pages/index/index' && lastPage !== '/pages/login/index') {
    Taro.removeStorageSync('lastPage')
    Taro.reLaunch({
      url: lastPage
    })
  } else {
    // 默认跳转
    Taro.reLaunch({
      url: defaultPath
    })
  }
}

export const getTab = (role: Role) => {
  switch (role) {
    case Role.Support:
      return supportTabList
    case Role.SupportDirector:
      return supportDirectorTabList
    case Role.Admin:
      return adminTabList
    case Role.Finance:
      return financeTabList
    case Role.SupportManager:
      return supportManageTabList
    case Role.SalesDirector:
      return salesManagerTabList
    case Role.MaintenanceEngineer:
      return maintenanceEngineerTabList
    default:
      return supportTabList
  }
}