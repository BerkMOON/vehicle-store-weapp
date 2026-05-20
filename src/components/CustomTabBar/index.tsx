import Taro from '@tarojs/taro'
import { Tabbar } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import { TabInfo, useTabInfoStore } from '@/store/tabInfo'
import { Role } from '@/common/constants/constants'
import { useUserStore } from '@/store/user'
import { getTab } from '@/utils/utils'

function CustomTabBar() {
  const {
    tabInfo,
    setTabInfo
  } = useTabInfoStore()
  const { currentRoleInfo } = useUserStore()
  const [tabList, setTabList] = useState<TabInfo[]>([])

  useEffect(() => {
    const role = currentRoleInfo?.role
    const tabList = getTab(role as Role)
    setTabList(tabList)
    if (!tabInfo) {
      setTabInfo(tabList[0])
    }


    // 添加小程序隐藏和卸载时的清理函数
    const clearTabInfo = () => {
      setTabInfo(null)
    }

    return () => {
      clearTabInfo()
      Taro.offAppHide(clearTabInfo)
    }
  }, [])


  const switchTab = (tabInfo: TabInfo) => {
    setTabInfo(tabInfo)
    Taro.switchTab({
      url: tabInfo.pagePath || ''
    })
  }

  return (
    <Tabbar
      fixed
      style={{
        zIndex: 999
      }}
      inactiveColor="#7d7e80" activeColor="#4e54c8"
      onSwitch={(value) => {
        switchTab(tabList[value])
      }}
      value={tabList.findIndex(item => tabInfo?.pagePath === item.pagePath)}
    >
      {
        tabList.map(item => (
          <Tabbar.Item title={item.text} icon={item.icon} />
        ))
      }
    </Tabbar>
  )
}

export default CustomTabBar