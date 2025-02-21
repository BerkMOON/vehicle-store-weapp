import { View } from '@tarojs/components'
import { Input, Cell, Form, Button, Picker } from '@nutui/nutui-react-taro'
import { ArrowRight } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

const pickerOptions = [
  { value: 4, text: 'BeiJing' },
  { value: 1, text: 'NanJing' },
  { value: 2, text: 'WuXi' },
  { value: 8, text: 'DaQing' },
  { value: 9, text: 'SuiHua' },
  { value: 10, text: 'WeiFang' },
  { value: 12, text: 'ShiJiaZhuang' },
]

function OrderSearch() {
  const submitFailed = (error: any) => {
    Taro.showToast({ title: JSON.stringify(error), icon: 'error' })
  }

  const submitSucceed = (values: any) => {
    Taro.showToast({ title: JSON.stringify(values), icon: 'success' })
  }

  return (
    <View className='order-search'>
      <View className='search-tip'>请至少输入或选择一个查询条件，以便快速筛选工单</View>

      <Form
        divider
        labelPosition="right"
        onFinish={(values) => submitSucceed(values)}
        onFinishFailed={(values, errors) => submitFailed(errors)}
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Button nativeType="submit" className='btn primary' type="primary">
              提交
            </Button>
            <Button nativeType="reset" className='btn' style={{ marginLeft: '20px' }}>
              重置
            </Button>
          </div>
        }
      >
        <Form.Item
          label='机构门店'
          name='store'
          trigger="onConfirm"
          getValueFromEvent={(...args) => args[1]}
          onClick={(_, ref: any) => {
            ref.open()
          }}>
          <Picker options={[pickerOptions]}>
            {(value: any) => {
              return (
                <Cell
                  style={{
                    padding: 0
                  }}
                  className="nutui-cell--clickable"
                  title={
                    value.length
                      ? pickerOptions.filter((po) => po.value === value[0])[0]
                        ?.text
                      : '请选择门店'
                  }
                  extra={<ArrowRight size={12} />}
                  align="center"
                />
              )
            }}
          </Picker>
        </Form.Item>

        <Form.Item label='车牌号'>
          <Input
            placeholder='请输入车牌号码'
            name='plateNumber'
          />
        </Form.Item>

        <Form.Item label='车架号'>
          <Input
            placeholder='请输入车架号'
            name='frameNumber'
          />
        </Form.Item>

        <Form.Item label='客户姓名'>
          <Input
            placeholder='请输入客户姓名'
            name='customerName'
          />
        </Form.Item>

        <Form.Item label='手机号'>
          <Input
            placeholder='请输入手机号'
            type='number'
            name='phone'
          />
        </Form.Item>

        <Form.Item label='工单号'>
          <Input
            placeholder='请输入工单号'
            name='orderNo'
          />
        </Form.Item>

        <Form.Item
          label='是否已查看'
          name='isViewed'
          trigger="onConfirm"
          getValueFromEvent={(...args) => args[1]}
          onClick={(_, ref: any) => {
            ref.open()
          }}
        >
          <Picker
            options={[{ value: 1, text: '是' }, { value: 0, text: '否' }]}>
            {(value: any) => {
              return (
                <Cell
                  style={{
                    padding: 0
                  }}
                  className="nutui-cell--clickable"
                  title={
                    value.length
                      ? pickerOptions.filter((po) => po.value === value[0])[0]
                        ?.text
                      : '请选择是否已查看'
                  }
                  extra={<ArrowRight size={12} />}
                  align="center"
                />
              )
            }}
          </Picker>
        </Form.Item>

        <Form.Item
          label='事故级别'
          name='accidentLevel'
          trigger="onConfirm"
          getValueFromEvent={(...args) => args[1]}
          onClick={(_, ref: any) => {
            ref.open()
          }}
        >
          <Picker options={[{ value: 1, text: '轻微' }, { value: 2, text: '一般' }, { value: 3, text: '严重' }]}>
          {(value: any) => {
              return (
                <Cell
                  style={{
                    padding: 0
                  }}
                  className="nutui-cell--clickable"
                  title={
                    value.length
                      ? pickerOptions.filter((po) => po.value === value[0])[0]
                        ?.text
                      : '请选择事故级别'
                  }
                  extra={<ArrowRight size={12} />}
                  align="center"
                />
              )
            }}
          </Picker>
        </Form.Item>
      </Form>

      {/* <View className='footer'>
        <View className='btn reset' onClick={handleReset}>重置</View>
        <View className='btn search' onClick={handleSearch}>查询</View>
      </View> */}
    </View>
  )
}

export default OrderSearch 