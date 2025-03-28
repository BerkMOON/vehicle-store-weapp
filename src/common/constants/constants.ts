import { CouponBatchStatus } from "@/request/couponApi/typings.d"

export const SuccessCode = 200
export const WxMapApiKey = 'CPSBZ-IKTWZ-VQYX5-7Z62Q-5FZ45-OBFFG'
export const GdMapApiKey = '95883d933e2f60323c0fa399ad4f6202'

export enum Role {
  Support = 'support',
  SupportDirector = 'supportDirector',
  Admin = 'admin',
  Finance = 'finance',
  // Quality = 'quality'
}

export const ROLES_INFO = {
  [Role.Support]: '外拓专员',
  [Role.SupportDirector]: '售后总监',
  [Role.Admin]: '店长',
  [Role.Finance]: '财务',
  // [Role.Quality]: '质检员'
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