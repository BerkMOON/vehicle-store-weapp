import { View } from '@tarojs/components'
import { Button, Form, NoticeBar } from '@nutui/nutui-react-taro'
import { useEffect, useRef, useState } from 'react'
import GeneralPage from '@/components/GeneralPage'
import ScrollableList from '@/components/ScrollableList'
import './index.scss'
import { DeviceAPI } from '@/request/deviceApi'
import { MileageReminderInfo, MileageReminderRequest } from '@/request/deviceApi/typings'
import dayjs from 'dayjs'
import FilterPopup from './components/FilterPopup'
import { Copy, Download } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import { fetchAllPaginatedData } from '@/utils/request'
import { createXlsxFile } from '@/utils/downloadXlsx'
import { MileageNameMap } from '@/common/constants/constants'

function MileageReminder() {
  const listRef = useRef<{ refresh: () => void }>()

  const [showFilter, setShowFilter] = useState(false)
  const [form] = Form.useForm()
  const [selectedSn, setSelectedSn] = useState<string>('')

  useEffect(() => {
    listRef.current?.refresh()
  }, [])

  const { mileage, sn } = form.getFieldsValue(true)

  const fetchData = async (page: number) => {
    const { sn, mileage } = form.getFieldsValue(true)
    setSelectedSn(sn || '')
    const params: MileageReminderRequest = {
      page,
      limit: 10,
      ...(sn && { sn }),
      ...(mileage && { mileage }),
    }
    const res = await DeviceAPI.getMileageList(params)
    return res?.data?.item_list || []
  }

  const handleClick = (sn: string) => {
    form.setFieldsValue({
      sn,
    })
    listRef.current?.refresh()
  }

  const handleReset = () => {
    form.setFieldsValue({
      mileage: '',
      sn: ''
    })
  }

  const renderItem = (mileageInfo: MileageReminderInfo) => (
    <View className='user-item'>
      <View className='user-info'>
        <View className='info-row'>
          <View className='label'>用户SN：</View>
          <View onClick={() => handleClick(mileageInfo.sn || '')} className='value clickable'>{mileageInfo.sn}</View>
        </View>
        <View className='info-row'>
          <View className='label'>用户车型：</View>
          <View className='value'>{`${mileageInfo.brand} ${mileageInfo.car_model}`}</View>
        </View>
        <View className='info-row'>
          <View className='label'>用户里程：</View>
          <View className='value'>{mileageInfo.mileage?.toFixed(0) || '-'}km</View>
        </View>
        <View className='info-row'>
          <View className='label'>手机号：</View>
          <View className='value'>{mileageInfo.phone || '-'}
            <Copy size={16} className='copy-icon' onClick={() => {
              Taro.setClipboardData({
                data: mileageInfo.phone || '',
                success: () => {
                  Taro.showToast({
                    title: '手机号已复制',
                    icon: 'success'
                  })
                }
              })
            }} /></View>
        </View>
      </View>
    </View>
  )

  const downloadXlsx = async () => {
    Taro.showLoading({
      title: '下载中...'
    })
    try {
      const data = await fetchAllPaginatedData(DeviceAPI.getMileageList, {
        ...(sn && { sn }),
        ...(mileage && { mileage }),
      }, {
        responseKey: 'item_list',
        pageSize: 100,
      })

      const formattedData = data.map((item: MileageReminderInfo) => ({
        ...item,
        mileage: item.mileage?.toFixed(0) || '-',
      }))

      if (formattedData.length > 0) {
        createXlsxFile({
          data: formattedData,
          fileName: `里程提醒列表-${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
          keyAndNames: MileageNameMap,
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
      <View className='loss-container'>
        <NoticeBar content="里程数据是从2025年9月8日开始统计的，之前的数据并未统计在内" />
        <View className='header'>
          <View className='filter'>
            <View>
              <View className='filter-label'>
                最小里程数
              </View>
              <View className='filter-value'>
                {mileage ? `${mileage}km` : '无'}
              </View>
            </View>
            <View className='filter-item'>
              <View className='filter-label'>
                SN号
              </View>
              <View className='filter-value'>
                {selectedSn ? selectedSn : '无'}
              </View>
            </View>
          </View>
          <View>
            <Button color='#4e54c8' className='filter-btn' onClick={() => setShowFilter(true)}>筛选</Button>
            <Button color='#4e54c8' onClick={() => {
              handleReset()
              listRef.current?.refresh()
            }}>重置</Button>
          </View>
        </View>
        <View className='stats-card'>
          <Button color='#4e54c8' onClick={downloadXlsx}>
            <View className='download-icon'>导出 <Download style={{ marginLeft: '4px' }} /></View>
          </Button>
        </View>

        <ScrollableList
          ref={listRef}
          autoLoad={false}
          fetchData={fetchData}
          renderItem={renderItem}
          emptyText='暂无流失数据'
        />
      </View>

      <FilterPopup
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onSearch={() => {
          setShowFilter(false)
          listRef.current?.refresh()
        }}
        onReset={handleReset}
        form={form}
      />
    </GeneralPage >
  )
}

export default MileageReminder