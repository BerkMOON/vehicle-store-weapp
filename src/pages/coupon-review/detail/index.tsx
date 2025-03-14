import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Cell, Button, TextArea, Skeleton } from '@nutui/nutui-react-taro'
import GeneralPage from '@/components/GeneralPage'
import { CouponAPI } from '@/request/couponApi'
import { CouponBatch, CouponBatchStatus, CouponInfo } from '@/request/couponApi/typings.d'
import { COUPON_TYPES, CouponStatusMap, CouponType, SuccessCode } from '@/common/constants/constants'
import './index.scss'

export default function CouponReviewDetail() {
  const [batchInfo, setBatchInfo] = useState<CouponBatch>()
  const [couponList, setCouponList] = useState<CouponInfo[]>([])
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(false)

  const getRuleContent = (detail: CouponInfo) => {
    try {
      const rule = JSON.parse(detail.rule)
      switch (detail.type) {
        case CouponType.Cash:
          return `${rule.cash}元`
        case CouponType.Maintenance:
          return rule.maintenance
        case CouponType.Insurance:
          return rule.insurance
        case CouponType.Physical:
          return rule.physical
        default:
          return '未知类型'
      }
    } catch (error) {
      return '规则解析失败'
    }
  }

  useLoad(async ({ batch_no }) => {
    if (!batch_no) {
      Taro.showToast({
        title: '参数错误',
        icon: 'error'
      })
      return
    }
    setLoading(true)
    try {
      // 获取批次信息
      const batchRes = await CouponAPI.getCouponBatchList({
        creator: '1',
        batch_no
      })
      setBatchInfo(batchRes?.data.list?.[0])

      // 获取优惠券列表
      const listRes = await CouponAPI.getCouponList({ batch_no })
      setCouponList(listRes?.data.list || [])
    } catch (error) {
      Taro.showToast({
        title: '获取详情失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  })

  const handleReview = async (status: 2 | 3) => {
    if (status === 3 && !rejectReason) {
      Taro.showToast({
        title: '请填写拒绝原因',
        icon: 'none'
      })
      return
    }

    try {
      const res = await CouponAPI.reviewCouponBatch({
        batch_no: batchInfo?.batch_no || '',
        status,
        operator: 1,
        ...(status === 3 && { remark: rejectReason })
      })

      if (res?.response_status.code === SuccessCode) {
        Taro.showToast({
          title: status === 2 ? '审核通过' : '已拒绝',
          icon: 'success'
        })
        setTimeout(() => {
          // 设置上一页的数据需要刷新
          const pages = Taro.getCurrentPages()
          const prevPage = pages[pages.length - 2]
          if (prevPage) {
            // @ts-ignore
            prevPage.setData({
              needRefresh: true
            })
          }
          Taro.navigateBack()
        }, 1000)
      } else {
        Taro.showToast({
          title: `操作失败: ${res?.response_status.msg}`,
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '操作失败',
        icon: 'error'
      })
    }
  }

  return (

    <View className='coupon-review-detail'>
      <Skeleton rows={15} title animated visible={!loading}>
        {
          batchInfo && <View className='batch-info'>
            <Cell.Group>
              {
                batchInfo?.status !== CouponBatchStatus.AUDITING && <Cell title="审核结果" description={CouponStatusMap[batchInfo.status]} />
              }
              <Cell title='审核单号' description={batchInfo.batch_no} />
              <Cell title='优惠券数量' description={batchInfo.coupon_count} />
              <Cell title='创建人' description={batchInfo.creator} />
              <Cell title='备注信息' description={batchInfo.remark || '-'} />
            </Cell.Group>
          </View>
        }


        <View className='coupon-list'>
          <View className='section-title'>优惠券列表</View>
          {couponList.map((coupon, index) => (
            <View key={index} className='coupon-item'>
              <View className='coupon-type'>
                {COUPON_TYPES.find(t => t.value === coupon.type)?.label}
              </View>
              <View className={coupon.type === CouponType.Cash ? 'amount' : 'desc'}>
                {getRuleContent(coupon)}
              </View>
              <View className='validity'>
                <View>开始时间：{coupon.valid_start}</View>
                <View>结束时间：{coupon.valid_end}</View>
              </View>
            </View>
          ))}
        </View>

        {
          batchInfo?.status === CouponBatchStatus.AUDITING &&
          <>
            <View className='review-form'>
              <View className='section-title'>审核操作</View>
              <View className='reject-reason'>
                <TextArea
                  value={rejectReason}
                  onChange={(val) => setRejectReason(val)}
                  maxLength={100}
                  style={{ height: '90px' }}
                  placeholder='请输入拒绝原因（拒绝时必填）'
                  showCount
                />
              </View>
            </View>

            <View className='button-group'>
              <Button type='default' size='large' onClick={() => handleReview(3)}>
                拒绝
              </Button>
              <Button color='#4e54c8' size='large' onClick={() => handleReview(2)}>
                通过
              </Button>
            </View>
          </>
        }
      </Skeleton>
    </View>
  )
}