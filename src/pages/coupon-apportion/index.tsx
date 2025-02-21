import { View } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { Cell, Button, Empty, Toast } from '@nutui/nutui-react-taro'
import { Plus } from '@nutui/icons-react-taro'
import './index.less'
import GeneralPage from '@/components/GeneralPage'

interface CouponInfo {
  id: string
  name: string
  amount: number
  validDays: number
  description: string
  remainingCount: number
  totalCount: number
}

export default function CouponApportion() {
  const [coupons, setCoupons] = useState<CouponInfo[]>([])
  const [loading, setLoading] = useState(false)

  // 获取优惠券列表
  const fetchCoupons = async () => {
    setLoading(true)
    try {
      // 替换为实际的API调用
      const res = await fetch('/api/coupons')
      const data = await res.json()
      setCoupons(data)
    } catch (error) {
      Taro.showToast({
        title: '获取优惠券列表失败'
      })
    } finally {
      setLoading(false)
    }
  }

  // 发放优惠券
  const handleApportion = async (couponId: string) => {
    try {
      // 替换为实际的API调用
      await fetch(`/api/coupons/${couponId}/apportion`, {
        method: 'POST'
      })
      Taro.showToast({
        title: '发放成功'
      })
      fetchCoupons()
    } catch (error) {
      Taro.showToast({
        title: '发放失败'
      })
    }
  }

  // 跳转到优惠券生成页面
  const navigateToGenerate = () => {
    Taro.navigateTo({
      url: '/pages/coupon-generate/index'
    })
  }

  return (
    <GeneralPage>
      <View className='coupon-apportion'>
        <View className='header'>
          <Button
            type='primary'
            icon={<Plus />}
            onClick={navigateToGenerate}
          >
            新建优惠券
          </Button>
        </View>

        {coupons.length === 0 ? (
          <Empty description='暂无优惠券' />
        ) : (
          <Cell.Group>
            {coupons.map(coupon => (
              <Cell
                key={coupon.id}
                title={coupon.name}
                description={`剩余数量: ${coupon.remainingCount}/${coupon.totalCount}`}
                extra={
                  <Button
                    size='small'
                    type='primary'
                    disabled={coupon.remainingCount === 0}
                    onClick={() => handleApportion(coupon.id)}
                  >
                    发放
                  </Button>
                }
              >
                <View className='coupon-info'>
                  <View className='amount'>¥{coupon.amount}</View>
                  <View className='valid-days'>有效期{coupon.validDays}天</View>
                  {coupon.description && (
                    <View className='description'>{coupon.description}</View>
                  )}
                </View>
              </Cell>
            ))}
          </Cell.Group>
        )}
      </View>
    </GeneralPage>
  )
}