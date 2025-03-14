import { View } from '@tarojs/components'
import { CouponInfo } from '@/request/couponApi/typings.d'
import { COUPON_TYPES, CouponType } from '@/common/constants/constants'

interface CouponDetailsProps {
  details: CouponInfo[]
  getRuleContent: (detail: CouponInfo) => string
}

export default function CouponDetails({ details, getRuleContent }: CouponDetailsProps) {
  return (
    <View className='coupon-details'>
      {details.map((detail, index) => (
        <View key={index} className='detail-item'>
          <View className='detail-header'>
            <View className='detail-type'>
              {COUPON_TYPES.find(t => t.value === detail.type)?.label}
            </View>
            {detail.type === CouponType.Cash && (
              <View className='detail-value cash'>{getRuleContent(detail)}</View>
            )}
          </View>
          {detail.type !== CouponType.Cash && (
            <View className="detail-rule">{getRuleContent(detail)}</View>
          )}
          <View className='detail-validity'>
            <View>开始时间：{detail.valid_start}</View>
            <View>结束时间：{detail.valid_end}</View>
          </View>
        </View>
      ))}
    </View>
  )
}