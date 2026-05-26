import { View, Text } from '@tarojs/components'
import { Button, Input } from '@nutui/nutui-react-taro'

interface StepBindProps {
  vin: string
  bindSn: string
  onBindSnChange: (v: string) => void
  loading: boolean
  onSubmit: () => void
  onBack: () => void
}

export function StepBind({
  vin,
  bindSn,
  onBindSnChange,
  loading,
  onSubmit,
  onBack,
}: StepBindProps) {
  return (
    <View className='wizard-step'>
      <View className='wizard-step-title'>绑定车架号到设备</View>
      <Text className='wizard-step-desc'>
        将车架号 {vin} 绑定到店端设备
      </Text>
      <View className='field' style={{ marginTop: 16 }}>
        <Text className='field-label'>设备 SN（必填）</Text>
        <Input placeholder='扫描或输入设备 SN' value={bindSn} onChange={onBindSnChange} />
      </View>
      <Button type='primary' block loading={loading} onClick={onSubmit} style={{ marginTop: 20 }}>
        确认绑定
      </Button>
      <Button block fill='outline' onClick={onBack} style={{ marginTop: 12 }}>
        上一步
      </Button>
    </View>
  )
}
