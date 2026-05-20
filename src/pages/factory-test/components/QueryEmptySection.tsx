import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'

interface QueryEmptySectionProps {
  onResetVin: () => void
}

export function QueryEmptySection({ onResetVin }: QueryEmptySectionProps) {
  return (
    <View className='section'>
      <View className='section-title'>查询结果</View>
      <Text>未查询到该车架号下的设备记录。</Text>
      <View className='hint'>
        若确认用户未安装记录仪，可结束本单检测。若现场已装机但仍无记录，需由车主在微信端完成设备绑定后再查询；本页不支持代绑。
      </View>
      <View className='btn-row' style={{ marginTop: 12 }}>
        <Button size='small' fill='outline' onClick={onResetVin}>
          重新输入车架号
        </Button>
      </View>
    </View>
  )
}
