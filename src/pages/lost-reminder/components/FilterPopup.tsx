import { View } from '@tarojs/components'
import { Button, Calendar, Form, FormInstance, Input, Popup } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import dayjs from 'dayjs'

interface FilterPopupProps {
  visible: boolean
  onClose: () => void
  onSearch: () => void
  onReset: () => void
  form: FormInstance<any>
}

export default function FilterPopup({ visible, onClose, onSearch, onReset, form }: FilterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const dateRange = Form.useWatch('date_range', form)

  const setChooseValue = (param) => {
    form.setFieldsValue({
      date_range: [dayjs(...[param[0][3]]).format('YYYY-MM-DD'), dayjs(...[param[1][3]]).format('YYYY-MM-DD')]
    })
    setIsVisible(false)
  }

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
            <Form.Item
              name='date_range'
              label='选择时间段'
              onClick={() => {
                setIsVisible(true)
              }}>
              <div>{dateRange ? `${dateRange?.[0]}至${dateRange?.[1]}` : '全部时间'}</div>
            </Form.Item>
          </Form>
        </View>
        <Calendar
          visible={isVisible}
          defaultValue={dateRange}
          type="range"
          startDate='2025-05-01'
          onConfirm={setChooseValue}
        />
        <View className='popup-footer'>
          <Button onClick={onReset}>重置</Button>
          <Button color="#4e54c8" onClick={onSearch}>确定</Button>
        </View>
      </View>
    </Popup>
  )
}