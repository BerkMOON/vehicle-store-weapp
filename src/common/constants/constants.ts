import { CouponBatchStatus } from "@/request/couponApi/typings.d"

export const SuccessCode = 200
export const WxMapApiKey = 'CPSBZ-IKTWZ-VQYX5-7Z62Q-5FZ45-OBFFG'
export const GdMapApiKey = '95883d933e2f60323c0fa399ad4f6202'

export enum Role {
  Support = 'support',
  SupportDirector = 'support_director',
  Admin = 'admin',
  Finance = 'finance',
  SupportManager = 'customer_service_manager'
}

export const ROLES_INFO = {
  [Role.Support]: '外拓专员',
  [Role.SupportDirector]: '售后总监',
  [Role.SupportManager]: '客服经理',
  [Role.Admin]: '店长',
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

export const LossNameMap = [{
  key: 'sn',
  name: '设备号',
  width: 18
}, {
  key: 'car_model',
  name: '用户车型',
  width: 15
}, {
  key: 'phone',
  name: '手机号',
  width: 13
}, {
  key: 'trigger_time',
  name: '触发时间',
  width: 18
},
{
  name: '触发地点',
  key: (lossInfo) => {
    return lossInfo.nearby_points?.[0].name || '';
  },
  width: 40
}, {
  name: '具体位置',
  key: (lossInfo) => {
    const city = lossInfo.nearby_points?.[0].city || '';
    const district = lossInfo.nearby_points?.[0].district || '';
    const address = lossInfo.nearby_points?.[0].address || '';
    return city + district + address;
  },
  width: 50
}]

export const MileageNameMap = [{
  key: 'store_name',
  name: '门店',
  width: 20
}, {
  key: 'sn',
  name: '设备号',
  width: 18
}, {
  key: 'brand',
  name: '品牌',
  width: 10
}, {
  key: 'car_model',
  name: '用户车型',
  width: 15
}, {
  key: 'mileage',
  name: '用户里程(km)',
  width: 15
}, {
  key: 'phone',
  name: '手机号',
  width: 13
}]