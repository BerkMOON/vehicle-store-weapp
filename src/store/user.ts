import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { RoleList, UserInfo } from '@/request/userApi/typings'

export const STORAGE_KEY = 'USER_INFO'
export const CURRENT_ROLE_INFO = 'CURRENT_ROLE_INFO'


interface UserState {
  userInfo: UserInfo | null
  currentRoleInfo: RoleList | null
  setUserInfo: (info: UserInfo) => void
  setCurrentRoleInfo: (info: RoleList) => void
  clearUserInfo: () => void
  initializeFromStorage: () => Promise<void>
}

// 从存储中读取数据
const loadFromStorage = async (key: string): Promise<any | null> => {
  try {
    const storage = await Taro.getStorage({ key })
    return storage.data
  } catch {
    return null
  }
}

// 保存数据到存储
const saveToStorage = async (key: string, data: any) => {
  await Taro.setStorage({
    key,
    data
  })
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  currentRoleInfo: null,

  initializeFromStorage: async () => {
    const savedUserInfo = await loadFromStorage(STORAGE_KEY)
    const savedRoleInfo = await loadFromStorage(CURRENT_ROLE_INFO)
    if (savedUserInfo) {
      set({
        userInfo: savedUserInfo,
        currentRoleInfo: savedRoleInfo
      })
    }
  },

  setUserInfo: (info) => {
    set({
      userInfo: info,
    })
    saveToStorage(STORAGE_KEY, info)
  },

  setCurrentRoleInfo: (info) => {
    set({
      currentRoleInfo: info
    })
    saveToStorage(CURRENT_ROLE_INFO, info)
  },

  clearUserInfo: () => {
    set({
      userInfo: null,
      currentRoleInfo: null,
    })
    Taro.removeStorageSync(STORAGE_KEY)
    Taro.removeStorageSync(CURRENT_ROLE_INFO)
  },
}))