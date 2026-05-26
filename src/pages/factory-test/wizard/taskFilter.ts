import { TaskType } from '@/request/taskApi'
import { TaskInfo } from '@/request/taskApi/typings'

/** 入场检测「相关事故」仅展示待认领、待返厂 */
export function filterAccidentTasks(tasks: TaskInfo[]) {
  return tasks.filter((t) => {
    const code = t.status?.code
    return code === TaskType.Pending || code === TaskType.WaitingForReturn
  })
}
