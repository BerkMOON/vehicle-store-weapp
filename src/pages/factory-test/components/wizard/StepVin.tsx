import { View, Text } from '@tarojs/components'
import { Button, Input } from '@nutui/nutui-react-taro'
import { Camera } from '@nutui/icons-react-taro'

interface StepVinProps {
  vinInput: string
  onVinChange: (v: string) => void
  loading: boolean
  onOcr: () => void
  onConfirm: () => void
}

export function StepVin({
  vinInput,
  onVinChange,
  loading,
  onOcr,
  onConfirm,
}: StepVinProps) {
  return (
    <View className='wizard-step'>
      <View className='wizard-step-title'>请先拍摄或输入车架号</View>
      <Text className='wizard-step-desc'>
        识别或输入 VIN 后点「确认」，系统将记录本次进厂检测并开始查询设备。
      </Text>
      <View className='vin-row'>
        <Input placeholder='17位车架号' value={vinInput} onChange={onVinChange} />
      </View>
      <View className='btn-row'>
        <Button size='small' fill='outline' icon={<Camera />} onClick={onOcr}>
          拍照识别
        </Button>
      </View>
      <Button type='primary' block loading={loading} onClick={onConfirm} style={{ marginTop: 16 }}>
        确认并查询
      </Button>
    </View>
  )
}
