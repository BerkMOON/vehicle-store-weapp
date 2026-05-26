import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { DeviceList } from '@/request/deviceApi/typings.d'
import { hasVinLinkedDevice } from '../../deviceUtils'

interface StepDeviceChoiceProps {
  vin: string
  devices: DeviceList[]
  onNoDevice: () => void
  onNeedBind: () => void
  onAlreadyBound: () => void
}

export function StepDeviceChoice({
  vin,
  devices,
  onNoDevice,
  onNeedBind,
  onAlreadyBound,
}: StepDeviceChoiceProps) {
  const vinLinked = hasVinLinkedDevice(devices, vin)

  return (
    <View className='wizard-step'>
      <View className='wizard-step-title'>设备情况</View>
      <Text className='wizard-step-desc'>车架号：{vin}</Text>

      {!vinLinked && (
        <View className='warn' style={{ marginTop: 12 }}>
          当前车架号尚未绑定到易达安设备，请录入设备 SN 完成绑定
        </View>
      )}
      {vinLinked && (
        <View className='success' style={{ marginTop: 12 }}>
          车架号已绑定设备，可直接进行设备检测。
        </View>
      )}

      <View className='wizard-choice-list'>
        {!devices?.length && (
          <Button block fill='outline' className='wizard-choice-btn' onClick={onNoDevice}>
            没有易达安设备（直接完成）
          </Button>
        )}
        {!vinLinked && (
          <Button block type='primary' className='wizard-choice-btn' onClick={onNeedBind}>
            有易达安设备，绑定车架号到设备
          </Button>
        )}
        {vinLinked && (
          <Button block type='primary' className='wizard-choice-btn' onClick={onAlreadyBound}>
            继续检测
          </Button>
        )}
      </View>
    </View>
  )
}
