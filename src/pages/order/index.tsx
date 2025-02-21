import Taro from '@tarojs/taro'
import { View, Icon } from '@tarojs/components'
import { Tabs } from '@nutui/nutui-react-taro'
import { useEffect, useState } from 'react'
import './index.scss'
import GeneralPage from '@/components/GeneralPage'


function Index() {
  const [activeTab, setActiveTab] = useState('0')
  const [workOrders, setWorkOrders] = useState<any[]>([])

  const tabs = [
    { title: '待跟进', name: '0' },
    { title: '跟进中', name: '1' },
    { title: '已回厂', name: '2' },
    { title: '战败', name: '3' },
    { title: '全部', name: '4' },
    {
      title: '',
      name: '5',
      icon: <Icon style={{ paddingTop: '15px' }} size="14px" type="search" />,
      onClick: () => Taro.navigateTo({
        url: `/pages/order-search/index`
      })
    }
  ]

  const contentItems = [
    { label: '车型', value: 'carModel' },
    { label: '车架号', value: 'frameNumber' },
    { label: '工单来源', value: 'source' },
    { label: '车架号', value: 'vin' },
    { label: '创建时间', value: 'createTime' },
    { label: '门店名称', value: 'storeName' }
  ]

  useEffect(() => {
    setWorkOrders([{
      orderNo: '123456',
      carModel: '宝马X5',
      source: '官网',
      vin: '1234567890',
      createTime: '2024-01-01',
      storeName: '北京4S店',
      frameNumber: '1234567890'
    }, {
      orderNo: '123457',
      carModel: '宝马X6',
      source: '官网',
      vin: '1234567890',
      createTime: '2024-01-01',
      storeName: '北京4S店',
      frameNumber: '1234567890'
    },
    {
      orderNo: '123458',
      carModel: '宝马X7',
      source: '官网',
      vin: '1234567890',
      createTime: '2024-01-01',
      storeName: '北京4S店',
      frameNumber: '1234567890'
    }
    ])
  }, [activeTab])


  const handleViewDetail = (orderNo: string) => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?orderNo=${orderNo}`
    })
  }

  const handleTransfer = (orderNo: string) => {
    console.log('转单', orderNo)
  }

  const handleFollow = (orderNo: string) => {
    console.log('跟进', orderNo)
  }

  const WorkOrderItem = ({ order, items }) => {
    return (
      <View className='work-order-item'>
        <View className='order-header'>
          <View className='order-number'>工单号：{order.orderNo}</View>
        </View>

        <View className='order-content'>
          {items.map((item, index) => (
            <View key={index} className='content-row'>
              <View className='label'>{item.label}：</View>
              <View className='value'>{order[item.value]}</View>
            </View>
          ))}
        </View>

        <View className='order-footer'>
          <View className='btn' onClick={() => handleViewDetail(order.orderNo)}>
            查看详情
          </View>
          <View className='btn' onClick={() => handleTransfer(order.orderNo)}>
            转单
          </View>
          <View className='btn primary' onClick={() => handleFollow(order.orderNo)}>
            跟进
          </View>
        </View>
      </View>
    )
  }

  return (
    <GeneralPage>
      <View className='index-container'>
        <Tabs
          className='fixed-tabs'
          value={activeTab}
          title={() => {
            return tabs.map((item) => (
              <div
                onClick={() => {
                  if (!item.icon) {
                    setActiveTab(item.name)
                  } else {
                    item.onClick()
                  }
                }}
                className={`nut-tabs-titles-item ${activeTab === item.name ? 'nut-tabs-titles-item-active' : ''}`}
                key={item.name}
              >
                {item.icon || null}
                <span className="nut-tabs-titles-item-text">{item.title}</span>
                <span className="nut-tabs-titles-item-line" />
              </div>
            ))
          }}
        >
          {tabs.map(tab => (
            <Tabs.TabPane key={tab.name} value={tab.name} title={tab.title}>
              <View className='order-list'>
                {workOrders.map(order => (
                  <WorkOrderItem key={order.orderNo} order={order} items={contentItems} />
                ))}
              </View>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </View>
    </GeneralPage>
  )
}

export default Index
