import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { UserInfo } from '@/request/userApi/typings'

const STORAGE_KEY = 'USER_INFO'


interface UserState {
  userInfo: UserInfo | null
  setUserInfo: (info: UserInfo) => void
  clearUserInfo: () => void
  initializeFromStorage: () => Promise<void>
}

// 从存储中读取数据
const loadFromStorage = async (): Promise<UserInfo | null> => {
  try {
    const storage = await Taro.getStorage({ key: STORAGE_KEY })
    return storage.data
  } catch {
    return null
  }
}

// 保存数据到存储
const saveToStorage = async (userInfo: UserInfo) => {
  await Taro.setStorage({
    key: STORAGE_KEY,
    data: userInfo
  })
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,

  initializeFromStorage: async () => {
    const savedUserInfo = await loadFromStorage()
    if (savedUserInfo) {
      set({ 
        userInfo: savedUserInfo,
      })
    }
  },

  setUserInfo: (info) => {
    set({ 
      userInfo: info,
    })
    saveToStorage(info)
  },

  clearUserInfo: () => {
    set({ 
      userInfo: null,
    })
    Taro.removeStorage({ key: STORAGE_KEY })
  },
}))