import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { TaskInfo } from '@/request/taskApi/typings'

interface TaskListSectionProps {
  tasks: TaskInfo[]
  onGoDetail: (clueId: string) => void
}

export function TaskListSection({ tasks, onGoDetail }: TaskListSectionProps) {
  return (
    <View className='section'>
      <View className='section-title'>相关工单</View>
      {tasks.length === 0 && (
        <Text className='hint'>
          暂无与本车车架号匹配的工单（若后端 list 未支持 vin 参数，需在接口联调后生效）。
        </Text>
      )}
      {tasks.map((t) => (
        <View key={t.clue_id} className='task-item'>
          <View className='task-row'>
            <Text>工单号</Text>
            <Text>{t.clue_id}</Text>
          </View>
          <View className='task-row'>
            <Text>状态</Text>
            <Text>{t.status?.name}</Text>
          </View>
          <View className='task-row'>
            <Text>上报时间</Text>
            <Text>{t.report_time}</Text>
          </View>
          <View className='task-actions'>
            <Button size='small' color='#4e54c8' onClick={() => onGoDetail(t.clue_id)}>
              查看/操作
            </Button>
          </View>
        </View>
      ))}
    </View>
  )
}
