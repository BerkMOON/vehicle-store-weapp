/** 店端设备信息更新（入场检测「绑定」：向当前门店写入 VIN + SN 等） POST /api/business/device/update */
export interface EntryBindRequest {
  sn: string
  vin: string
  phone?: string
  brand?: string
  car_model?: string
}

/** 里程校对提交 */
export interface EntryMileageRequest {
  vin: string
  sn: string
  /** 工程师录入的最新里程（km） */
  mileage: number
  /** 校对提交时间，ISO 字符串；不传则由服务端取当前时间 */
  confirm_time?: string
}

/** 失效设备预判（事故时间 + 设备） */
export interface EntryInvalidCheckRequest {
  vin: string
  sn: string
  accident_time: string
}

export interface EntryInvalidCheckResponse {
  /** 是否为失效设备（旧版本等），为 true 时不再要求拍照 */
  is_invalid_device: boolean
  /** 判定说明（可选） */
  reason?: string
  /** 规则版本（可选，便于联调） */
  rule_version?: string
}

/** 通用：仅按设备查询是否失效（不要求事故时间） */
export interface EntryInvalidDeviceQueryRequest {
  vin: string
  sn: string
}

export type EntryInvalidDeviceQueryResponse = EntryInvalidCheckResponse

/** 与后端 `SubmitEntryCollisionReportReq` 一致：POST /api/business/entry-check/collision-report */
export interface SubmitEntryCollisionReportRequest {
  vin: string
  sn: string
  accident_time: string
  engineer_name: string
  is_invalid_device: boolean
  /** 非失效设备时必填；失效设备可传空字符串 */
  accident_photo_url?: string
}

/** @deprecated 使用 SubmitEntryCollisionReportRequest */
export type EntryCollisionReportRequest = SubmitEntryCollisionReportRequest

/** 店端 GET /api/business/device/unused/offlineVersionSummary（与后端 DeviceOfflineVersionSummary 一致） */
export interface DeviceOfflineVersionSummary {
  sn: string
  in_company_store: boolean
  last_status_mtime: string
  /** 与 unused/list 的 before_days 阈值一致：mtime 早于阈值则为 true */
  offline_over_n_days: boolean
  before_days: number
  cur_version: string
  alg_version: string
  latest_cur_version: string
  latest_alg_version: string
}

/**
 * 当日车架号留痕
 * POST /api/business/entry-check/inspection/record
 */
export interface RecordEntryInspectionVinRequest {
  vin: string
}

/** @deprecated 使用 RecordEntryInspectionVinRequest */
export type RecordInspectionRequest = RecordEntryInspectionVinRequest

/** 管理端 GET /api/admin/device/entry-inspection-log/list */
export interface EntryInspectionLogListItem {
  id: number
  company_id: number
  store_id: number
  business_user_id: number
  vin: string
  ctime: string
  mtime: string
}

/** 设备固件版本信息（与店端 GET /api/business/device/getDeviceVersion 一致） */
export interface EntryVersionInfo {
  sn: string
  device_id: string
  cur_version: string
  alg_version: string
  create_time: string
  modify_time: string
}
