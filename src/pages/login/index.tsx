import { View } from '@tarojs/components'
import { Input, Button, Checkbox } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
// import Captcha from '@/components/Captcha'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [rememberPassword, setRememberPassword] = useState(false)

  const handleLogin = async () => {
    try {
      // 1. 表单验证
      if (!username || !password || !captcha) {
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
      const res = await Taro.request({
        url: 'YOUR_API_URL/login',
        method: 'POST',
        data: {
          username,
          password,
          captcha,
        }
      })

      // 4. 处理响应
      if (res.data.code === 0) { // 假设 0 是成功状态码
        // 存储登录信息
        Taro.setStorageSync('token', res.data.data.token)

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

        // 延迟跳转到首页
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
      } else {
        // 登录失败
        Taro.showToast({
          title: res.data.msg || '登录失败',
          icon: 'error'
        })

        // 刷新验证码
        refreshCaptcha()
      }
    } catch (error) {
      console.error('登录错误：', error)
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'error'
      })
    } finally {
      Taro.hideLoading()
    }
  }

  // 刷新验证码的方法
  const refreshCaptcha = () => {
    // 这里添加刷新验证码的逻辑
    // 例如：重新获取验证码图片URL
    setCaptcha('')  // 清空验证码输入
  }

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
        <View className='login-title'>欢迎登录易好修</View>
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

        {/* <View className='form-item captcha-container'>
          <Captcha />
        </View> */}

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
          type='primary'
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