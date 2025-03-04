import { ResponseInfoType } from "types/common"
import { getRequest, postRequest } from ".."
import { CouponBatch, CouponBatchInfo, CouponBatchParams, CouponInfoList, CouponParams, CouponStatus, CreateCouponParams } from "./typings"

const prefix = 'http://127.0.0.1:8990/api/business/wx'

export const CouponAPI = {

  /**
   *  获取用户信息
   *  GET /api/consumer/wx/getSelfInfo
   *  接口ID：259941820
   *  接口地址：https://app.apifox.com/link/project/5846841/apis/api-259941820
   */
  createCoupon: (params: CreateCouponParams) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/createCoupon`,
    params
  }),

  /**
  *  获取用户信息
  *  GET /api/consumer/wx/getSelfInfo
  *  接口ID：259941820
  *  接口地址：https://app.apifox.com/link/project/5846841/apis/api-259941820
  */
  getCouponBatchList: (params: CouponBatchParams) => getRequest<ResponseInfoType<CouponBatchInfo>>({
    url: `${prefix}/getCouponBatchList`,
    params
  }),

  getCouponList: (params: CouponParams) => getRequest<ResponseInfoType<CouponInfoList>>({
    url: `${prefix}/getCouponList`,
    params
  }),

  reviewCouponBatch: (params: {
    batch_no: string
    status: number
    operator: number
    remark?: string
  }) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/updateCouponBatchStatus`,
    params
  }),

  updateCouponStatus: (params: {
    id: number
    status: CouponStatus
  }) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/updateCouponStatus`,
    params
  })
} 