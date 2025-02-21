import { View } from '@tarojs/components'
import { Form, Input, Cell, Button, TextArea } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import './index.less'
import Taro from '@tarojs/taro'
import GeneralPage from '@/components/GeneralPage'

interface CouponForm {
  name: string
  amount: string
  validDays: string
  description: string
  quantity: string
}

export default function CouponGenerate() {
  const [form, setForm] = useState<CouponForm>({
    name: '',
    amount: '',
    validDays: '',
    description: '',
    quantity: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.amount || !form.validDays || !form.quantity) {
      Taro.showToast({
        title: '请填写完整信息'
      })
      return
    }

    setLoading(true)
    try {
      // 这里替换为实际的API调用
      await fetch('/api/coupons/generate', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      Taro.showToast({
        title: '生成成功'
      })
      setForm({
        name: '',
        amount: '',
        validDays: '',
        description: '',
        quantity: ''
      })
    } catch (error) {
      Taro.showToast({
        title: '生成失败'
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='coupon-generate'>
      <Form>
        <Cell.Group title='优惠券信息'>
          <Form.Item label='优惠券名称' required>
            <Input
              placeholder='请输入优惠券名称'
              value={form.name}
              onChange={(val) => setForm(prev => ({ ...prev, name: val }))}
            />
          </Form.Item>

          <Form.Item label='优惠金额' required>
            <Input
              placeholder='请输入优惠金额'
              type='digit'
              value={form.amount}
              onChange={(val) => setForm(prev => ({ ...prev, amount: val }))}
            />
          </Form.Item>

          <Form.Item label='有效天数' required>
            <Input
              placeholder='请输入有效天数'
              type='number'
              value={form.validDays}
              onChange={(val) => setForm(prev => ({ ...prev, validDays: val }))}
            />
          </Form.Item>

          <Form.Item label='生成数量' required>
            <Input
              placeholder='请输入生成数量'
              type='number'
              value={form.quantity}
              onChange={(val) => setForm(prev => ({ ...prev, quantity: val }))}
            />
          </Form.Item>

          <Form.Item label='使用说明'>
            <TextArea
              placeholder='请输入使用说明'
              maxLength={100}
              value={form.description}
              onChange={(val) => setForm(prev => ({ ...prev, description: val }))}
            />
          </Form.Item>
        </Cell.Group>
      </Form>

      <View className='submit-button'>
        <Button
          block
          type='primary'
          loading={loading}
          onClick={handleSubmit}
        >
          生成优惠券
        </Button>
      </View>
    </View>
  )
}