import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { TaskInfo } from '@/request/taskApi/typings'

interface StepAccidentsProps {
  tasks: TaskInfo[]
  onGoDetail: (clueId: string) => void
  onReportCollision: () => void
  onNoAccidentComplete: () => void
}

export function StepAccidents({
  tasks,
  onGoDetail,
  onReportCollision,
  onNoAccidentComplete,
}: StepAccidentsProps) {
  return (
    <View className='wizard-step'>
      <View className='wizard-step-title'>相关事故</View>
      <Text className='wizard-step-desc'>
        仅显示待认领、待返厂工单。若无相关事故，可点「未检出事故上报」或「无需上报，完成检测」。
      </Text>

      {tasks.length === 0 ? (
        <Text className='hint' style={{ marginTop: 12 }}>
          暂无待认领或待返厂的相关工单。
        </Text>
      ) : (
        tasks.map((t) => (
          <View key={t.clue_id} className='task-item'>
            <View className='task-row'>
              <Text>工单号</Text>
              <Text>{t.clue_id}</Text>
            </View>
            <View className='task-row'>
              <Text>状态</Text>
              <Text>{t.status?.name}</Text>
            </View>
            <View className='task-actions'>
              <Button size='small' color='#4e54c8' onClick={() => onGoDetail(t.clue_id)}>
                查看/操作
              </Button>
            </View>
          </View>
        ))
      )}

      <Button block fill='outline' onClick={onReportCollision} style={{ marginTop: 16 }}>
        未检出事故上报
      </Button>
      <Button type='primary' block onClick={onNoAccidentComplete} style={{ marginTop: 12 }}>
        无需上报，完成检测
      </Button>
    </View>
  )
}
