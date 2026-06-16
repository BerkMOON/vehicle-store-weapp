import { DeviceOfflineVersionSummary } from '@/request/entryCheckApi/typings.d'

/**
 * 从固件版本号提取 `_V` 后 12 位时间戳（YYYYMMDDHHmm），与后端 extractTimestamp 一致。
 * 例：SG30-EDA_firmware_V202601231838 → 202601231838
 */
function extractFirmwareTimestamp(version: string): string | null {
  const trimmed = version.trim()
  const vPos = trimmed.lastIndexOf('_V')
  if (vPos === -1 || vPos + 2 + 12 > trimmed.length) return null

  const timestampPart = trimmed.slice(vPos + 2, vPos + 2 + 12)
  if (!/^\d{12}$/.test(timestampPart)) return null

  const year = Number(timestampPart.slice(0, 4))
  if (year < 2000 || year > 2100) return null

  return timestampPart
}

/** 是否非最新固件（不单独展示给师傅；仅比固件，不比算法） */
export function isFirmwareOutdated(summary: DeviceOfflineVersionSummary): boolean {
  const latFw = (summary.latest_cur_version || '').trim()
  if (!latFw) return false

  const latestTs = extractFirmwareTimestamp(latFw)
  if (!latestTs) return false

  const curFw = (summary.cur_version || '').trim()
  const curTs = extractFirmwareTimestamp(curFw)
  if (!curTs) return true

  // YYYYMMDDHHmm 可直接字符串比较：当前 >= 最新全量 → 正常
  return curTs < latestTs
}

/**
 * 合并「失效 + 旧版本」为单一结论：设备需修复。
 * 无本店设备记录时判定需修复。
 */
export function deviceNeedsRepair(
  summary: DeviceOfflineVersionSummary | null,
): boolean {
  if (!summary || !summary.in_company_store) return true // 无本店设备记录时判定需修复
  if (summary.offline_over_n_days) return true
  return isFirmwareOutdated(summary)
}
