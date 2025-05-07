import { Role } from "@/common/constants/constants"
import { supportTabList, financeTabList, adminTabList } from "@/components/CustomTabBar"
import Taro from "@tarojs/taro"

export const initTab = (role: Role, setTabInfo: (tab: any) => void) => {
  switch (role) {
    case Role.Support:
    case Role.SupportDirector:
      setTabInfo(supportTabList[0])
      handleLoginSuccess(supportTabList[0].pagePath)
      break
    case Role.Admin:
      setTabInfo(adminTabList[0])
      handleLoginSuccess(adminTabList[0].pagePath)
      break
    case Role.Finance:
      setTabInfo(financeTabList[0])
      handleLoginSuccess(financeTabList[0].pagePath)
      break
    default:
      setTabInfo(supportTabList[0])
      handleLoginSuccess(supportTabList[0].pagePath)
      break
  }
}

export const handleLoginSuccess = (defaultPath: string) => {
  const lastPage = Taro.getStorageSync('lastPage')
  if (lastPage) {
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