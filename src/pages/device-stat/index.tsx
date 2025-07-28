import { View } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { DeviceAPI } from '@/request/deviceApi'
import { DeviceList, StatResponse } from '@/request/deviceApi/typings'
import { SuccessCode } from '@/common/constants/constants'
import './index.scss'
import GeneralPage from '@/components/GeneralPage'
import ScrollableList from '@/components/ScrollableList'
import { ArrowExchange, Download } from '@nutui/icons-react-taro'
import { createXlsxFile } from '@/utils/downloadXlsx'
import { fetchAllPaginatedData } from '@/utils/request'
import Taro from '@tarojs/taro'
import { Button, Divider } from '@nutui/nutui-react-taro'
import dayjs from 'dayjs'
import { StateTypeEnum, StateTypeMap, DeviceStatParamsMap, StatKeyAndNamesMap, StatInfoList } from './constants'
import { useUserStore } from '@/store/user'
import StoreSelect from '@/components/StoreSelect'

function DeviceStat() {
  const [statInfo, setStatInfo] = useState<StatResponse>()
  const scrollRef = useRef<{ refresh: () => void }>()
  const [stateType, setStateType] = useState<StateTypeEnum>(StateTypeEnum.NotBoundAndReported);
  const [fetchParams, setFetchParams] = useState<any>({ report_status: 'reported', status: 'init' });
  const { currentRoleInfo } = useUserStore((state) => state)
  const [visible, setVisible] = useState(false)

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

  const fetchDeviceList = async (page, extraParmas) => {
    try {
      const params = {
        page,
        limit: 10,
        ...extraParmas
      };

      const res = await DeviceAPI.list(params);
      if (res?.response_status?.code === SuccessCode) {
        return res.data.device_list || [];
      }
      return [];
    } catch (error) {
      console.error('获取设备列表失败:', error);
      return [];
    }
  };

  const switchInfo = (type: StateTypeEnum) => {
    setStateType(type);
    // 假设根据不同的 stateType 设置不同的 report_status 和 status
    setFetchParams(DeviceStatParamsMap[type]);
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
          {item.onset_time &&
            <View className='info-row'>
              <View className='label'>安装时间</View>
              <View className='value'>{item.onset_time}</View>
            </View>
          }
          {item.car_model &&
            <View className='info-row'>
              <View className='label'>车型</View>
              <View className='value'>{item.car_model}</View>
            </View>
          }
          {item.vin &&
            <View className='info-row'>
              <View className='label'>车架号</View>
              <View className='value'>{item.vin}</View>
            </View>
          }
        </View>
      </View>
    )
  }

  useEffect(() => {
    fetchStatInfo()
  }, [])

  const downloadXlsx = async (type: StateTypeEnum) => {
    Taro.showLoading({
      title: '下载中...'
    })
    try {
      const data = await fetchAllPaginatedData(DeviceAPI.list, DeviceStatParamsMap[type], {
        responseKey: 'device_list',
        pageSize: 100,
      })

      if (data.length > 0) {
        createXlsxFile({
          data,
          fileName: `${StateTypeMap[type]}设备列表截止${dayjs().format('M月D日')}`,
          keyAndNames: StatKeyAndNamesMap[type],
        })
        Taro.hideLoading()
      } else {
        Taro.hideLoading()
        Taro.showToast({
          title: '暂无数据',
          icon: 'none'
        })
      }
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({
        title: '下载失败',
        icon: 'none'
      })
      console.error('下载失败:', error)
    } finally {
      Taro.hideLoading()
    }
  }

  return (
    <GeneralPage>
      <View className='page'>
        <View className='device-stat'>
          <View onClick={() => setVisible(true)} className='store-name'>{currentRoleInfo?.store_name} 
            <ArrowExchange className='icon-m' size={16} />
          </View>
          <View className='stat-card'>
            <View className='stat-content'>
              {
                StatInfoList.map((list, index) => (
                  <>
                    <View className='stat-row' key={index}>
                      {
                        list.map(item => (
                          <View className={`stat-item ${stateType === item.state ? 'active' : ''}`} onClick={() => switchInfo(item.state)} key={item.state}>
                            <View className='label' >{item.title}</View>
                            <View className='value'>{statInfo?.[item.key] || 0}</View>
                          </View>
                        ))
                      }
                    </View>
                    {
                      index !== StatInfoList.length - 1 && (
                        <Divider />
                      )
                    }
                  </>
                ))
              }
            </View>
          </View>
        </View>

        <View className='list-title'>
          {StateTypeMap[stateType]}设备列表
          <Button color="#4e54c8" onClick={() => downloadXlsx(stateType)}>
            <View className='download-icon'>导出 <Download style={{ marginLeft: '4px' }} /></View>
          </Button>
        </View>
        <ScrollableList
          ref={scrollRef}
          className='device-list'
          fetchData={fetchDeviceList}
          fetchParams={fetchParams}
          renderItem={renderItem}
          emptyText={`暂无${StateTypeMap[stateType]}设备`}
        />
      </View>
      <StoreSelect visible={visible} setVisible={setVisible}></StoreSelect>
    </GeneralPage>
  )
}

export default DeviceStat