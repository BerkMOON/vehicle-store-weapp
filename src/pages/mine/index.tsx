import { View } from '@tarojs/components'
import { Button, Avatar } from "@nutui/nutui-react-taro"
import { User } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import GeneralPage from '@/components/GeneralPage'
import './index.scss'
import { useUserStore } from '@/store/user'
import { ROLES_INFO } from '@/common/constants/constants'
import { useMemo, useState } from 'react'
import StoreSelect from '@/components/StoreSelect'
import { getRolesAtStore, getUniqueStores } from '@/utils/utils'

function Index() {
  const { userInfo, currentRoleInfo } = useUserStore()
  const [visible, setVisible] = useState(false)

  const roleList = userInfo?.role_list || []
  const uniqueStores = useMemo(() => getUniqueStores(roleList), [roleList])
  const rolesAtStore = useMemo(
    () => getRolesAtStore(roleList, currentRoleInfo?.store_id),
    [roleList, currentRoleInfo?.store_id],
  )

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('cookies')
          Taro.removeStorageSync('userRole')
          Taro.removeStorageSync('loginInfo')
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
            <View className="roles">
              {rolesAtStore.map((item) => (
                <View className="role" key={item.role}>
                  {ROLES_INFO[item.role]}
                </View>
              ))}
            </View>
            <View className="store-row">
              <View className="store-name">{currentRoleInfo?.store_name}</View>
            </View>
          </View>
        </View>
        <View className="action-list">
          {uniqueStores.length > 1 && (
            <Button className="action-btn" onClick={() => setVisible(true)}>
              切换门店
            </Button>
          )}
          <Button className="action-btn" onClick={handleChangePassword}>
            修改密码
          </Button>
          <Button className="action-btn logout-btn" onClick={handleLogout}>
            退出登录
          </Button>
        </View>
      </View>
      <StoreSelect visible={visible} setVisible={setVisible} />
    </GeneralPage>
  )
}

export default Index
