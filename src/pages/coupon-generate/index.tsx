import { View } from '@tarojs/components'
import { Form, Input, TextArea, Radio, InputNumber, DatePicker, Button } from '@nutui/nutui-react-taro'
import './index.scss'
import Taro from '@tarojs/taro'
import { Scan } from '@nutui/icons-react-taro'
import { useState } from 'react'
import { COUPON_TYPES, CouponType, SuccessCode } from '@/common/constants/constants'
import { CouponAPI } from '@/request/couponApi'

export default function CouponGenerate() {
  const [form] = Form.useForm()
  const [formAll] = Form.useForm()
  const [currentPicker, setCurrentPicker] = useState<'start' | 'end' | null>(null)
  const validStart = Form.useWatch('valid_start', form)
  const validEnd = Form.useWatch('valid_end', form)
  const type = Form.useWatch('type', form)
  const [isAdding, setIsAdding] = useState(false)
  const [coupons, setCoupons] = useState<any[]>([])

  // 添加日期格式化函数
  const formatDate = (date) => {
    if (!date || !Array.isArray(date)) return ''
    const [year, month, day, hour = 0, minute = 0] = date
    const d = new Date(year, month - 1, day, hour, minute, 0)
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
  }

  const handleScan = async () => {
    try {
      const res = await Taro.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode']
      })

      if (res.result) {
        console.log('扫描结果：', res.result)
        formAll.setFieldsValue({
          openId: res.result
        })
      } else {
        Taro.showToast({
          title: '未获取到用户信息',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('扫码失败：', error)
      Taro.showToast({
        title: '扫码失败',
        icon: 'error'
      })
    }
  }

  const handleDateConfirm = (_, values) => {
    console.log('日期确认：', values)
    if (currentPicker === 'start') {
      form.setFieldsValue({ valid_start: values })
      form.validateFields(['valid_start'])
    } else if (currentPicker === 'end') {
      form.setFieldsValue({ valid_end: values })
      form.validateFields(['valid_end'])
    }
    setCurrentPicker(null)
  }

  const handleSaveCoupon = async (values) => {
    const { cash, quantity, valid_start, valid_end, type } = values

    // 验证金额
    if (type === CouponType.Cash) {
      const amountNum = parseFloat(cash)
      if (isNaN(amountNum) || amountNum <= 0) {
        Taro.showToast({
          title: '请输入有效的优惠金额',
          icon: 'none'
        })
        return
      }
    }

    // 验证日期
    const start = new Date(valid_start)
    const end = new Date(valid_end)
    if (end <= start) {
      Taro.showToast({
        title: '结束日期必须大于开始日期',
        icon: 'none'
      })
      return
    }

    // 验证数量
    const quantityNum = parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0 || quantityNum > 100) {
      Taro.showToast({
        title: '生成数量应在1-100张之间',
        icon: 'none'
      })
      return
    }

    // 保存优惠券到列表
    // 修改保存优惠券的处理
    setCoupons([...coupons, {
      ...values,
      cash: parseFloat(cash),
      valid_start: formatDate(valid_start),
      valid_end: formatDate(valid_end),
    }])

    setIsAdding(false)
    form.resetFields()
  }

  const handleGenerateCoupons = async () => {
    if (coupons.length === 0) {
      Taro.showToast({
        title: '请至少添加一张优惠券',
        icon: 'none'
      })
      return
    }

    try {
      const open_id = formAll.getFieldValue('openId')

      const expandedCoupons = coupons.reduce((acc, coupon) => {
        const { quantity, ...couponData } = coupon
        return [
          ...acc,
          ...Array(quantity).fill(couponData)
        ]
      }, [])

      const res = await CouponAPI.createCoupon({
        open_id,
        coupon_list: expandedCoupons
      })

      if (res?.response_status.code === SuccessCode) {
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
        Taro.showToast({
          title: '生成成功',
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
        setCoupons([])
      } else {
        Taro.showToast({
          title: '生成失败',
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '生成失败',
        icon: 'error'
      })
      console.error(error)
    }
  }

  const handleDeleteCoupon = (index: number) => {
    setCoupons(coupons.filter((_, i) => i !== index))
  }

  return (
    <View className='coupon-generate'>
      {!isAdding && (
        <>
          <Form form={formAll} labelPosition='left'>
            <View className="input-with-actions">
              <Form.Item
                label='用户'
                name='openId'
                rules={[{ required: true, message: '请扫描用户二维码' }]}
              >
                <Input
                  className="form-input"
                  placeholder="请扫描用户二维码"
                  type="text"
                />
              </Form.Item>
              <Scan onClick={handleScan} />
            </View>
          </Form>
          <Form labelPosition='top'>
            <Form.Item
              label='优惠券信息'
              rules={[{ required: true }]}
              className='coupon-info-item'
            >
              <View className="coupon-list">
                {coupons.map((coupon, index) => (
                  <View key={index} className="coupon-card">
                    <View className="coupon-type">{COUPON_TYPES.find(t => t.value === coupon.type)?.label}</View>
                    {coupon.type === CouponType.Cash ? (
                      <View className="coupon-amount">{coupon.cash}元</View>
                    ) : coupon.type === CouponType.Maintenance ? (
                      <View className="coupon-info">{coupon.maintenance}</View>
                    ) : coupon.type === CouponType.Insurance ? (
                      <View className="coupon-info">{coupon.insurance}</View>
                    ) : (
                      <View className="coupon-info">{coupon.physical}</View>
                    )}
                    <View className="coupon-validity">
                      <View>有效期：{coupon.validStart} 至 {coupon.validEnd}</View>
                      <View>数量：{coupon.quantity}张</View>
                    </View>
                    <View className="delete-btn" onClick={() => handleDeleteCoupon(index)}>删除</View>
                  </View>
                ))}
                <View className="coupon-card add-card" onClick={() => setIsAdding(true)}>
                  <View className="add-icon">+</View>
                  <View className="add-text">新增优惠券</View>
                </View>
              </View>
            </Form.Item>
          </Form>
          <View className='submit-button'>
            <Button block color="#4e54c8" onClick={handleGenerateCoupons}>生成优惠券</Button>
          </View>
        </>
      )}
      {isAdding && <Form
        form={form}
        onFinish={handleSaveCoupon}
        initialValues={{
          quantity: 1
        }}
        divider
        labelPosition="left"
        footer={
          <View className='save-button'>
            <Button onClick={() => setIsAdding(false)}>取消</Button>
            <Button nativeType="submit" color='#4e54c8'>
              保存
            </Button>
          </View>
        }>
        <Form.Item
          label='优惠券类型'
          name='type'
          rules={[{ required: true, message: '请选择优惠券类型' }]}
        >
          <Radio.Group direction="horizontal">
            {COUPON_TYPES.map(type => (
              <Radio key={type.value} value={type.value}>
                {type.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        {
          type === CouponType.Cash && <Form.Item
            label='优惠金额'
            name='cash'
            rules={[{ required: true, message: '请输入优惠金额' }]}
          >
            <Input
              placeholder='请输入优惠金额'
              type='digit'
            />
          </Form.Item>
        }

        {
          type === CouponType.Maintenance && <Form.Item
            label='保养信息'
            name='maintenance'
            rules={[{ required: true, message: '请输入保养信息' }]}
          >
            <TextArea
              placeholder='请输入保养信息'
              showCount
              maxLength={100}
            />
          </Form.Item>
        }

        {
          type === CouponType.Insurance && <Form.Item
            label='续保信息'
            name='insurance'
            rules={[{ required: true, message: '请输入续保信息' }]}
          >
            <TextArea
              placeholder='请输入续保信息'
              showCount
              maxLength={100}
            />
          </Form.Item>
        }

        {
          type === CouponType.Physical && <Form.Item
            label='实物信息'
            name='physical'
            rules={[{ required: true, message: '请输入实物信息' }]}
          >
            <TextArea
              placeholder='请输入实物信息'
              showCount
              maxLength={100}
            />
          </Form.Item>
        }

        <Form.Item
          label='生成数量'
          name='quantity'
          rules={[{ required: true, message: '请输入生成数量' }]}
        >
          <InputNumber
            min={1}
            max={100}
          />
        </Form.Item>

        <Form.Item
          label='开始日期'
          name='valid_start'
          rules={[{ required: true, message: '请选择开始日期' }]}
        >
          <View onClick={() => setCurrentPicker('start')}>
            <Input
              placeholder='请选择开始日期'
              value={formatDate(validStart)}
              disabled
            />
          </View>
        </Form.Item>

        <Form.Item
          label='结束日期'
          name='valid_end'
          rules={[{ required: true, message: '请选择结束日期' }]}
        >
          <View onClick={() => setCurrentPicker('end')}>
            <Input
              placeholder='请选择结束日期'
              value={formatDate(validEnd)}
              disabled
            />
          </View>
        </Form.Item>

        <Form.Item
          label='使用说明'
          name='description'
        >
          <TextArea
            placeholder='请输入使用说明'
            showCount
            maxLength={100}
          />
        </Form.Item>
      </Form>}

      <DatePicker
        title={currentPicker === 'start' ? '开始日期' : '结束日期'}
        type="datetime"
        defaultValue={new Date()}
        visible={!!currentPicker}
        onClose={() => setCurrentPicker(null)}
        onConfirm={handleDateConfirm}
      />
    </View>
  )
}
