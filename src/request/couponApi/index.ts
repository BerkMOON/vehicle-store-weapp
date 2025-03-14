import { ResponseInfoType } from "types/common"
import { getRequest, postRequest } from ".."
import { CouponBatchInfo, CouponBatchParams, CouponInfo, CouponInfoList, CouponParams, CouponStatus, CreateCouponParams } from "./typings"

const prefix = '/api/business/coupon'

export const CouponAPI = {

  /**
   * 创建优惠券
   * POST /api/business/coupon/createCoupon
   * 接口ID：269989577
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-269989577
   */
  createCoupon: (params: CreateCouponParams) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/createCoupon`,
    params
  }),

  /**
   * 优惠券批次列表  
   * GET /api/business/coupon/getCouponBatchList
   * 接口ID：270000764
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-270000764
  */
  getCouponBatchList: (params: CouponBatchParams) => getRequest<ResponseInfoType<CouponBatchInfo>>({
    url: `${prefix}/getCouponBatchList`,
    params
  }),

  /**
   * 优惠券列表
   * GET /api/business/coupon/getCouponList
   * 接口ID：270001352
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-270001352
   */
  getCouponList: (params: CouponParams) => getRequest<ResponseInfoType<CouponInfoList>>({
    url: `${prefix}/getCouponList`,
    params
  }),


  /**
   * 获取优惠券详情
   * GET /api/business/coupon/getCouponInfo
   * 接口ID：270034122
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-270034122
  */
  getCouponInfo: (params: {
    id: number
  }) => getRequest<ResponseInfoType<CouponInfo>>({
    url: `${prefix}/getCouponInfo`,
    params
  }),

  /**
   * 修改优惠券批次状态
   * POST /api/business/coupon/updateCouponBatchStatus
   * 接口ID：270052428
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-270052428
   */
  reviewCouponBatch: (params: {
    batch_no: string
    status: number
    operator: number
    remark?: string
  }) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/updateCouponBatchStatus`,
    params
  }),

  /**
   * 修改优惠券状态
   * POST /api/business/coupon/updateCouponStatus
   * 接口ID：270054469
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-270054469
   */
  updateCouponStatus: (params: {
    id: number
    status: CouponStatus
  }) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/updateCouponStatus`,
    params
  })
} 