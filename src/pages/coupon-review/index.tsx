import { View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { Button, Cell, Empty, Skeleton, Tabs } from '@nutui/nutui-react-taro'
import GeneralPage from '@/components/GeneralPage'
import { CouponAPI } from '@/request/couponApi'
import { CouponBatch, CouponBatchStatus } from '@/request/couponApi/typings.d'
import './index.scss'

const tabs = [
  { title: '待审核', value: '1' },
  { title: '已通过', value: '2' },
  { title: '已拒绝', value: '3' },
]

export default function CouponReview() {
  const [coupons, setCoupons] = useState<CouponBatch[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('1')

  // 获取优惠券列表
  const fetchCoupons = async (status: string) => {
    setLoading(true)
    try {
      const res = await CouponAPI.getCouponBatchList({
        creator: '1',
        status
      })
      setCoupons(res?.data.list || [])
    } catch (error) {
      Taro.showToast({
        title: '获取优惠券列表失败'
      })
    } finally {
      setLoading(false)
    }
  }

  // 修改 Tab 切换时清空缓存
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    fetchCoupons(value)
  }

  const navigateToDetail = (batch: CouponBatch) => {
    Taro.navigateTo({
      url: `/pages/coupon-review/detail/index?batch_no=${batch.batch_no}`
    })
  }

  useEffect(() => {
    fetchCoupons(activeTab)
  }, [])

  useDidShow(() => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    // @ts-ignore
    if (currentPage.data?.needRefresh) {
      fetchCoupons(activeTab)
      // @ts-ignore
      currentPage.setData({
        needRefresh: false
      })
    }
  })

  return (
    <GeneralPage>
      <View className='coupon-review'>
        <Tabs value={activeTab} onChange={handleTabChange}>
          {tabs.map(tab => (
            <Tabs.TabPane key={tab.value} title={tab.title} value={tab.value}>
              <View style={{ background: '#fff', padding: '12px' }}>
                <Skeleton rows={10} title animated visible={!loading}>
                  {coupons.length === 0 ? (
                    <Empty description='暂无优惠券' />
                  ) : (
                    <Cell.Group>
                      {coupons.map(coupon => (
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
                      ))}
                    </Cell.Group>
                  )}
                </Skeleton>
              </View>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </View>
    </GeneralPage>
  )
}