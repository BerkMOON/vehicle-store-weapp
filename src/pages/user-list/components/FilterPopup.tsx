import { View } from '@tarojs/components'
import { Button, Form, Input, Popup, Radio, RadioGroup } from '@nutui/nutui-react-taro'
import { ROLES_INFO, SuccessCode } from '@/common/constants/constants'
import { useEffect, useState } from 'react'
import { UserAPI } from '@/request/userApi'

interface FilterPopupProps {
  visible: boolean
  onClose: () => void
  onSearch: () => void
  onReset: () => void
  form: any
}

export default function FilterPopup({ visible, onClose, onSearch, onReset, form }: FilterPopupProps) {
  const [roleList, setRoleList] = useState<{ text: string; value: string }[]>([])

  const fetchRoleList = async () => {
    try {
      const res = await UserAPI.getAllBusinessRole()
      if (res?.response_status.code === SuccessCode) {
        const list = res.data.role_list?.map(role => ({
          text: role.name || '',
          value: role.role || ''
        })) || []
        setRoleList(list)
      }
    } catch (error) {
      console.error('获取角色列表失败：', error)
    }
  }

  useEffect(() => {
    fetchRoleList()
  }, [])

  return (
    <Popup visible={visible} position='bottom' onClose={onClose} style={{ height: '60vh' }}>
      <View className='filter-popup'>
        <View className='popup-header'>
          <View className='title'>筛选条件</View>
        </View>
        <View className='popup-content'>
          <Form form={form} divider>
            <Form.Item name='username' label='用户名'>
              <Input placeholder='请输入用户名' />
            </Form.Item>
            <Form.Item name='role' label='角色'>
              <RadioGroup>
                {roleList.map((role, index) => (
                  <Radio key={index} value={role.value}>{role.text}</Radio>
                ))}
              </RadioGroup>
            </Form.Item>
          </Form>
        </View>
        <View className='popup-footer'>
          <Button onClick={onReset}>重置</Button>
          <Button color="#4e54c8" onClick={onSearch}>确定</Button>
        </View>
      </View>
    </Popup>
  )
}