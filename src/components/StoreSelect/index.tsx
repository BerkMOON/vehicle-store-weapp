import { Cell, Popup } from "@nutui/nutui-react-taro"
import { ScrollView, View } from "@tarojs/components"
import { useUserStore } from "@/store/user"
import { useAuth } from "@/hooks/useAuth"
import Taro from "@tarojs/taro"
import './index.scss'
import { Check } from "@nutui/icons-react-taro"
import { getRolesAtStore, getUniqueStores } from "@/utils/utils"
import { RoleList } from "@/request/userApi/typings"

interface StoreSelectProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

const StoreSelect = ({ visible, setVisible }: StoreSelectProps) => {
  const { setCurrentRoleInfo, userInfo, currentRoleInfo } = useUserStore()
  const { checkLoginStatus } = useAuth(false)

  const roleList = userInfo?.role_list || []
  const storeOptions = getUniqueStores(roleList)

  const handleStoreChange = (storeItem: RoleList) => {
    const rolesAtStore = getRolesAtStore(roleList, storeItem.store_id)
    if (!rolesAtStore.length) return

    setCurrentRoleInfo(rolesAtStore[0])
    setVisible(false)
    Taro.showToast({
      title: '已切换到门店: ' + storeItem.store_name,
      icon: 'success',
      success: () => {
        checkLoginStatus()
      },
      duration: 800,
    })
  }

  return (
    <Popup
      visible={visible}
      onClose={() => setVisible(false)}
      position="bottom"
      className="store-select-popup"
      lockScroll={false}
    >
      <View className="store-select-body">
        <View className="popup-header">
          <View className="popup-title">选择门店</View>
        </View>
        <ScrollView scrollY enhanced className="store-list">
          {storeOptions.map((info) => {
            const active = currentRoleInfo?.store_id === info.store_id
            return (
              <Cell
                className={`store-item ${active ? 'active' : ''}`}
                onClick={() => handleStoreChange(info)}
                key={info.store_id}
              >
                <View className="store-name">
                  {info.store_name}
                  {active && <Check size="18" className="active-icon" />}
                </View>
              </Cell>
            )
          })}
        </ScrollView>
      </View>
    </Popup>
  )
}

export default StoreSelect
