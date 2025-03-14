import { Role } from "@/common/constants/constants"
import { afterSaleTabList, financeTabList, shopManagerTabList } from "@/components/CustomTabBar"
import Taro from "@tarojs/taro"

export const initTab = (role: Role, setTabInfo: (tab: any) => void) => {
  if (role === Role.AfterSale) {
    setTabInfo(afterSaleTabList[0])
    Taro.reLaunch({
      url: '/pages/order/index'
    })
  } else if (role === Role.Admin) {
    setTabInfo(shopManagerTabList[0])
    Taro.reLaunch({
      url: '/pages/coupon-review/index'
    })
  } else {
    setTabInfo(financeTabList[0])
    Taro.reLaunch({
      url: '/pages/finance/index'
    })
  }
}