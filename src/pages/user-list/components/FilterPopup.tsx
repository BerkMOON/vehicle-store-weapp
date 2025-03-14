import { View } from '@tarojs/components'
import { Button, Form, Input, Popup, Radio, RadioGroup } from '@nutui/nutui-react-taro'
import { ROLES_INFO } from '@/common/constants/constants'

interface FilterPopupProps {
  visible: boolean
  onClose: () => void
  onSearch: () => void
  onReset: () => void
  form: any
}

export default function FilterPopup({ visible, onClose, onSearch, onReset, form }: FilterPopupProps) {
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
            <Form.Item name='phone' label='手机号'>
              <Input placeholder='请输入手机号' />
            </Form.Item>
            <Form.Item name='email' label='邮箱'>
              <Input placeholder='请输入邮箱' />
            </Form.Item>
            <Form.Item name='role' label='角色'>
              <RadioGroup>
                {Object.keys(ROLES_INFO).map(key => (
                  <Radio key={key} value={key}>{ROLES_INFO[key]}</Radio>
                ))}
              </RadioGroup>
            </Form.Item>
          </Form>
        </View>
        <View className='popup-footer'>
          <Button onClick={onReset}>重置</Button>
          <Button type='primary' onClick={onSearch}>确定</Button>
        </View>
      </View>
    </Popup>
  )
}