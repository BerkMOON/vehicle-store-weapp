import { View, Text } from '@tarojs/components'
import { DeviceOfflineVersionSummary } from '@/request/entryCheckApi/typings.d'

const OFFLINE_DAYS = 10

interface InvalidDeviceQuerySectionProps {
  sn: string
  summary: DeviceOfflineVersionSummary | null
  summaryLoading: boolean
}

/** 未上线超过 OFFLINE_DAYS 天视为失效设备（与店端 offlineVersionSummary 的 offline_over_n_days 一致） */
export function InvalidDeviceQuerySection({
  sn,
  summary,
  summaryLoading,
}: InvalidDeviceQuerySectionProps) {
  const invalidByOffline =
    summary && summary.in_company_store && summary.offline_over_n_days

  return (
    <View className='section invalid-device-section'>
      <View className='section-title'>失效设备查询</View>
      <View className='hint' style={{ marginBottom: 10 }}>
        规则：当前门店下设备若已超过 {OFFLINE_DAYS} 天未上线（与店端流失设备判定一致），则视为失效设备。
      </View>
      {summaryLoading && (
        <View className='hint'>加载中…</View>
      )}
      {!summaryLoading && summary && (
        <View
          className={`invalid-device-result ${invalidByOffline ? 'is-invalid' : 'is-valid'}`}
        >
          {!summary.in_company_store ? (
            <Text className='invalid-device-result-title'>
              本门店下无该 SN（{sn}）的店端设备记录，无法判定。
            </Text>
          ) : (
            <>
              <Text className='invalid-device-result-title'>
                {invalidByOffline ? '判定：失效设备' : '判定：非失效设备'}
              </Text>
              {summary.last_status_mtime ? (
                <Text className='invalid-device-reason' selectable>
                  最后上线时间：{summary.last_status_mtime}
                </Text>
              ) : (
                <Text className='invalid-device-reason'>暂无最后上线时间记录。</Text>
              )}
            </>
          )}
        </View>
      )}
      {!summaryLoading && !summary && (
        <View className='hint'>未获取到判定数据，请重新查询车架号后重试。</View>
      )}
    </View>
  )
}
