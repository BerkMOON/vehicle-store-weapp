import { View } from '@tarojs/components'
import { Form, Input, Button, Popup } from '@nutui/nutui-react-taro'
import { UserAPI } from '@/request/userApi'
import Taro from '@tarojs/taro'
import RolePicker from '@/components/RolePicker'
import { useEffect } from 'react'

interface CreateUserPopupProps {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

function CreateUserPopup({ visible, onClose, onSuccess }: CreateUserPopupProps) {
  const [form] = Form.useForm()

  const handleSubmit = async (values) => {
    try {
      const res = await UserAPI.register(values)
      if (res?.response_status.code === 200) {
        Taro.showToast({
          title: '创建成功',
          icon: 'success'
        })
        form.resetFields()
        onSuccess()
        onClose()
      } else {
        Taro.showToast({
          title: res?.response_status.msg || '创建失败',
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '创建失败',
        icon: 'error'
      })
    }
  }

  return (
    <Popup
      visible={visible}
      position='bottom'
      onClose={onClose}
      className='create-user-popup'
    >
      <View className='filter-popup'>
        <View className='popup-header'>
          <View className='title'>新建员工</View>
        </View>
        <View className='popup-content'>
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              label='用户账号'
              name='username'
              rules={[{ required: true, message: '请输入用户账号' }]}
            >
              <Input placeholder='请输入用户名' />
            </Form.Item>

            <Form.Item
              label='密码'
              name='password'
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input type='password' placeholder='请输入密码' />
            </Form.Item>

            <Form.Item
              label='角色'
              name='role'
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <RolePicker />
            </Form.Item>

            <Form.Item label='手机号' name='phone'>
              <Input placeholder='请输入手机号' />
            </Form.Item>

            <Form.Item label='用户名' name='nickname'>
              <Input placeholder='请输入用户名' />
            </Form.Item>

            <Form.Item label='邮箱' name='email'>
              <Input placeholder='请输入邮箱' />
            </Form.Item>

            <View className='popup-footer'>
              <Button onClick={onClose}>取消</Button>
              <Button type='primary' formType='submit'>确定</Button>
            </View>
          </Form>
        </View>
      </View>
    </Popup>
  )
}

export default CreateUserPopup