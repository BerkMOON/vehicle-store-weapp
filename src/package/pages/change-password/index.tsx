import { View } from '@tarojs/components'
import { Form, Input, Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import GeneralPage from '@/components/GeneralPage'
import './index.scss'
import { LoginAPI } from '@/request/loginApi'
import { useUserStore } from '@/store/user'
import { SuccessCode } from '@/common/constants/constants'
import { Eye, Marshalling } from '@nutui/icons-react-taro'

function ChangePassword() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [inputType, setInputType] = useState<'text' | 'password'>('password')
  const [newInputType, setNewInputType] = useState<'text' | 'password'>('password')
  const [secondInputType, setSecondInputType] = useState<'text' | 'password'>('password')
  const { userInfo } = useUserStore()

  // 验证密码格式
  const validatePassword = (password: string) => {
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return password.length >= 6 && hasLetter && hasNumber
  }

  // 验证两次密码是否一致
  const validateConfirm = (confirm: string) => {
    const newPassword = form.getFieldValue('newPassword')
    return confirm === newPassword
  }

  const handleSubmit = async (values) => {
    try {

      if (!validatePassword(values.newPassword)) {
        Taro.showToast({
          title: '新密码必须包含字母和数字，且长度不少于6位',
          icon: 'none'
        })
        return
      }

      if (!validateConfirm(values.confirmPassword)) {
        Taro.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        })
        return
      }

      setLoading(true)

      // 调用修改密码接口
      const res = await LoginAPI.resetPassword({
        old: values.oldPassword,
        new: values.newPassword,
        username: userInfo?.username || '',
      })
      if (res?.response_status.code === SuccessCode) {
        Taro.showToast({
          title: '密码修改成功',
          icon: 'success'
        })
        setTimeout(() => {
          // 清除登录信息
          Taro.removeStorageSync('cookies')
          Taro.removeStorageSync('userRole')
          Taro.removeStorageSync('loginInfo')

          // 跳转到登录页
          Taro.reLaunch({
            url: '/pages/login/index'
          })
        }, 800)
      } else {
        Taro.showToast({
          title: res?.response_status.msg || '修改失败',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('修改密码失败：', error)
      Taro.showToast({
        title: '修改失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <GeneralPage>
      <View className='change-password'>
        <Form
          form={form}
          onFinish={handleSubmit}
          labelPosition="left"
          footer={
            <>
              <div
                style={{
                  width: '100%',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    textAlign: 'center',
                    marginBottom: '20px',
                  }}
                >
                  新密码必须包含字母和数字，且长度不少于6位
                </div>
                <Button block type="primary" size="large" nativeType="submit">
                  确认修改
                </Button>
              </div>
            </>
          }
        >
          <View className='form-password'>
            <Form.Item
              label='原密码'
              name='oldPassword'
              required
            >
              <Input
                type={inputType}
                placeholder='请输入原密码'
              />
            </Form.Item>
            <div
              onClick={() =>
                setInputType(inputType === 'text' ? 'password' : 'text')
              }
            >
              {inputType === 'text' ? (
                <Eye />
              ) : (
                <Marshalling />
              )}
            </div>
          </View>

          <View className='form-password'>
            <Form.Item
              label='新密码'
              name='newPassword'
              required
            >
              <Input
                type={newInputType}
                placeholder='请输入新密码'
              />
            </Form.Item>
            <div
              onClick={() =>
                setNewInputType(newInputType === 'text' ? 'password' : 'text')
              }
            >
              {newInputType === 'text' ? (
                <Eye />
              ) : (
                <Marshalling />
              )}
            </div>
          </View>

          <View className='form-password'>
            <Form.Item
              label='确认密码'
              name='confirmPassword'
              required
            >
              <Input
                type={secondInputType}
                placeholder='请再次输入新密码'
              />
            </Form.Item>
            <div
              onClick={() =>
                setSecondInputType(secondInputType === 'text'? 'password' : 'text')
              }
            >
              {secondInputType === 'text'? (
                <Eye />
              ) : (
                <Marshalling />
              )}
            </div>
          </View>
        </Form>
      </View>
    </GeneralPage>
  )
}

export default ChangePassword