import { View } from '@tarojs/components'
import { Button, Avatar } from "@nutui/nutui-react-taro"
import { User } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import GeneralPage from '@/components/GeneralPage'
import './index.scss'
import { useUserStore } from '@/store/user'
import { Role, ROLES_INFO } from '@/common/constants/constants'
import { useState } from 'react'
import StoreSelect from '@/components/StoreSelect'

function Index() {
  // 获取用户角色
  const { userInfo, currentRoleInfo } = useUserStore()
  const [visible, setVisible] = useState(false)


  // 提取门店列表
  const storeList = userInfo?.role_list || []

  // 退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录信息
          Taro.removeStorageSync('cookies')
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

  const handleChangePassword = () => {
    Taro.navigateTo({
      url: '/package/pages/change-password/index'
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
            <View className="name">{userInfo?.nickname}</View>
            <View className="role">{ROLES_INFO[currentRoleInfo?.role || Role.Support]}</View>
          </View>
          <View className="store-selector">
            <View
              className="store-current"
            >
              {currentRoleInfo?.store_name}
            </View>
          </View>
        </View>
        <View className="action-list">
          {
            storeList.length > 1 && (
              <Button
                className="action-btn"
                onClick={() => setVisible(true)}
              >
                切换门店
              </Button>
            )
          }
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
      <StoreSelect visible={visible} setVisible={setVisible}></StoreSelect>
    </GeneralPage>
  )
}

export default Index
