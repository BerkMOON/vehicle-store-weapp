import { useState } from 'react'
import Taro from '@tarojs/taro'
import { CouponAPI } from '@/request/couponApi'
import { CouponInfo } from '@/request/couponApi/typings.d'

export function useCouponDetails() {
  const [expandedBatchNo, setExpandedBatchNo] = useState<string | null>(null)
  const [couponDetails, setCouponDetails] = useState<CouponInfo[]>([])
  const [couponDetailsMap, setCouponDetailsMap] = useState<Record<string, CouponInfo[]>>({})

  const fetchCouponDetails = async (batchNo: string) => {
    if (couponDetailsMap[batchNo]) {
      setCouponDetails(couponDetailsMap[batchNo])
      return
    }

    try {
      const res = await CouponAPI.getCouponList({ batch_no: batchNo })
      const details = res?.data.list || []
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

  const handleExpand = (batchNo: string) => {
    if (expandedBatchNo === batchNo) {
      setExpandedBatchNo(null)
      setCouponDetails([])
    } else {
      setExpandedBatchNo(batchNo)
      fetchCouponDetails(batchNo)
    }
  }

  return {
    expandedBatchNo,
    couponDetails,
    handleExpand
  }
}