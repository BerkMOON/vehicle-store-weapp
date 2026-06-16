import { useEffect } from 'react'
import { CURRENT_ROLE_INFO, STORAGE_KEY, useUserStore } from '@/store/user'
import { UserAPI } from '@/request/userApi'
import Taro from '@tarojs/taro'
import { getActiveRoles, getRolesAtStore, initTab } from '@/utils/utils'
import { useTabInfoStore } from '@/store/tabInfo'
import { SuccessCode } from '@/common/constants/constants'
import { RoleList } from '@/request/userApi/typings'

function resolveCurrentRoleInfo(
  roleList: RoleList[],
  saved?: RoleList | null,
): RoleList {
  if (saved?.store_id != null) {
    const atStore = getRolesAtStore(roleList, saved.store_id)
    if (atStore.length > 0) return atStore[0]
  }
  return roleList[0]
}

export const useAuth = (checkLogin = true) => {
  const { setUserInfo, setCurrentRoleInfo } = useUserStore()
  const { setTabInfo } = useTabInfoStore()

  const checkLoginStatus = async () => {
    const response = await UserAPI.getUserInfo()
    if (response?.response_status?.code === SuccessCode) {
      const userInfo = response.data
      const storeUserInfo = Taro.getStorageSync(STORAGE_KEY)
      const savedRole = storeUserInfo?.username === userInfo.username
        ? Taro.getStorageSync(CURRENT_ROLE_INFO)
        : null
      const roleInfo = resolveCurrentRoleInfo(userInfo.role_list || [], savedRole)
      setUserInfo(userInfo)
      setCurrentRoleInfo(roleInfo)
      initTab(getActiveRoles(userInfo.role_list || [], roleInfo), setTabInfo)
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