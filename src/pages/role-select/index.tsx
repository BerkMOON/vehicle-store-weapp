import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

function RoleSelect() {
  const handleSelectRole = (role: 'afterSale' | 'shopManager') => {
    // 保存角色信息
    Taro.setStorageSync('userRole', role)
    
    // 跳转到对应的首页
    Taro.reLaunch({
      url: role === 'afterSale' ? '/pages/order/index' : '/pages/mine/index'
    })
  }

  return (
    <View className='role-select'>
      <View className='title'>请选择您的角色</View>
      <View className='role-buttons'>
        <Button 
          className='role-btn'
          type='primary'
          onClick={() => handleSelectRole('afterSale')}
        >
          售后
        </Button>
        <Button 
          className='role-btn'
          type='primary'
          onClick={() => handleSelectRole('shopManager')}
        >
          店总
        </Button>
      </View>
    </View>
  )
}

export default RoleSelect 