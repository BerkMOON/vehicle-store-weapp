import { Role } from "@/common/constants/constants"
import { supportTabList, financeTabList, adminTabList } from "@/components/CustomTabBar"
import Taro from "@tarojs/taro"

export const initTab = (role: Role, setTabInfo: (tab: any) => void) => {
  switch (role) {
    case Role.Support:
      setTabInfo(supportTabList[0])
      Taro.reLaunch({
        url: '/pages/order/index'
      })
      break
    case Role.Admin:
      setTabInfo(adminTabList[0])
      Taro.reLaunch({
        url: '/pages/coupon-review/index'
      })
      break
    case Role.Finance:
      setTabInfo(financeTabList[0])
      Taro.reLaunch({
        url: '/pages/finance/index'
      })
      break
    case Role.Quality:
      Taro.reLaunch({
        url: '/packageQuality/pages/index/index'
      })
      break
    default:
      break
  }
}