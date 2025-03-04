import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'
import { Role } from '@/common/constants/constants'

function RoleSelect() {
  const getPagePath = (role) => {
    switch(role) {
    case Role.AfterSale:
      return '/pages/order/index'
    case Role.ShopManager:
      return '/pages/mine/index'
    case Role.Finance:
      return '/pages/finance/index'
    default:
      return '/pages/mine/index'
  }}

  const handleSelectRole = (role: Role) => {
    // 保存角色信息
    Taro.setStorageSync('userRole', role)
    
    // 跳转到对应的首页
    Taro.reLaunch({
      url: getPagePath(role)
    })
  }

  return (
    <View className='role-select'>
      <View className='title'>请选择您的角色</View>
      <View className='role-buttons'>
        <Button 
          className='role-btn'
          type='primary'
          onClick={() => handleSelectRole(Role.AfterSale)}
        >
          售后
        </Button>
        <Button 
          className='role-btn'
          type='primary'
          onClick={() => handleSelectRole(Role.ShopManager)}
        >
          店总
        </Button>
        <Button
          className='role-btn'
          type='primary'
          onClick={() => handleSelectRole(Role.Finance)}
        >
          财务
        </Button>
      </View>
    </View>
  )
}

export default RoleSelect 