import { View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { Cell, Button, Empty, Tabs, Skeleton } from '@nutui/nutui-react-taro'
import { Plus } from '@nutui/icons-react-taro'
import './index.scss'
import GeneralPage from '@/components/GeneralPage'
import { CouponAPI } from '@/request/couponApi'
import { CouponBatch, CouponInfo } from '@/request/couponApi/typings.d'
import { COUPON_TYPES, CouponType } from '@/common/constants/constants'

const tabs = [
  { title: '待审核', value: '1' },
  { title: '已通过', value: '2' },
  { title: '已拒绝', value: '3' },
]

export default function CouponApportion() {
  const [coupons, setCoupons] = useState<CouponBatch[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  // 添加新的状态
  const [expandedBatchNo, setExpandedBatchNo] = useState<string | null>(null)
  const [couponDetails, setCouponDetails] = useState<CouponInfo[]>([])
  // 添加缓存状态
  const [couponDetailsMap, setCouponDetailsMap] = useState<Record<string, CouponInfo[]>>({})

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

  // 修改获取优惠券详情的方法
  const fetchCouponDetails = async (batchNo: string) => {
    // 如果已经有缓存数据，直接使用
    if (couponDetailsMap[batchNo]) {
      setCouponDetails(couponDetailsMap[batchNo])
      return
    }

    try {
      const res = await CouponAPI.getCouponList({ batch_no: batchNo })
      const details = res?.data.list || []
      // 更新缓存
      setCouponDetailsMap(prev => ({
        ...prev,
        [batchNo]: details
      }))
      setCouponDetails(details)
    } catch (error) {
      Taro.showToast({
        title: '获取优惠券详情失败',
        icon: 'none'
      })
    }
  }

  // 修改 Tab 切换时清空缓存
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setExpandedBatchNo(null)
    setCouponDetails([])
    setCouponDetailsMap({}) // 切换 Tab 时清空缓存
    fetchCoupons(value)
  }

  const navigateToGenerate = () => {
    Taro.navigateTo({
      url: '/pages/coupon-generate/index'
    })
  }


  // 处理展开/收起
  const handleExpand = (batchNo: string) => {
    if (expandedBatchNo === batchNo) {
      setExpandedBatchNo(null)
      setCouponDetails([])
    } else {
      setExpandedBatchNo(batchNo)
      fetchCouponDetails(batchNo)
    }
  }

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
      console.error('解析规则失败：', error)
      return '规则解析失败'
    }
  }

  useEffect(() => {
    fetchCoupons(activeTab)
  }, [])

  return (
    <GeneralPage>
      <View className='coupon-apportion'>
        <View className='header'>
          <View className='title'>优惠券发放</View>
          <Button
            color="#4e54c8"
            icon={<Plus />}
            onClick={navigateToGenerate}
          >
            新建优惠券
          </Button>
        </View>

        <View className='content'>
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
                              <View className='coupon-details'>
                                {couponDetails.map((detail, index) => (
                                  <View key={index} className='detail-item'>
                                    <View className='detail-header'>
                                      <View className='detail-type'>
                                        {COUPON_TYPES.find(t => t.value === detail.type)?.label}
                                      </View>
                                      {
                                        detail.type === CouponType.Cash && <View className={`detail-value cash`}>
                                          {getRuleContent(detail)}
                                        </View>
                                      }
                                    </View>
                                    {
                                      detail.type !== CouponType.Cash &&
                                      <View className="detail-rule">
                                        {getRuleContent(detail)}
                                      </View>
                                    }
                                    <View className='detail-validity'>
                                      <View>开始时间：{detail.valid_start}</View>
                                      <View>结束时间：{detail.valid_end}</View>
                                    </View>
                                  </View>
                                ))}
                              </View>
                            )}
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
      </View>
    </GeneralPage>
  )
}