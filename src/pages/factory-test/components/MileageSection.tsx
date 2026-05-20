import { View, Text } from '@tarojs/components'
import { Button, Input } from '@nutui/nutui-react-taro'

interface MileageSectionProps {
  /** 店端设备列表中的当前里程（km），无则展示 — */
  currentMileageKm: number | null | undefined
  mileageInput: string
  onMileageChange: (v: string) => void
  mileageSubmitting: boolean
  onSubmit: () => void
}

function formatCurrentKm(v: number | null | undefined) {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return '—'
  return `${Number(v)} km`
}

export function MileageSection({
  currentMileageKm,
  mileageInput,
  onMileageChange,
  mileageSubmitting,
  onSubmit,
}: MileageSectionProps) {
  return (
    <View className='section mileage-section'>
      <View className='section-title'>里程校对</View>
      <View className='mileage-current-row'>
        <Text className='mileage-current-label'>当前设备里程</Text>
        <Text className='mileage-current-value' selectable>
          {formatCurrentKm(currentMileageKm)}
        </Text>
      </View>
      <Text className='hint' style={{ marginBottom: 8 }}>
        请以仪表盘为准录入最新里程，提交后将同步到店端设备里程。
      </Text>
      <Input
        type='digit'
        placeholder='新里程（km）'
        value={mileageInput}
        onChange={onMileageChange}
      />
      <Button type='primary' block loading={mileageSubmitting} onClick={onSubmit} style={{ marginTop: 12 }}>
        提交更新里程
      </Button>
    </View>
  )
}
