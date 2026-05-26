import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { EntryCheckAPI } from '@/request/entryCheckApi'
import { SuccessCode } from '@/common/constants/constants'
import { normalizeVin } from '../utils'

/** 本地按门店+日期缓存当日已扫车架号（与服务端同日覆盖一致） */
function saveLocalVin(storeId: string | number, vin: string) {
  const date = dayjs().format('YYYY-MM-DD')
  const key = `entry_inspection_vin_${storeId}_${date}`
  let list: string[] = []
  try {
    const raw = Taro.getStorageSync(key)
    list = Array.isArray(raw) ? raw.map(normalizeVin) : []
  } catch {
    list = []
  }
  const idx = list.indexOf(vin)
  if (idx >= 0) list.splice(idx, 1)
  list.unshift(vin)
  Taro.setStorageSync(key, list)
}

/**
 * 上报当日车架号（步骤 1 确认即调用，与设备查询是否成功无关）
 * @returns 服务端是否保存成功
 */
export async function recordVinScan(vin: string): Promise<boolean> {
  const v = normalizeVin(vin)
  if (!v) return false

  const role = Taro.getStorageSync('CURRENT_ROLE_INFO') || {}
  const storeId = role.store_id ?? '0'
  saveLocalVin(storeId, v)

  try {
    const res = await EntryCheckAPI.recordVinScan(v)
    if (res?.response_status?.code === SuccessCode) {
      return true
    }
    console.warn('recordVinScan', res?.response_status?.msg)
    Taro.showToast({ title: res?.response_status?.msg || '车架号留痕失败', icon: 'none' })
    return false
  } catch (e) {
    console.warn('recordVinScan failed, kept local only', e)
    Taro.showToast({ title: '车架号留痕失败，请检查网络', icon: 'none' })
    return false
  }
}

export function getTodayVinScans(storeId?: string | number) {
  const role = Taro.getStorageSync('CURRENT_ROLE_INFO') || {}
  const sid = storeId ?? role.store_id ?? '0'
  const date = dayjs().format('YYYY-MM-DD')
  const key = `entry_inspection_vin_${sid}_${date}`
  try {
    const raw = Taro.getStorageSync(key)
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}
