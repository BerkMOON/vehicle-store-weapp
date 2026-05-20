import { View } from '@tarojs/components'
import { Button, Popup, Calendar, Form, FormInstance } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import dayjs from 'dayjs'
import './FilterPopup.scss'

interface FilterPopupProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  form: FormInstance<any>
}

function FilterPopup({ visible, onClose, onConfirm, form }: FilterPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const dateRange = Form.useWatch('date_range', form)

  const setChooseValue = (param: any) => {
    console.log('Calendar onConfirm param:', param)
    
    if (param && param.length >= 2) {
      try {
        // 使用与 lost-reminder 相同的格式
        const startDate = dayjs(...[param[0][3]]).format('YYYY-MM-DD')
        const endDate = dayjs(...[param[1][3]]).format('YYYY-MM-DD')
        
        console.log('Formatted dates:', { startDate, endDate })
        
        form.setFieldsValue({
          date_range: [startDate, endDate]
        })
      } catch (error) {
        console.error('Date formatting error:', error)
        console.log('Trying alternative format...')
        
        // 备用方案：直接使用参数
        const startDate = dayjs(param[0]).format('YYYY-MM-DD')
        const endDate = dayjs(param[1]).format('YYYY-MM-DD')
        
        form.setFieldsValue({
          date_range: [startDate, endDate]
        })
      }
    }
    setIsVisible(false)
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleReset = () => {
    form.resetFields()
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
          >
            <Form.Item
              name='date_range'
              label='选择时间段'
              onClick={() => {
                setIsVisible(true)
              }}>
              <div>{dateRange ? `${dateRange?.[0]}至${dateRange?.[1]}` : '请选择时间范围'}</div>
            </Form.Item>
          </Form>
        </View>
        <Calendar
          visible={isVisible}
          defaultValue={dateRange}
          type="range"
          startDate='2025-04-01'
          onConfirm={setChooseValue}
        />
        <View className='popup-footer'>
          <Button onClick={handleReset}>重置</Button>
          <Button color="#4e54c8" onClick={handleConfirm}>确定</Button>
        </View>
      </View>
    </Popup>
  )
}

export default FilterPopup
