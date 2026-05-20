import { View, Text } from '@tarojs/components'
import { DeviceOfflineVersionSummary } from '@/request/entryCheckApi/typings.d'

interface FirmwareSectionProps {
  summaryLoading: boolean
  summary: DeviceOfflineVersionSummary | null
}

/** 与后端 OTA 活跃全量版本首项比对；缺任一侧最新版本号则不判「否」为绝对结论 */
function computeIsLatest(s: DeviceOfflineVersionSummary): 'yes' | 'no' | 'unknown' {
  if (!s.in_company_store) return 'unknown'
  const latFw = (s.latest_cur_version || '').trim()
  const latAlg = (s.latest_alg_version || '').trim()
  if (!latFw && !latAlg) return 'unknown'
  const curFw = (s.cur_version || '').trim()
  const curAlg = (s.alg_version || '').trim()
  const fwMatch = !latFw || curFw === latFw
  const algMatch = !latAlg || curAlg === latAlg
  return fwMatch && algMatch ? 'yes' : 'no'
}

function VersionPair(props: {
  labelCur: string
  labelLatest: string
  current: string
  latest: string
}) {
  const { labelCur, labelLatest, current, latest } = props
  return (
    <View className='fw-pair'>
      <View className='fw-pair-line'>
        <Text className='fw-pair-k'>{labelCur}</Text>
        <Text className='fw-pair-v' selectable>
          {current || '—'}
        </Text>
      </View>
      <View className='fw-pair-line'>
        <Text className='fw-pair-k'>{labelLatest}</Text>
        <Text className='fw-pair-v' selectable>
          {latest || '—'}
        </Text>
      </View>
    </View>
  )
}

export function FirmwareSection({ summaryLoading, summary }: FirmwareSectionProps) {
  const latestLabel = summary ? computeIsLatest(summary) : 'unknown'

  return (
    <View className='section firmware-section'>
      <View className='section-title'>固件版本</View>
      {summaryLoading && (
        <View className='firmware-loading'>
          <Text>正在获取版本信息…</Text>
        </View>
      )}
      {!summaryLoading && summary && (
        <View className='firmware-panel'>
          {!summary.in_company_store ? (
            <View className='version-tip'>本门店下未找到该设备绑定记录，无法比对版本。</View>
          ) : (
            <>
              <View className='fw-status-row'>
                <Text className='fw-status-label'>是否最新版本</Text>
                <Text className={`fw-status-badge fw-latest-${latestLabel}`}>
                  {latestLabel === 'yes'
                    ? '是'
                    : latestLabel === 'no'
                      ? '否'
                      : '无法判断'}
                </Text>
              </View>

              <View className='fw-modules'>
                <View className='fw-module fw-module--firmware'>
                  <Text className='fw-module-title'>固件</Text>
                  <VersionPair
                    labelCur='当前固件版本'
                    labelLatest='最新固件版本'
                    current={summary.cur_version}
                    latest={summary.latest_cur_version}
                  />
                </View>

                <View className='fw-module fw-module--algorithm'>
                  <Text className='fw-module-title'>算法</Text>
                  <VersionPair
                    labelCur='当前算法版本'
                    labelLatest='最新算法版本'
                    current={summary.alg_version}
                    latest={summary.latest_alg_version}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      )}
      {!summaryLoading && !summary && (
        <View className='version-tip'>未获取到版本信息，请稍后重试或确认网络与登录状态。</View>
      )}
    </View>
  )
}
