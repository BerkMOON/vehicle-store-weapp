import { Role } from "@/common/constants/constants"
import { supportTabList, financeTabList, adminTabList } from "@/components/CustomTabBar"
import Taro from "@tarojs/taro"

export const initTab = (role: Role, setTabInfo: (tab: any) => void) => {
  switch (role) {
    case Role.Support:
      setTabInfo(supportTabList[0])
      handleLoginSuccess('/pages/order/index')
      break
    case Role.Admin:
      setTabInfo(adminTabList[0])
      handleLoginSuccess('/pages/coupon-review/index')
      break
    case Role.Finance:
      setTabInfo(financeTabList[0])
      handleLoginSuccess('/pages/finance/index')
      break
    default:
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