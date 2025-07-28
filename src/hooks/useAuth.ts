import { useEffect } from 'react'
import { CURRENT_ROLE_INFO, STORAGE_KEY, useUserStore } from '@/store/user'
import { UserAPI } from '@/request/userApi'
import Taro from '@tarojs/taro'
import { initTab } from '@/utils/utils'
import { useTabInfoStore } from '@/store/tabInfo'
import { SuccessCode } from '@/common/constants/constants'



export const useAuth = (checkLogin = true) => {
  const { setUserInfo, setCurrentRoleInfo } = useUserStore()
  const { setTabInfo } = useTabInfoStore()

  const checkLoginStatus = async () => {
    const response = await UserAPI.getUserInfo()
    if (response?.response_status?.code === SuccessCode) {
      const userInfo = response.data
      const storeUserInfo = Taro.getStorageSync(STORAGE_KEY)
      const roleInfo = storeUserInfo.username === userInfo.username ? Taro.getStorageSync(CURRENT_ROLE_INFO) || userInfo.role_list?.[0] : userInfo.role_list?.[0]
      setUserInfo(userInfo)
      setCurrentRoleInfo(roleInfo)
      initTab(roleInfo.role, setTabInfo)
    } else {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }
  }

  useEffect(() => {
    if (checkLogin) {
      checkLoginStatus()
    }
  }, [checkLogin])

  return {
    checkLoginStatus
  }
}