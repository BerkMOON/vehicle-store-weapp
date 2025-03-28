import { View } from '@tarojs/components'
import { Picker, PickerOption } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import { UserAPI } from '@/request/userApi'
import './index.scss'
import { SuccessCode } from '@/common/constants/constants'

interface Props {
  value?: string
  onChange?: (value: string) => void
}

function RolePicker({ value, onChange }: Props) {
  const [roleList, setRoleList] = useState<{ text: string; value: string }[]>([])
  const [visible, setVisible] = useState(false)

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

  const handleConfirm = (_: PickerOption[], values: (string | number)[]) => {
    onChange?.(values[0] as string)
    setVisible(false)
  }

  const selectedRole = roleList.find(role => role.value === value)

  return (
    <View className='role-picker'>
      <View className='picker-value' onClick={() => setVisible(true)}>
        {selectedRole?.text || '请选择角色'}
      </View>
      <Picker
        visible={visible}
        options={[roleList]}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
        value={value ? [value] : []}
      />
    </View>
  )
}

export default RolePicker