import { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
// 全局样式
import './app.scss'
import Taro from '@tarojs/taro'

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {
    const role = Taro.getStorageSync('userRole')
    if (role) {
      if (role === 'afterSale') {
        Taro.reLaunch({
          url: '/pages/order/index'
        })
      } else {
        Taro.reLaunch({
          url: '/pages/mine/index'
        })
      }
    } else {
      Taro.reLaunch({
        url: '/pages/role-select/index'
      })
    }
  }, [])


  // 对应 onShow
  useDidShow(() => {
  })

  // 对应 onHide
  useDidHide(() => { })

  return props.children
}

export default App
