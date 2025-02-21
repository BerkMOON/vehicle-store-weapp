import { FC } from 'react'
import { Button } from "@nutui/nutui-react-taro"
import Taro from '@tarojs/taro'

interface LoginButtonProps {
  onLoginSuccess?: (userInfo: any) => void
  onLoginFail?: (err: any) => void
}

const LoginButton: FC<LoginButtonProps> = ({
  onLoginSuccess,
  onLoginFail
}) => {
  const handleLogin = () => {
    Taro.login({
      success: (loginRes) => {
        console.log(loginRes, 'login')
        Taro.getUserInfo({
          success: (userInfo) => {
            console.log(userInfo, 'getUserInfo')
            onLoginSuccess?.(userInfo)
          },
          fail: (err) => {
            console.log('获取用户信息失败', err)
            onLoginFail?.(err)
          }
        })
      },
      fail: (err) => {
        console.log('登录失败', err)
        onLoginFail?.(err)
      }
    })
  }

  return (
    <Button type="primary" className="btn" onClick={handleLogin}>
      登录
    </Button>
  )
}

export default LoginButton 