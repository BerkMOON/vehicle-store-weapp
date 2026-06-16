import Taro from '@tarojs/taro'
import { Tabbar } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import { TabInfo, useTabInfoStore } from '@/store/tabInfo'
import { Role } from '@/common/constants/constants'
import { useUserStore } from '@/store/user'
import { getActiveRoles, getTabsForRoles } from '@/utils/utils'

function CustomTabBar() {
  const { tabInfo, setTabInfo } = useTabInfoStore()
  const { userInfo, currentRoleInfo } = useUserStore()
  const [tabList, setTabList] = useState<TabInfo[]>([])

  useEffect(() => {
    const roles = getActiveRoles(userInfo?.role_list || [], currentRoleInfo)
    const tabs = getTabsForRoles(roles as Role[])
    setTabList(tabs)

    if (!tabs.length) return

    const currentStillValid = tabInfo?.pagePath
      && tabs.some((item) => item.pagePath === tabInfo.pagePath)
    if (!currentStillValid) {
      setTabInfo(tabs[0])
    }

    const clearTabInfo = () => {
      setTabInfo(null)
    }

    Taro.onAppHide(clearTabInfo)
    return () => {
      clearTabInfo()
      Taro.offAppHide(clearTabInfo)
    }
  }, [currentRoleInfo?.store_id, userInfo?.role_list])

  const switchTab = (item: TabInfo) => {
    setTabInfo(item)
    Taro.switchTab({
      url: item.pagePath || ''
    })
  }

  if (!tabList.length) return null

  return (
    <Tabbar
      fixed
      style={{ zIndex: 999 }}
      inactiveColor="#7d7e80"
      activeColor="#4e54c8"
      onSwitch={(value) => {
        switchTab(tabList[value])
      }}
      value={tabList.findIndex((item) => tabInfo?.pagePath === item.pagePath)}
    >
      {tabList.map((item) => (
        <Tabbar.Item key={item.pagePath} title={item.text} icon={item.icon} />
      ))}
    </Tabbar>
  )
}

export default CustomTabBar
