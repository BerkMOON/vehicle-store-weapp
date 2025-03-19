import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Button, Empty, Cell, Skeleton } from '@nutui/nutui-react-taro'
import { Scan } from '@nutui/icons-react-taro'
import GeneralPage from '@/components/GeneralPage'
import { CouponAPI } from '@/request/couponApi'
import { CouponInfo, CouponStatus } from '@/request/couponApi/typings.d'
import { COUPON_TYPES, CouponType, SuccessCode } from '@/common/constants/constants'
import emptyImg from '@/assets/empty.png'
import './index.scss'

export default function Finance() {
  const [couponInfo, setCouponInfo] = useState<CouponInfo>()
  const [loading, setLoading] = useState(false)
  const [settleLoading, setSettleLoading]= useState(false)

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

  const handleScan = async () => {
    try {
      const { result } = await Taro.scanCode({
        scanType: ['qrCode']
      })

      if (!result) {
        Taro.showToast({
          title: '未识别到二维码',
          icon: 'error'
        })
        return
      }

      setLoading(true)
      // 获取优惠券信息
      const res = await CouponAPI.getCouponInfo({
        id: Number(result)
      })

      console.log(res)

      if (res?.data) {
        setCouponInfo(res.data)
      } else {
        Taro.showToast({
          title: '无效的优惠券',
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '扫码失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSettle = async () => {
    if (!couponInfo) return

    try {
      setSettleLoading(true)
      const res = await CouponAPI.updateCouponStatus({
        id: couponInfo.id,
        status: CouponStatus.USED
      })

      if (res?.response_status.code === SuccessCode) {
        Taro.showToast({
          title: '结算成功',
          icon: 'success'
        })
        setCouponInfo(undefined)
      } else {
        Taro.showToast({
          title: `结算失败: ${res?.response_status.msg}`,
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '结算失败',
        icon: 'error'
      })
    } finally {
      setSettleLoading(false)
    }
  }

  return (
    <GeneralPage>
      <View className='finance'>
        <View className='scan-section'>
          <View className='scan-title'>优惠券结算</View>
          <View className='scan-desc'>请扫描用户的优惠券二维码进行结算</View>
          <Button
            type='primary'
            icon={<Scan />}
            block
            onClick={handleScan}
          >
            扫描优惠券
          </Button>
        </View>
        <View className='coupon-info'>
          <Skeleton rows={15} title animated visible={!loading}>
            {couponInfo ?
              <>
                <View className='section-title'>优惠券信息</View>
                <Cell.Group>
                  <Cell title='优惠券编号' description={couponInfo.id} />
                  <Cell title='优惠券类型' description={COUPON_TYPES.find(t => t.value === couponInfo.type)?.label} />
                  <Cell
                    title='优惠内容'
                    description={getRuleContent(couponInfo)}
                    className={couponInfo.type === CouponType.Cash ? 'highlight-cell' : ''}
                  />
                  <Cell title='有效期' description={`${couponInfo.valid_start} 至 ${couponInfo.valid_end}`} />
                  <Cell
                    title='使用状态'
                    description={
                      <View className={`status-tag ${couponInfo.status.code === CouponStatus.UNUSED ? 'unused' : 'used'}`}>
                        {couponInfo.status.code === CouponStatus.UNUSED ? '未使用' : '已使用'}
                      </View>
                    }
                  />
                </Cell.Group>

                {couponInfo.status.code === CouponStatus.UNUSED && (
                  <View className='settle-button'>
                    <Button loading={settleLoading} type='primary' block onClick={handleSettle}>
                      确认结算
                    </Button>
                  </View>
                )}
              </> : <Empty description='暂无优惠券信息' image={emptyImg} />
            }
          </Skeleton>
        </View>
      </View>
    </GeneralPage>
  )
}