import { View } from '@tarojs/components'
import { Button, Avatar } from "@nutui/nutui-react-taro"
import { User } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import GeneralPage from '@/components/GeneralPage'
import './index.scss'

function Index() {
  // 获取用户角色
  const userRole = Taro.getStorageSync('userRole')
  const roleText = userRole === 'afterSale' ? '售后' : '店总'

  // 切换角色
  const handleSwitchRole = () => {
    Taro.reLaunch({
      url: '/pages/role-select/index'
    })
  }

  // 修改密码
  const handleChangePassword = () => {
    Taro.navigateTo({
      url: '/pages/change-password/index'
    })
  }

  // 退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录信息
          Taro.removeStorageSync('token')
          Taro.removeStorageSync('userRole')
          Taro.removeStorageSync('loginInfo')
          
          // 跳转到登录页
          Taro.reLaunch({
            url: '/pages/login/index'
          })
        }
      }
    })
  }

  return (
    <GeneralPage>
      <View className="mine-page">
        <View className="user-info">
          <Avatar 
            className="avatar"
            icon={<User color="#333" />}
            background="#f0f0f0"
            size="large"
          />
          <View className="info">
            <View className="name">张三</View>
            <View className="role">{roleText}</View>
          </View>
        </View>

        <View className="action-list">
          <Button 
            className="action-btn"
            onClick={handleSwitchRole}
          >
            切换角色
          </Button>
          <Button 
            className="action-btn"
            onClick={handleChangePassword}
          >
            修改密码
          </Button>
          <Button 
            className="action-btn logout-btn"
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </View>
      </View>
    </GeneralPage>
  )
}

export default Index
