import { View } from '@tarojs/components'
import { Button, Form } from '@nutui/nutui-react-taro'
import { useEffect, useRef, useState } from 'react'
import GeneralPage from '@/components/GeneralPage'
import ScrollableList from '@/components/ScrollableList'
import './index.scss'
import { DeviceAPI } from '@/request/deviceApi'
import { LossInfo, LossRequest } from '@/request/deviceApi/typings'
import dayjs from 'dayjs'
import FilterPopup from './components/FilterPopup'

function LostReminder() {
  const listRef = useRef<{ refresh: () => void }>()
  const [total, setTotal] = useState<number>()

  const [showFilter, setShowFilter] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      date_range: [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    })
    listRef.current?.refresh()
  }, [])

  const { date_range, sn } = form.getFieldsValue(true)

  const fetchData = async (page: number) => {
    const { sn, date_range: dateRange } = form.getFieldsValue(true)
    const params: LossRequest = {
      page,
      limit: 10,
      ...(sn && { sn }),
      ...(dateRange && {
        start_time: dateRange?.[0],
        end_time: dateRange?.[1],
      }),
    }
    const res = await DeviceAPI.getLossNotifications(params)
    setTotal(res?.data.meta.total_count)
    return res?.data?.record_list || []
  }

  const handleClick = (sn: string) => {
    form.setFieldsValue({
      sn,
    })
    listRef.current?.refresh()
  }

  const renderItem = (lossInfo: LossInfo) => (
    <View className='user-item'>
      <View className='user-info'>
        <View className='info-row'>
          <View className='label'>用户SN：</View>
          <View onClick={() => handleClick(lossInfo.sn || '')} className='value clickable'>{lossInfo.sn}</View>
        </View>
        <View className='info-row'>
          <View className='label'>用户车型：</View>
          <View className='value'>{lossInfo.car_model}</View>
        </View>
        <View className='info-row'>
          <View className='label'>手机号：</View>
          <View className='value'>{lossInfo.phone || '-'}</View>
        </View>
        <View className='info-row'>
          <View className='label'>触发时间：</View>
          <View className='value'>{lossInfo.trigger_time}</View>
        </View>
        <View className='info-row'>
          <View className='label'>触发地点：</View>
          <View className='value'>
            {lossInfo.nearby_points?.[0].name}
          </View>
        </View>
        <View className='info-row'>
          <View className='label'>具体位置：</View>
          <View className='value'>
            {lossInfo.nearby_points?.[0].city}{lossInfo.nearby_points?.[0].district}{lossInfo.nearby_points?.[0].address}
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <GeneralPage>
      <View className='loss-container'>
        <View className='header'>
          <View className='filter'>
            <View>
              <View className='filter-label'>
                日期区间
              </View>
              <View className='filter-value'>
                {date_range ? `${date_range[0]}至${date_range[1]}` : '全部日期'}
              </View>
            </View>
            <View className='filter-item'>
              <View className='filter-label'>
                SN号
              </View>
              <View className='filter-value'>
                {sn ? sn : '无'}
              </View>
            </View>
          </View>
          <Button color='#4e54c8' className='filter-btn' onClick={() => setShowFilter(true)}>筛选</Button>
        </View>

        {total && <View className='stats-card'>
          <View className='stats-item'>
            <View className='stats-label'>可能流失数量</View>
            <View className='stats-value'>{total}</View>
          </View>
        </View>}

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
        onReset={() => {
          form.setFieldsValue({
            date_range: [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
            sn: ''
          })
        }}
        form={form}
      />
    </GeneralPage >
  )
}

export default LostReminder