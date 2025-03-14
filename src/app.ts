import { useDidShow, useDidHide } from '@tarojs/taro'
// 全局样式
import './app.scss'
import { useUserStore } from './store/user'
import { useAuth } from './hooks/useAuth'
import { useTabInfoStore } from './store/tabInfo'

function App(props) {
  // 可以使用所有的 React Hooks
  useAuth()

  // 对应 onShow
  useDidShow(() => {
    useTabInfoStore.getState().initializeFromStorage()
    useUserStore.getState().initializeFromStorage()
  })


  // 对应 onShow
  useDidShow(() => {
  })

  // 对应 onHide
  useDidHide(() => { })

  return props.children
}

export default App
