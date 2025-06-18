import { View } from '@tarojs/components'
import { Input, Button, Checkbox, Form } from '@nutui/nutui-react-taro'
import { useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import { useUserStore } from '@/store/user'
import { initTab } from '@/utils/utils'
import { useTabInfoStore } from '@/store/tabInfo'
import { LoginAPI } from '@/request/loginApi'
import { SuccessCode } from '@/common/constants/constants'

function Login() {
  const [form] = Form.useForm()
  const { setUserInfo } = useUserStore()
  const { setTabInfo } = useTabInfoStore()

  const onFinish = async (values) => {
    try {
      Taro.showLoading({
        title: '登录中...'
      })

      const response = await LoginAPI.login({
        username: values.username,
        password: values.password,
      })

      if (response.data.response_status.code === SuccessCode) {
        if (response?.header['Set-Cookie']) {
          Taro.setStorageSync('cookies', response?.header['Set-Cookie'])
        }

        const userInfo = response.data.data
        setUserInfo(userInfo)

        if (values.remember) {
          Taro.setStorageSync('loginInfo', {
            username: values.username,
            password: values.password
          })
        } else {
          Taro.removeStorageSync('loginInfo')
        }
        Taro.hideLoading()
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })

        initTab(userInfo.role, setTabInfo)
      } else {
        Taro.hideLoading()
        Taro.showToast({
          title: response.data.response_status.msg || '登录失败',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('登录错误：', error)
      Taro.hideLoading()
      Taro.showToast({
        title: '网络错误，请重试',
        icon: 'error'
      })
    }
  }

  useEffect(() => {
    const savedLoginInfo = Taro.getStorageSync('loginInfo')
    if (savedLoginInfo) {
      form.setFieldsValue({
        username: savedLoginInfo.username,
        password: savedLoginInfo.password,
        remember: true
      })
    }
  }, [])

  return (
    <View className='login-container'>
      <View className='login-header'>
        <View className='login-title'>欢迎登录易达安</View>
      </View>

      <View className='login-form'>
        <Form
          form={form}
          onFinish={onFinish}
          footer={
            <Button
              block
              color="#4e54c8"
              className='login-button'
              formType='submit'
            >
              登录
            </Button>
          }
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input
              className='input'
              placeholder='请输入账号'
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input
              className='input'
              placeholder='请输入密码'
              type='password'
            />
          </Form.Item>

          <Form.Item
            name='remember'
            valuePropName='checked'
          >
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
        </Form>
      </View>
    </View>
  )
}

export default Login