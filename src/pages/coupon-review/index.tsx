import { View } from '@tarojs/components'
import { useRef, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Cell } from '@nutui/nutui-react-taro'
import GeneralPage from '@/components/GeneralPage'
import ScrollableTabList from '@/components/ScrollableTabList'
import { CouponAPI } from '@/request/couponApi'
import { CouponBatch, CouponBatchStatus } from '@/request/couponApi/typings.d'
import './index.scss'

const tabs = [
  { title: '待审核', value: '1' },
  { title: '已通过', value: '2' },
  { title: '已拒绝', value: '3' },
]

export default function CouponReview() {
  const [activeTab, setActiveTab] = useState('1')
  const scrollableTabRef = useRef<any>(null)

  const fetchData = async ({ status, page }: { status: string; page: number }) => {
    const res = await CouponAPI.getCouponBatchList({
      creator: '1',
      status,
      page,
      limit: 10
    })
    return res?.data.list || []
  }

  const navigateToDetail = (batch: CouponBatch) => {
    Taro.navigateTo({
      url: `/pages/coupon-review/detail/index?batch_no=${batch.batch_no}`
    })
  }

  const renderItem = (coupon: CouponBatch) => (
    <View key={coupon.batch_no} className='coupon-item'>
      <Cell
        title={
          <View className='cell-header'>
            <View className='batch-no'>审核单号：{coupon.batch_no}</View>
          </View>
        }
        description={
          <View className='coupon-info'>
            <View className='count-tag'>数量：{coupon.coupon_count}</View>
            <View className='creator'>创建人：{coupon.creator}</View>
            <View className='remark'>备注：{coupon.remark || '-'}</View>
          </View>
        }
        extra={
          <Button
            size='small'
            color="#4e54c8"
            className='review-button'
            onClick={(e) => {
              e.stopPropagation()
              navigateToDetail(coupon)
            }}
          >
            {coupon.status === CouponBatchStatus.AUDITING ? '审核' : '查看'}
          </Button>
        }
      />
    </View>
  )

  useDidShow(() => {
    // 调用组件的刷新方法
    scrollableTabRef.current?.refresh()
  })

  return (
    <GeneralPage>
      <View className='coupon-review'>
        <ScrollableTabList
          ref={scrollableTabRef}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          fetchData={fetchData}
          renderItem={renderItem}
          emptyText='暂无优惠券'
          className="fixed-tabs"
          autoLoad={false}
        />
      </View>
    </GeneralPage>
  )
}