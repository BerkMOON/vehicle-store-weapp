import { CouponBatchStatus } from "@/request/couponApi/typings.d"

export const SuccessCode = 200
export const WxMapApiKey = 'CPSBZ-IKTWZ-VQYX5-7Z62Q-5FZ45-OBFFG'
export const GdMapApiKey = '69f9cef535c817b54549ce47311db813'

export enum Role {
  AfterSale = 'support',
  Admin = 'admin',
  Finance = 'finance',
}

export const ROLES_INFO = {
  [Role.AfterSale]: '售后',
  [Role.Admin]: '管理员',
  [Role.Finance]: '财务',
}

export enum CouponType {
  Cash = 1,
  Insurance = 2,
  Maintenance = 3,
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