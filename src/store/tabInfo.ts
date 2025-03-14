import { create } from 'zustand'
import Taro from '@tarojs/taro'

const STORAGE_KEY = 'TAB_INFO'

export interface TabInfo {
  pagePath?: string,
  text?: string,
  icon?: React.ReactNode,
}

interface TabState {
  tabInfo: TabInfo | null
  setTabInfo: (tabInfo: TabInfo | null) => void
  initializeFromStorage: () => Promise<void>
}

// 从存储中读取数据
const loadFromStorage = async (): Promise<TabInfo | null> => {
  try {
    const storage = await Taro.getStorage({ key: STORAGE_KEY })
    return storage.data || null
  } catch {
    return null
  }
}

// 保存数据到存储
const saveToStorage = async (tabInfo: TabInfo | null) => {
  // 只保存已完成的下载记录
  await Taro.setStorage({
    key: STORAGE_KEY,
    data: tabInfo
  })
}

export const useTabInfoStore = create<TabState>((set) => ({
  tabInfo: null,

  // 初始化方法
  initializeFromStorage: async () => {
    const tabInfo = await loadFromStorage()
    set({ tabInfo })
  },

  setTabInfo: (tabInfo) => set(() => {
    saveToStorage(tabInfo)
    return { tabInfo }
  }),
}))