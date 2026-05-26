import { View, Text } from '@tarojs/components'
import { Button, Input } from '@nutui/nutui-react-taro'

interface StepMileageProps {
  vin: string
  mileageInput: string
  onMileageChange: (v: string) => void
  submitting: boolean
  onSubmit: () => void
  skipDeviceSteps?: boolean
}

export function StepMileage({
  vin,
  mileageInput,
  onMileageChange,
  submitting,
  onSubmit,
  skipDeviceSteps,
}: StepMileageProps) {
  return (
    <View className='wizard-step'>
      <View className='wizard-step-title'>里程更新</View>
      <Text className='wizard-step-desc'>车架号：{vin}</Text>
      {skipDeviceSteps && (
        <Text className='hint' style={{ marginTop: 8 }}>
          已选择「没有易达安设备」，请仍录入当前仪表盘里程以便留档。
        </Text>
      )}
      <Text className='hint' style={{ marginTop: 8 }}>
        请以实车仪表盘为准录入最新里程，不展示系统上报里程。
      </Text>
      <View className='field' style={{ marginTop: 16 }}>
        <Text className='field-label'>最新里程（km）</Text>
        <Input
          type='digit'
          placeholder='请输入里程'
          value={mileageInput}
          onChange={onMileageChange}
        />
      </View>
      <Button type='primary' block loading={submitting} onClick={onSubmit} style={{ marginTop: 20 }}>
        更新完成，下一步
      </Button>
    </View>
  )
}
