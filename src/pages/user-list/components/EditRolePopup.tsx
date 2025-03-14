import { View } from '@tarojs/components'
import { Button, Form, Popup, Radio, RadioGroup } from '@nutui/nutui-react-taro'
import { UserAPI } from '@/request/userApi'
import { UserListInfo } from '@/request/userApi/typings'
import Taro from '@tarojs/taro'
import { ROLES_INFO } from '@/common/constants/constants'
import { useEffect } from 'react'

interface EditRolePopupProps {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
  currentUser: UserListInfo | null
}

export default function EditRolePopup({ visible, onClose, onSuccess, currentUser }: EditRolePopupProps) {
  const [form] = Form.useForm()

  const handleSubmit = async (values: any) => {
    try {
      await UserAPI.role({ 
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

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        role: currentUser?.role
      })
    }
  }, [visible, currentUser, form])

  return (
    <Popup visible={visible} position='bottom' onClose={onClose}>
      <View className='filter-popup'>
        <View className='popup-header'>
          <View className='title'>修改用户角色</View>
        </View>
        <View className='popup-content'>
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name='role' label='角色'>
              <RadioGroup>
                {Object.keys(ROLES_INFO).map(key => (
                  <Radio key={key} value={key}>{ROLES_INFO[key]}</Radio>
                ))}
              </RadioGroup>
            </Form.Item>
            <View className='popup-footer'>
              <Button onClick={onClose}>取消</Button>
              <Button formType='submit' type='primary'>确定</Button>
            </View>
          </Form>
        </View>
      </View>
    </Popup>
  )
}