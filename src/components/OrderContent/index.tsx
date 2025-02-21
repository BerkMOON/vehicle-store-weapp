import { FC } from 'react'
import { View } from '@tarojs/components'

interface ContentItem {
  label: string
  value: string
}

interface OrderContentProps {
  items: ContentItem[]
}

const OrderContent: FC<OrderContentProps> = ({ items }) => {
  return (
    <View className='order-content'>
      {items.map((item, index) => (
        <View key={index} className='content-row'>
          <View className='label'>{item.label}：</View>
          <View className='value'>{item.value}</View>
        </View>
      ))}
    </View>
  )
}

export default OrderContent