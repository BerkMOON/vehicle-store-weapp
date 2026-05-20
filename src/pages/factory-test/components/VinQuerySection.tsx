import { View, Text } from '@tarojs/components'
import { Button, Input } from '@nutui/nutui-react-taro'
import { Camera } from '@nutui/icons-react-taro'

interface VinQuerySectionProps {
  vinInput: string
  onVinChange: (v: string) => void
  queryLoading: boolean
  onQuery: () => void
  onOcr: () => void
}

export function VinQuerySection({
  vinInput,
  onVinChange,
  queryLoading,
  onQuery,
  onOcr,
}: VinQuerySectionProps) {
  return (
    <View className='section'>
      <View className='section-title'>车架号（VIN）</View>
      <View className='vin-row'>
        <Input
          placeholder='17位车架号'
          value={vinInput}
          onChange={onVinChange}
          // maxLength={17}
        />
      </View>
      <View className='btn-row'>
        <Button size='small' fill='outline' icon={<Camera />} onClick={onOcr}>
          拍照识别
        </Button>
        <Button size='small' type='primary' loading={queryLoading} onClick={onQuery}>
          查询设备
        </Button>
      </View>
      <Text className='hint'>
        支持手动输入或拍照识别车架号；不向师傅展示系统上报里程。
      </Text>
    </View>
  )
}
