import { CouponBatchStatus } from "@/request/couponApi/typings.d"

export const SuccessCode = 200

export enum Role {
  AfterSale = 1,
  ShopManager = 2,
  Finance = 3
}

export enum CouponType {
  Cash = 1,
  Maintenance = 2,
  Insurance = 3,
  Physical = 4
}

export const COUPON_TYPES = [
  { label: '现金券', value: CouponType.Cash },
  { label: '保养券', value: CouponType.Maintenance },
  { label: '续保券', value: CouponType.Insurance },
  { label: '实物券', value: CouponType.Physical },
]


export const CouponStatusMap = {
  [CouponBatchStatus.AUDITING]: '待审核',
  [CouponBatchStatus.AUDITED]: '审核通过',
  [CouponBatchStatus.REJECTED]: '审核拒绝'
}