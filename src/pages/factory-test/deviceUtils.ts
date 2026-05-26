import { DeviceList } from '@/request/deviceApi/typings.d'
import { normalizeVin } from './utils'

/**
 * 车架号是否已绑定到该设备（店端 device 表 VIN 字段）。
 * 与 status（init/bound 等店端状态、安装上报）无关，工程师不做微信绑定。
 */
export function isVinLinkedToDevice(d: DeviceList, targetVin: string) {
  const linked = normalizeVin(d.vin || '')
  const target = normalizeVin(targetVin)
  return !!target && !!linked && linked === target
}

export function hasVinLinkedDevice(devices: DeviceList[], targetVin: string) {
  return devices.some((d) => isVinLinkedToDevice(d, targetVin))
}

export function pickPrimaryDevice(devices: DeviceList[], targetVin?: string) {
  if (!devices.length) return null
  if (targetVin) {
    const linked = devices.find((d) => isVinLinkedToDevice(d, targetVin))
    if (linked) return linked
  }
  return devices[0]
}
