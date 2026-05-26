import { View, Text } from '@tarojs/components'
import { WizardStepId, WIZARD_STEP_LABELS, getProgressSteps } from '../../wizard/types'
import type { DevicePath } from '../../wizard/types'

interface WizardProgressProps {
  current: WizardStepId
  devicePath?: DevicePath | null
}

export function WizardProgress({ current, devicePath = null }: WizardProgressProps) {
  const steps = getProgressSteps(devicePath)
  const idx = steps.indexOf(current)
  const currentIdx = idx >= 0 ? idx : 0
  const total = steps.length
  const percent = Math.round(((currentIdx + 1) / total) * 100)

  return (
    <View className='wizard-progress'>
      <View className='wizard-progress-bar'>
        <View className='wizard-progress-fill' style={{ width: `${percent}%` }} />
      </View>
      <Text className='wizard-progress-text'>
        步骤 {currentIdx + 1}/{total} · {WIZARD_STEP_LABELS[current]}
      </Text>
    </View>
  )
}
