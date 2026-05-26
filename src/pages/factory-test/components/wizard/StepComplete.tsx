import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'

interface StepCompleteProps {
  vin: string
  summaryLines: string[]
  onRestart: () => void
}

export function StepComplete({ vin, summaryLines, onRestart }: StepCompleteProps) {
  return (
    <View className='wizard-step wizard-step--complete'>
      <View className='complete-ring'>
        <Text className='complete-percent'>100%</Text>
      </View>
      <View className='wizard-step-title' style={{ textAlign: 'center' }}>
        入场检测完成
      </View>
      <Text className='wizard-step-desc' style={{ textAlign: 'center' }}>
        车架号 {vin}
      </Text>
      <View className='complete-summary'>
        {summaryLines.map((line) => (
          <Text key={line} className='complete-summary-line'>
            {line}
          </Text>
        ))}
      </View>
      <Button type='primary' block onClick={onRestart} style={{ marginTop: 24 }}>
        再检一台
      </Button>
    </View>
  )
}
