import { ResponseInfoType } from "types/common"
import {
  DeviceRequest,
  DeviceResponse,
  LossRequest,
  LossResponse,
  MileageReminderRequest,
  MileageReminderResponse,
  StatResponse,
} from './typings.d'
import { getRequest } from ".."

const prefix = TARO_APP_API_BASE_URL + '/api/business/device'

export const DeviceAPI = {
  /**
   * b端设备信息统计
   * GET /api/business/device/stat
   * 接口ID：295868798
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-295868798
   */
  stat: () => getRequest<ResponseInfoType<StatResponse>>({
    url: `${prefix}/stat`,
  }),


  /**
   * b端设备列表
   * GET /api/business/device/list
   * 接口ID：282433158
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-282433158
   */
  list: (params: DeviceRequest) => getRequest<ResponseInfoType<DeviceResponse>>({
    url: `${prefix}/list`,
    params
  }),


  /**
   * 流失提醒-店端
   * GET /api/business/device/getLossNotifications
   * 接口ID：314228471
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-314228471
   */
  getLossNotifications: (params: LossRequest) => getRequest<ResponseInfoType<LossResponse>>({
    url: `${prefix}/getLossNotifications`,
    params
  }),

  /**
   * b端里程列表
   * GET /api/business/device/mileage/list
   * 接口ID：345524847
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-345524847
   */
  getMileageList: (params: MileageReminderRequest) => getRequest<ResponseInfoType<MileageReminderResponse>>({
    url: `${prefix}/mileage/list`,
    params
  }),
}
