import { DeviceList } from '@/request/deviceApi/typings.d'

/** 列表项是否已绑定（与店端设备列表状态文案对齐） */
export function isBoundDevice(d: DeviceList) {
  const n = d.status?.name ?? ''
  if (n.includes('未绑定')) return false
  return n.includes('绑定')
}

export function pickPrimaryDevice(devices: DeviceList[]) {
  if (!devices.length) return null
  const bound = devices.find(isBoundDevice)
  return bound || devices[0]
}
