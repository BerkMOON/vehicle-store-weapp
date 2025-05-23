import { View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { DeviceAPI } from '@/request/deviceApi'
import { DeviceList, StatResponse } from '@/request/deviceApi/typings'
import { SuccessCode } from '@/common/constants/constants'
import './index.scss'
import GeneralPage from '@/components/GeneralPage'
import ScrollableList from '@/components/ScrollableList'

function DeviceStat() {
  const [statInfo, setStatInfo] = useState<StatResponse>()

  const fetchStatInfo = async () => {
    try {
      const res = await DeviceAPI.stat()

      if (res?.response_status?.code === SuccessCode) {
        setStatInfo(res.data)
      }
    } catch (error) {
      console.error('获取统计信息失败:', error)
    }
  }

  const fetchDeviceList = async (page) => {
    try {
      const params = {
        page,
        limit: 10,
        report_status: 'reported',
        status: 'init'
      }

      const res = await DeviceAPI.list(params)
      if (res?.response_status?.code === SuccessCode) {
        return res.data.device_list || []
      }
      return []
    } catch (error) {
      console.error('获取设备列表失败:', error)
      return []
    }
  }

  const renderItem = (item: DeviceList) => {
    return (
      <View className='device-item' key={item.sn}>
        <View className='item-header'>
          <View className='sn'>设备号：{item.sn}</View>
          <View className='status'>{item.status.name}</View>
        </View>
        <View className='item-content'>
        <View className='info-row'>
            <View className='label'>门店</View>
            <View className='value'>{item.store_name || '-'}</View>
          </View>
          <View className='info-row'>
            <View className='label'>安装时间</View>
            <View className='value'>{item.onset_time}</View>
          </View>
        </View>
      </View>
    )
  }

  useEffect(() => {
    fetchStatInfo()
  }, [])

  return (
    <GeneralPage>
      <View className='page'>
        <View className='device-stat'>
          <View className='stat-card'>
            <View className='stat-content'>
              <View className='stat-row'>
                <View className='stat-item'>
                  <View className='label'>总设备数</View>
                  <View className='value highlight'>{statInfo?.total || 0}</View>
                </View>
                <View className='stat-item'>
                  <View className='label'>已绑定设备</View>
                  <View className='value'>{statInfo?.bound || 0}</View>
                </View>
                <View className='stat-item'>
                  <View className='label'>未绑定设备</View>
                  <View className='value'>{statInfo?.not_bound || 0}</View>
                </View>
              </View>
              <View className='divider' />
              <View className='stat-row'>
                <View className='stat-item'>
                  <View className='label'>上路设备</View>
                  <View className='value'>{statInfo?.reported_in_bound || 0}</View>
                </View>
                <View className='stat-item'>
                  <View className='label'>未安装已绑定</View>
                  <View className='value'>{statInfo?.unreported_in_bound || 0}</View>
                </View>
              </View>
              <View className='stat-row'>
                <View className='stat-item'>
                  <View className='label'>已安装未绑定</View>
                  <View className='value'>{statInfo?.reported_in_not_bound || 0}</View>
                </View>
                <View className='stat-item'>
                  <View className='label'>库存设备</View>
                  <View className='value'>{statInfo?.unreported_in_not_bound || 0}</View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className='list-title'>已安装未绑定设备列表</View>
        <ScrollableList
          className='device-list'
          fetchData={fetchDeviceList}
          renderItem={renderItem}
          emptyText='暂无已安装未绑定设备'
        />
      </View>
    </GeneralPage>
  )
}

export default DeviceStat