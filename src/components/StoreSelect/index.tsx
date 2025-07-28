import { Cell, Popup } from "@nutui/nutui-react-taro"
import { View } from "@tarojs/components"
import { useUserStore } from "@/store/user"
import { useAuth } from "@/hooks/useAuth"
import Taro from "@tarojs/taro"
import './index.scss'
import { Check } from "@nutui/icons-react-taro"

const StoreSelect = ({ visible, setVisible }) => {
  const { setCurrentRoleInfo, userInfo, currentRoleInfo } = useUserStore()
  const { checkLoginStatus } = useAuth(false)

  const storeList = userInfo?.role_list || []

  const handleStoreChange = (roleInfo) => {
    setCurrentRoleInfo(roleInfo)
    setVisible(false)
    Taro.showToast({
      title: '已切换到门店: ' + roleInfo.store_name,
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
      onClose={() => {
        setVisible(false)
      }}
      position="bottom"
      className="store-select-popup"
      style={{ height: "70%", borderRadius: "16px 16px 0 0" }}
    >
      <View className="popup-header">
        <View className="popup-title">选择门店</View>
      </View>
      <View className="store-list">
        {storeList.map((info, i) => (
          <Cell className={`store-item ${currentRoleInfo?.store_id === info.store_id ? 'active' : ''}`} onClick={() => handleStoreChange(info)} key={i}>
            <View className="store-name">
              {info.store_name}
              {currentRoleInfo?.store_id === info.store_id && (
                <Check size="18" className="active-icon" />
              )}
            </View>
          </Cell>
        ))}
      </View>
    </Popup>
  )
}

export default StoreSelect