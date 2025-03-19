import { View } from '@tarojs/components'
import { Input, Button, Checkbox } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import { UserAPI } from '@/request/userApi'
import { useUserStore } from '@/store/user'
import { initTab } from '@/utils/utils'
import { useTabInfoStore } from '@/store/tabInfo'
// import Captcha from '@/components/Captcha'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberPassword, setRememberPassword] = useState(false)

  const { setUserInfo } = useUserStore()
  const { setTabInfo } = useTabInfoStore()

  const handleLogin = async () => {
    try {
      // 1. 表单验证
      if (!username || !password) {
        return Taro.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
      }

      // 2. 显示加载状态
      Taro.showLoading({
        title: '登录中...'
      })

      // 3. 调用登录接口
      const response = await UserAPI.login({
        username,
        password,
      })

      // 4. 处理响应
      if (response.data.response_status.code === 200) { // 假设 0 是成功状态码
        // 存储登录信息
        if (response?.header['Set-Cookie']) {
          Taro.setStorageSync('cookies', response?.header['Set-Cookie'])
        }

        const userInfo = response.data.data

        setUserInfo(userInfo)

        // 如果选择了记住密码
        if (rememberPassword) {
          Taro.setStorageSync('loginInfo', {
            username,
            password
          })
        } else {
          // 清除已保存的登录信息
          Taro.removeStorageSync('loginInfo')
        }

        // 提示成功
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })


        initTab(userInfo.role, setTabInfo)
      } else {
        // 登录失败
        Taro.showToast({
          title: response.data.response_status.msg || '登录失败',
          icon: 'error'
        })

        // 刷新验证码
        // refreshCaptcha()
      }
    } catch (error) {
      console.error('登录错误：', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'error'
      })
    }
  }

  // 刷新验证码的方法
  // const refreshCaptcha = () => {
  //   // 这里添加刷新验证码的逻辑
  //   // 例如：重新获取验证码图片URL
  //   setCaptcha('')  // 清空验证码输入
  // }

  // 页面加载时检查是否有保存的登录信息
  useEffect(() => {
    const savedLoginInfo = Taro.getStorageSync('loginInfo')
    if (savedLoginInfo) {
      setUsername(savedLoginInfo.username)
      setPassword(savedLoginInfo.password)
      setRememberPassword(true)
    }
  }, [])

  return (
    <View className='login-container'>
      <View className='login-header'>
        <View className='login-title'>欢迎登录易达安</View>
      </View>

      <View className='login-form'>
        <View className='form-item'>
          <Input
            className='input'
            placeholder='请输入账号'
            value={username}
            onChange={(val) => setUsername(val)}
          />
        </View>

        <View className='form-item'>
          <Input
            className='input'
            placeholder='请输入密码'
            type='password'
            value={password}
            onChange={(val) => setPassword(val)}
          />
        </View>

        <View className='form-item checkbox-container'>
          <Checkbox
            checked={rememberPassword}
            onChange={(val) => setRememberPassword(val)}
          >
            记住密码
          </Checkbox>
        </View>

        <Button
          block
          color="#4e54c8"
          className='login-button'
          onClick={handleLogin}
        >
          登录
        </Button>

        <View className='forgot-password'>
          忘记密码?
        </View>
      </View>
    </View>
  )
}

export default Login 