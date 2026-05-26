import { DeviceList } from '@/request/deviceApi/typings.d'
import { DeviceOfflineVersionSummary } from '@/request/entryCheckApi/typings.d'
import { TaskInfo } from '@/request/taskApi/typings'

/** 向导步骤（展示序号与 PRD 对齐，bind 为条件步骤） */
export type WizardStepId =
  | 'vin'
  | 'device_choice'
  | 'bind'
  | 'repair'
  | 'mileage'
  | 'accidents'
  | 'complete'

export type DevicePath = 'no_device' | 'bound' | 'bound_after_bind'

export interface WizardContext {
  vin: string
  vinInput: string
  devices: DeviceList[]
  primaryDevice: DeviceList | null
  deviceSummary: DeviceOfflineVersionSummary | null
  devicePath: DevicePath | null
  bindSn: string
  repairAcknowledged: boolean
  mileageDone: boolean
  collisionReported: boolean
  noAccidentDeclared: boolean
  tasks: TaskInfo[]
}

export const WIZARD_STEP_LABELS: Record<WizardStepId, string> = {
  vin: '拍车架号',
  device_choice: '设备情况',
  bind: '补绑定',
  repair: '设备检测',
  mileage: '里程更新',
  accidents: '相关事故',
  complete: '完成',
}

/** 主路径步骤（用于进度条，不含条件步骤 bind） */
export const MAIN_PROGRESS_STEPS: WizardStepId[] = [
  'vin',
  'device_choice',
  'repair',
  'mileage',
  'accidents',
  'complete',
]

/** 无易达安设备：跳过绑定、检测、里程、事故，直接完成 */
export const NO_DEVICE_PROGRESS_STEPS: WizardStepId[] = [
  'vin',
  'device_choice',
  'complete',
]

export function getProgressSteps(devicePath: DevicePath | null): WizardStepId[] {
  return devicePath === 'no_device' ? NO_DEVICE_PROGRESS_STEPS : MAIN_PROGRESS_STEPS
}
