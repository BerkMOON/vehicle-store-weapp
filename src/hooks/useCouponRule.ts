import { CouponInfo } from '@/request/couponApi/typings.d'
import { CouponType } from '@/common/constants/constants'

export function useCouponRule() {
  const getRuleContent = (detail: CouponInfo) => {
    try {
      const rule = JSON.parse(detail.rule)
      switch (detail.type) {
        case CouponType.Cash:
          return `${rule.cash}元`
        case CouponType.Maintenance:
          return `保养信息：${rule.maintenance}`
        case CouponType.Insurance:
          return `续保信息：${rule.insurance}`
        case CouponType.Physical:
          return `实物信息：${rule.physical}`
        default:
          return '未知类型'
      }
    } catch (error) {
      return '规则解析失败'
    }
  }

  return { getRuleContent }
}