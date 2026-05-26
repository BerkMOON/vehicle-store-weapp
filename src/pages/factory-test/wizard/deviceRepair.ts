import { DeviceOfflineVersionSummary } from '@/request/entryCheckApi/typings.d'

/** 是否非最新固件/算法（不单独展示给师傅） */
export function isFirmwareOutdated(summary: DeviceOfflineVersionSummary): boolean {
  const latFw = (summary.latest_cur_version || '').trim()
  const latAlg = (summary.latest_alg_version || '').trim()
  if (!latFw && !latAlg) return false
  const curFw = (summary.cur_version || '').trim()
  const curAlg = (summary.alg_version || '').trim()
  const fwMatch = !latFw || curFw === latFw
  const algMatch = !latAlg || curAlg === latAlg
  return !(fwMatch && algMatch)
}

/**
 * 合并「失效 + 旧版本」为单一结论：设备需修复。
 * 无本店设备记录时不判需修复。
 */
export function deviceNeedsRepair(
  summary: DeviceOfflineVersionSummary | null,
): boolean {
  if (!summary || !summary.in_company_store) return false
  if (summary.offline_over_n_days) return true
  return isFirmwareOutdated(summary)
}
