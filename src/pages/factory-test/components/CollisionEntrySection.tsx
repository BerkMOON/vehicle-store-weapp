import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'

interface CollisionEntrySectionProps {
  onOpenReport: () => void
}

export function CollisionEntrySection({ onOpenReport }: CollisionEntrySectionProps) {
  return (
    <View className='section'>
      <View className='section-title'>碰撞线索</View>
      <Text className='hint'>业绩与现金奖励由后台统计发放，本页仅采集上报。</Text>
      <Button type='primary' block onClick={onOpenReport} style={{ marginTop: 12 }}>
        上报碰撞
      </Button>
    </View>
  )
}
