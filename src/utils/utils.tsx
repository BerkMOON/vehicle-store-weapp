import { Role } from "@/common/constants/constants"
import { supportTabList, financeTabList, adminTabList, supportManageTabList } from "@/components/CustomTabBar"
import Taro from "@tarojs/taro"

export const initTab = (role: Role, setTabInfo: (tab: any) => void) => {
  const tabInfo = getTab(role)[0]
  setTabInfo(tabInfo)
  handleLoginSuccess(tabInfo.pagePath)
}

export const handleLoginSuccess = (defaultPath: string) => {
  const lastPage = Taro.getStorageSync('lastPage')
  if (lastPage && lastPage !== '/pages/index/index') {
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
    case Role.SupportDirector:
      return supportTabList
    case Role.Admin:
      return adminTabList
    case Role.Finance:
      return financeTabList
    case Role.SupportManager:
      return supportManageTabList
    default:
      return supportTabList
  }
}