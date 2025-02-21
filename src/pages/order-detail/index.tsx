import { View, Text, Image } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import OrderContent from '@/components/OrderContent'
import './index.scss'

function OrderDetail() {
  const [orderInfo] = useState({
    orderNo: '11AA0-241229150857',
    createTime: '2024-12-29 15:08:58',
    carModel: '京KPU870 -- 尹艳南',
    status: '待跟进(已查看)',
    followRecord: {
      firstTime: '2024-12-30 14:06:15',
      content: ''
    },
    customerProduct: '无',
    dvrInfo: [
      { label: '车架号', value: 'LVGB1B0E7RG029798' },
      { label: '发生时间', value: '2024-12-29 15:08:57' },
      { label: '客户电话', value: '13931382091', isPhone: true },
      { label: '碰撞时间', value: '2024-12-29 15:04:59' },
      { label: '事故级别', value: 'A(事故部位：右侧；事故类型：刮擦)' },
      { label: '设备号', value: '86949705266348' },
      { label: '出险城市', value: '北京市北京城区' },
      { label: '出险地址', value: '北京市朝阳区亚运村街道国家奥林匹克体育中心' }
    ],
    serviceInfo: [
      { label: '是否可行驶', value: '否' },
      { label: '接车员', value: '李新' },
      { label: '接车员电话', value: '13811816554', isPhone: true }
    ]
  })

  const handleAction = (type: 'confirm' | 'transfer' | 'updateValue' | 'follow') => {
    console.log('操作类型：', type)
  }

  return (
    <View className='order-detail'>
      {/* 头部信息 */}
      <View className='header'>
        <View className='order-base'>
          <View className='order-no'>工单号：{orderInfo.orderNo}</View>
          <View className='create-time'>{orderInfo.createTime}</View>
        </View>
        <View className='car-info'>
          <Text className='car-model'>{orderInfo.carModel}</Text>
          <Text className='status'>{orderInfo.status}</Text>
        </View>
      </View>

      {/* 跟进记录 */}
      <View className='section'>
        <View className='section-title'>跟进记录</View>
        <View className='follow-record'>
          <View>首次跟进：{orderInfo.followRecord.firstTime}</View>
          <View>首次跟进内容：{orderInfo.followRecord.content || '暂无'}</View>
          <View className='arrow'>{'>'}</View>
        </View>
      </View>

      {/* 客户名下权益产品 */}
      <View className='section'>
        <View className='section-title'>客户名下权益产品</View>
        <View className='content-text'>{orderInfo.customerProduct}</View>
      </View>

      {/* DVR线索信息 */}
      <View className='section'>
        <View className='section-title'>DVR线索信息</View>
        <OrderContent items={orderInfo.dvrInfo} />
      </View>

      {/* 车辆服务状况 */}
      <View className='section'>
        <View className='section-title'>车辆服务状况</View>
        {/* <OrderContent items={orderInfo.serviceInfo} /> */}
      </View>

      {/* 视频详情 */}
      <View className='section'>
        <View className='section-title'>视频详情</View>
        <View className='video-section'>
          <Text className='video-title'>视频一</Text>
          <Image 
            className='video-preview'
            mode='aspectFill'
            src='视频预览图URL'
          />
        </View>
      </View>

      {/* 底部按钮 */}
      <View className='footer'>
        <Button 
          className='action-btn'
          onClick={() => handleAction('confirm')}
        >
          确认
        </Button>
        <Button 
          className='action-btn'
          onClick={() => handleAction('transfer')}
        >
          转单
        </Button>
        <Button 
          className='action-btn'
          onClick={() => handleAction('updateValue')}
        >
          更新产值
        </Button>
        <Button 
          className='action-btn primary'
          onClick={() => handleAction('follow')}
        >
          跟进
        </Button>
      </View>
    </View>
  )
}

export default OrderDetail 