import { View } from '@tarojs/components'
import { Button, Form, Input, Popup } from '@nutui/nutui-react-taro'
import { UserAPI } from '@/request/userApi'
import { UserListInfo } from '@/request/userApi/typings'
import Taro from '@tarojs/taro'
import { useEffect } from 'react'

interface EditInfoPopupProps {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
  currentUser: UserListInfo | null
}

export default function EditInfoPopup({ visible, onClose, onSuccess, currentUser }: EditInfoPopupProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        nickname: currentUser?.nickname,
        phone: currentUser?.phone,
        email: currentUser?.email
      })
    }
  }, [visible, currentUser, form])

  const handleSubmit = async (values: any) => {
    try {
      await UserAPI.update({ 
        user_id: currentUser?.id!, 
        ...values 
      })
      Taro.showToast({ title: '更新成功', icon: 'success' })
      onClose()
      onSuccess()
    } catch (error) {
      Taro.showToast({ title: '更新失败', icon: 'error' })
    }
  }

  return (
    <Popup visible={visible} position='bottom' onClose={onClose}>
      <View className='filter-popup'>
        <View className='popup-header'>
          <View className='title'>编辑用户信息</View>
        </View>
        <View className='popup-content'>
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name='nickname' label='用户名称'>
              <Input placeholder='请输入用户名称' />
            </Form.Item>
            <Form.Item name='phone' label='手机号'>
              <Input placeholder='请输入手机号' />
            </Form.Item>
            <Form.Item name='email' label='邮箱'>
              <Input placeholder='请输入邮箱' />
            </Form.Item>
            <View className='popup-footer'>
              <Button onClick={onClose}>取消</Button>
              <Button formType='submit' color="#4e54c8">确定</Button>
            </View>
          </Form>
        </View>
      </View>
    </Popup>
  )
}