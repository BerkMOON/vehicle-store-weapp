import { ResponseInfoType } from 'types/common'
import { getRequest, postRequest } from '..'
import {
  EntryBindRequest,
  SubmitEntryCollisionReportRequest,
  EntryInvalidCheckResponse,
  EntryInvalidDeviceQueryRequest,
  EntryMileageRequest,
  DeviceOfflineVersionSummary,
  EntryVersionInfo,
} from './typings.d'

const entryPrefix = TARO_APP_API_BASE_URL + '/api/business/entry-check'
const devicePrefix = TARO_APP_API_BASE_URL + '/api/business/device'

/** 入场检测相关接口（路径以后端实际为准，可联调调整） */
export const EntryCheckAPI = {
  /**
   * 设备绑定（写入店端设备信息）
   * POST /api/business/device/update — 与店端 `UpdateBusinessDeviceInfo` 一致，body：`sn`（必填）、`vin`、`phone`、`brand`、`car_model`
   */
  bindDevice: (params: EntryBindRequest) =>
    postRequest<ResponseInfoType<null>>({
      url: `${devicePrefix}/update`,
      params,
    }),

  /**
   * 里程校对提交
   * POST /api/business/entry-check/mileage
   */
  submitMileage: (params: EntryMileageRequest) =>
    postRequest<ResponseInfoType<null>>({
      url: `${entryPrefix}/mileage`,
      params,
    }),

  /**
   * 通用：查询设备是否为失效设备（不要求事故时间）
   * POST /api/business/entry-check/invalid-device
   */
  queryInvalidDevice: (params: EntryInvalidDeviceQueryRequest) =>
    postRequest<ResponseInfoType<EntryInvalidCheckResponse>>({
      url: `${entryPrefix}/invalid-device`,
      params,
    }),

  /**
   * 碰撞线索上报（店端已实现）
   * POST /api/business/entry-check/collision-report
   */
  submitEntryCollisionReport: (params: SubmitEntryCollisionReportRequest) =>
    postRequest<ResponseInfoType<null>>({
      url: `${entryPrefix}/collision-report`,
      params,
    }),

  /**
   * 单 SN：未上线天数判定 + 当前/OTA 最新版本（与店端 unused 列表、未升级列表同源）
   * GET /api/business/device/unused/offlineVersionSummary?sn=&before_days=10
   */
  getOfflineVersionSummary: (params: { sn: string; before_days?: number }) =>
    getRequest<ResponseInfoType<DeviceOfflineVersionSummary>>({
      url: `${devicePrefix}/unused/offlineVersionSummary`,
      params: {
        sn: params.sn,
        ...(params.before_days != null && params.before_days > 0
          ? { before_days: params.before_days }
          : {}),
      },
    }),

  /**
   * 固件版本信息（按 SN 查询设备记录上的版本）
   * GET /api/business/device/getDeviceVersion?sn=
   */
  getVersionInfo: (params: { vin: string; sn: string }) =>
    getRequest<ResponseInfoType<EntryVersionInfo>>({
      url: `${devicePrefix}/getDeviceVersion`,
      params: { sn: params.sn },
    }),
}
