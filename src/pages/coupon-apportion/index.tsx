import { View } from '@tarojs/components'
import { useRef, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Cell } from '@nutui/nutui-react-taro'
import { Plus } from '@nutui/icons-react-taro'
import GeneralPage from '@/components/GeneralPage'
import ScrollableTabList from '@/components/ScrollableTabList'
import { CouponAPI } from '@/request/couponApi'
import { CouponBatch } from '@/request/couponApi/typings.d'
import CouponDetails from './components/CouponDetails'
import { useCouponRule } from '@/hooks/useCouponRule'
import { useCouponDetails } from '@/hooks/useCouponDetails'
import './index.scss'

const tabs = [
  { title: '待审核', value: '1' },
  { title: '已通过', value: '2' },
  { title: '已拒绝', value: '3' },
]

export default function CouponApportion() {
  const [activeTab, setActiveTab] = useState('1')
  const { getRuleContent } = useCouponRule()
  const { expandedBatchNo, couponDetails, handleExpand } = useCouponDetails()
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

  const renderItem = (coupon: CouponBatch) => (
    <View key={coupon.batch_no} className='coupon-item'>
      <Cell
        title={
          <View className='cell-title'>
            <View className='batch-no'>审核单号：{coupon.batch_no}</View>
          </View>
        }
        description={
          <View className='coupon-info'>
            <View className='count-tag'>优惠券数量：{coupon.coupon_count}</View>
            <View className='description'>备注：{coupon.remark || '-'}</View>
          </View>
        }
        onClick={() => handleExpand(coupon.batch_no)}
        extra={
          <View className={`arrow ${expandedBatchNo === coupon.batch_no ? 'expanded' : ''}`}>
            ›
          </View>
        }
      />
      {expandedBatchNo === coupon.batch_no && (
        <CouponDetails details={couponDetails} getRuleContent={getRuleContent} />
      )}
    </View>
  )

  const navigateToGenerate = () => {
    Taro.navigateTo({ url: '/pages/coupon-generate/index' })
  }

  useDidShow(() => {
    // 调用组件的刷新方法
    scrollableTabRef.current?.refresh()
  })

  return (
    <GeneralPage>
      <View className='coupon-apportion'>
        <View className='header'>
          <View className='title'>优惠券发放</View>
          <Button color="#4e54c8" icon={<Plus />} onClick={navigateToGenerate}>
            新建优惠券
          </Button>
        </View>

        <View className='content'>
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
      </View>
    </GeneralPage>
  )
}