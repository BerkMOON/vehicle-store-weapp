import { Role } from "@/common/constants/constants"
import { RoleList } from "@/request/userApi/typings"
import Taro from "@tarojs/taro"
import { Agenda, BellUnread, Calculator, People, Truck, User } from '@nutui/icons-react-taro'

export interface TabItem {
  pagePath: string
  text: string
  icon: React.ReactNode
}

/** Tab 合并时的展示顺序（「我的」固定最后） */
const TAB_ORDER: string[] = [
  '/pages/factory-test/index',
  '/pages/device-stat/index',
  '/pages/order/index',
  '/pages/lost-reminder/index',
  '/pages/mileage-reminder/index',
  '/pages/user-list/index',
  '/pages/mine/index',
]

/** 按门店去重，同一门店多个角色只保留一条用于切换 */
export function getUniqueStores(roleList: RoleList[]): RoleList[] {
  const map = new Map<number, RoleList>()
  roleList.forEach((item) => {
    if (!map.has(item.store_id)) {
      map.set(item.store_id, item)
    }
  })
  return Array.from(map.values())
}

/** 当前门店下的全部角色 */
export function getRolesAtStore(
  roleList: RoleList[],
  storeId?: number | null,
): RoleList[] {
  if (storeId == null) return []
  return roleList.filter((item) => item.store_id === storeId)
}

/** 合并多角色可见 Tab（按 pagePath 去重） */
export function getTabsForRoles(roles: Role[]): TabItem[] {
  const merged = new Map<string, TabItem>()
  roles.forEach((role) => {
    getTab(role).forEach((tab) => {
      if (tab.pagePath && !merged.has(tab.pagePath)) {
        merged.set(tab.pagePath, tab as TabItem)
      }
    })
  })
  return TAB_ORDER.filter((path) => merged.has(path)).map((path) => merged.get(path)!)
}

/** 根据当前门店上下文解析应展示的角色列表 */
export function getActiveRoles(
  roleList: RoleList[],
  currentRoleInfo: RoleList | null,
): Role[] {
  return getRolesAtStore(roleList, currentRoleInfo?.store_id).map((item) => item.role)
}

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
    pagePath: '/pages/factory-test/index',
    text: '入场检测',
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

/** 销售安装执行人：设备统计、我的 */
export const salesInstallExecutorTabList = [
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

/** 售后安装执行人：入厂检测、工单列表、里程提醒、我的 */
export const supportInstallExecutorTabList = [
  {
    pagePath: '/pages/factory-test/index',
    text: '入场检测',
    icon: <Calculator size={18} />
  },
  {
    pagePath: '/pages/order/index',
    text: '工单列表',
    icon: <Agenda size={18} />
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

export const initTab = (roles: Role | Role[], setTabInfo: (tab: TabItem) => void) => {
  const roleList = Array.isArray(roles) ? roles : [roles]
  const tabs = getTabsForRoles(roleList)
  const tabInfo = tabs[0] || getTab(Role.Support)[0] as TabItem
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
    case Role.SalesInstallExecutor:
      return salesInstallExecutorTabList
    case Role.SupportInstallExecutor:
      return supportInstallExecutorTabList
    case Role.MaintenanceEngineer:
      return maintenanceEngineerTabList
    default:
      return supportTabList
  }
}