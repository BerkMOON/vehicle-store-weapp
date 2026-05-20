import { View, Text } from '@tarojs/components'
import { DeviceList } from '@/request/deviceApi/typings.d'

interface CurrentDeviceCardProps {
  device: DeviceList
}

export function CurrentDeviceCard({ device }: CurrentDeviceCardProps) {
  return (
    <View className='section device-card'>
      <View className='section-title'>当前设备</View>
      <View className='row'>
        <Text className='label'>SN</Text>
        <Text className='value'>{device.sn}</Text>
      </View>
      <View className='row'>
        <Text className='label'>状态</Text>
        <Text className='value'>{device.status?.name}</Text>
      </View>
      <View className='row'>
        <Text className='label'>车型</Text>
        <Text className='value'>{device.car_model || '-'}</Text>
      </View>
    </View>
  )
}
