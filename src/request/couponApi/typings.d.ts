import { CouponType } from "@/common/constants/constants"
import { PageInfo } from "types/common"

export interface CreateCouponParams {
  open_id: string // 用户openid
  coupon_list: CreateCoupon[] // 优惠券列表
}

export interface CreateCoupon {
  valid_start: string // 有效期开始时间
  valid_end: string // 有效期结束时间
  type: number // 优惠券类型
  cash?: number // 优惠券金额
  maintenance?: string // 保养项目
  insurance?: string // 续保项目
  physical?: string // 实物项目
  description?: string // 使用说明
}

export interface CouponBatchParams {
  batch_no?: string // 批次号
  status?: string // 状态
  creator?: string // 创建人
  operator?: string // 操作人
  page?: number // 页码
  limit?: number // 每页数量
}

export interface CouponParams {
  batch_no?: string // 批次号
  status?: string // 状态
  open_id?: string // 用户openid
}

export interface CouponBatch {
  batch_no: string // 批次号
  status: CouponBatchStatus // 状态
  creator: string // 创建人
  operator: string // 操作人
  coupon_count: number // 优惠券数量
  company_Id: number,
  store_Id: number,
  remark: string,
}

export interface CouponBatchInfo {
  list: CouponBatch[]
  meta: PageInfo
}

export interface CouponInfo {
  id: number // 优惠券id
  batch_no: string // 批次号
  open_id: string // 用户openid
  status: {
    code: CouponStatus,
    name: string
  } // 状态
  type: CouponType // 优惠券类型
  rule: string // 规则
  valid_start: string // 有效期开始时间
  valid_end: string // 有效期结束时间
}

export interface CouponInfoList {
  list: CouponInfo[]
  meta: PageInfo
}

export enum CouponStatus {
  UNUSED = 2,
  USED = 3,
  EXPIRED = 4
}

export enum CouponBatchStatus {
  AUDITING = 1,
  AUDITED = 2,
  REJECTED = 3
}