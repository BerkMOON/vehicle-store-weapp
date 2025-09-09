import { View } from '@tarojs/components'
import { Button, Form, FormInstance, Input, Popup } from '@nutui/nutui-react-taro'
import dayjs from 'dayjs'

interface FilterPopupProps {
  visible: boolean
  onClose: () => void
  onSearch: () => void
  onReset: () => void
  form: FormInstance<any>
}

export default function FilterPopup({ visible, onClose, onSearch, onReset, form }: FilterPopupProps) {
  return (
    <Popup visible={visible} position='bottom' onClose={onClose} style={{ height: '60vh' }}>
      <View className='filter-popup'>
        <View className='popup-header'>
          <View className='title'>筛选条件</View>
        </View>
        <View className='popup-content'>
          <Form
            form={form}
            divider
            initialValues={{
              date_range: [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
            }}
          >
            <Form.Item name='sn' label='设备SN'>
              <Input placeholder='请输入SN' />
            </Form.Item>
            <Form.Item name='mileage' label='最小里程数(km)'>
              <Input placeholder='请输入最小里程数(km)' />
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