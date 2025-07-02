import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/user'
import { UserAPI } from '@/request/userApi'
import Taro from '@tarojs/taro'
import { initTab } from '@/utils/utils'
import { useTabInfoStore } from '@/store/tabInfo'
import { SuccessCode } from '@/common/constants/constants'



export const useAuth = () => {
  const { setUserInfo } = useUserStore()
  const { setTabInfo } = useTabInfoStore()

  const checkLoginStatus = async () => {
    const response = await UserAPI.getUserInfo()
    if (response?.response_status?.code === SuccessCode) {
      const userInfo = response.data
      setUserInfo(userInfo)
      initTab(userInfo.role, setTabInfo)
    } else {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }
  }

  useEffect(() => {
    checkLoginStatus()
  }, [])

  return {}
}