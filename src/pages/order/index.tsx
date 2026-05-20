import { Text, View } from '@tarojs/components'
import { Button, Form } from '@nutui/nutui-react-taro'
import Taro, { useDidShow } from '@tarojs/taro'
import './index.scss'
import GeneralPage from '@/components/GeneralPage'
import ScrollableTabList from '@/components/ScrollableTabList'
import { TaskAPI, TaskStatus, TaskType } from '@/request/taskApi'
import { useRef, useState, useCallback } from 'react'
import { TaskInfo } from '@/request/taskApi/typings'
import FollowPopup from './components/FollowPopup'
import FilterPopup from './components/FilterPopup'
import { SuccessCode } from '@/common/constants/constants'
import { Filter } from '@nutui/icons-react-taro'

const tabs = [
  { title: '待认领', value: TaskStatus.Pending },
  { title: '已认领', value: TaskStatus.Processing },
  { title: '待返厂', value: TaskStatus.WaitingForReturn },
  { title: '已返厂', value: TaskStatus.Returned },
  { title: '战败', value: TaskStatus.Rejected },
  { title: '全部', value: TaskStatus.All },
]

function Index() {
  const [activeTab, setActiveTab] = useState<string>(TaskStatus.Pending)
  const scrollableTabRef = useRef<any>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [form] = Form.useForm()

  const dateRange = Form.useWatch('date_range', form)

  const fetchData = useCallback(async ({ status, page }: { status: string; page: number }) => {
    const params: any = {
      offset: (page - 1) * 10,
      limit: 10
    }

    if (status !== TaskStatus.All) {
      params.status = status
    }

    // 直接从表单获取时间筛选参数
    const dateRange = form.getFieldValue('date_range')
    if (dateRange && dateRange.length >= 2) {
      params.start_time = dateRange[0] + ' 00:00:00'
      params.end_time = dateRange[1] + ' 23:59:59'
    }

    console.log('fetchData params:', params)
    console.log('dateRange:', dateRange)

    const res = await TaskAPI.List(params)
    return res?.data?.task_list || []
  }, [form])

  const handleViewDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?clueId=${id}`
    })
  }

  const handleTransfer = async (order: TaskInfo) => {
    try {
      const res = await TaskAPI.Accept({
        clue_id: order.clue_id,
        task_id: order.id
      })

      if (res?.response_status?.code === SuccessCode) {
        Taro.showToast({
          title: '认领成功',
          icon: 'success'
        })
        // 刷新列表
        scrollableTabRef.current?.refresh()
      } else {
        Taro.showToast({
          title: res?.response_status?.msg || '认领失败',
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '认领失败',
        icon: 'error'
      })
    }
  }

  const [showFollow, setShowFollow] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<TaskInfo | null>(null)

  const handleFollow = (order: TaskInfo) => {
    setCurrentOrder(order)
    setShowFollow(true)
  }

  const handleFollowSubmit = async (values: { status: string; remark: string }) => {
    try {
      const res = await TaskAPI.Process({
        task_id: currentOrder!.id,
        clue_id: currentOrder!.clue_id,
        status: values.status,
        remark: values.remark
      })

      if (res?.response_status?.code === SuccessCode) {
        Taro.showToast({
          title: '跟进成功',
          icon: 'success'
        })
        setShowFollow(false)
        scrollableTabRef.current?.refresh()
      } else {
        Taro.showToast({
          title: res?.response_status?.msg || '跟进失败',
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '跟进失败',
        icon: 'error'
      })
    }
  }

  const handleFilterConfirm = () => {
    // 直接刷新列表数据，fetchData 会从表单获取筛选条件
    scrollableTabRef.current?.refresh()
  }

  const handleFilterReset = () => {
    form.setFieldsValue({
      date_range: []
    })
    // 刷新列表数据
    scrollableTabRef.current?.refresh()
  }

  useDidShow(() => {
    // 调用组件的刷新方法
    scrollableTabRef.current?.refresh()
  })

  const renderItem = (order: TaskInfo) => {
    return (
      <View className='work-order-item' key={order.clue_id} onClick={() => handleViewDetail(order.clue_id)}>
        <View className='order-header'>
          <Text className='order-number'>工单号：</Text>
          <Text className='order-text'>{order.clue_id}</Text>
        </View>

        <View className='order-content'>
          <View className='content-row'>
            <View className='label'>车架号：</View>
            <View className='value'>{order.vin}</View>
          </View>
          <View className='content-row'>
            <View className='label'>上报时间</View>
            <View className='value'>{order.report_time}</View>
          </View>
          <View className='content-row'>
            <View className='label'>事故级别</View>
            <View className='value'>{order.level}</View>
          </View>
          <View className='content-row'>
            <View className='label'>设备号</View>
            <View className='value'>{order.sn}</View>
          </View>
          <View className='content-row'>
            <View className='label'>车辆型号</View>
            <View className='value'>{order?.brand ? `${order?.brand}-${order?.car_model}` : '暂无'}</View>
          </View>
          <View className='content-row'>
            <View className='label'>处理人</View>
            <View className='value'>{order.handler_name}</View>
          </View>
          <View className='content-row'>
            <View className='label'>状态</View>
            <View className='value'>{order.status.name}</View>
          </View>
          <View className='content-row'>
            <View className='label'>备注</View>
            <View className='value'>{order.remark}</View>
          </View>
        </View>

        <View className='order-footer'>
          <Button size='small' onClick={(e) => {
            e.stopPropagation()
            handleViewDetail(order.clue_id)
          }}>
            查看详情
          </Button>
          {
            order.status.code === TaskType.Pending ?
              <Button size='small' color="#4e54c8" onClick={(e) => {
                e.stopPropagation()
                handleTransfer(order)
              }}>
                认领
              </Button> : null
          }
          {
            order.status.code !== TaskType.Pending && <Button size='small' color="#4e54c8" onClick={(e) => {
              e.stopPropagation()
              handleFollow(order)
            }}>
              跟进
            </Button>
          }
        </View>
      </View>
    )
  }

  return (
    <GeneralPage>
      <View className='index-container'>
        <View className='filter-header'>
          <View className='filter-info'>
            {(() => {
              return dateRange && dateRange.length >= 2 ? (
                <Text className='filter-text'>
                  已筛选: {dateRange[0]} 至 {dateRange[1]}
                </Text>
              ) : null
            })()}
          </View>
          <View className='filter-buttons'>
            {(() => {
              return dateRange && dateRange.length >= 2 ? (
                <Button 
                  size='small' 
                  fill='outline' 
                  onClick={handleFilterReset}
                  style={{ marginRight: '8px' }}
                >
                  重置
                </Button>
              ) : null
            })()}
            <Button 
              size='small' 
              fill='outline' 
              icon={<Filter size={16} />}
              onClick={() => setShowFilter(true)}
            >
              筛选
            </Button>
          </View>
        </View>
        <ScrollableTabList
          ref={scrollableTabRef}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          fetchData={fetchData}
          renderItem={renderItem}
          emptyText='暂无工单数据'
          className='fixed-tabs'
          autoLoad={false}
        />
        <FollowPopup
          visible={showFollow}
          onClose={() => setShowFollow(false)}
          onSubmit={handleFollowSubmit}
        />
        <FilterPopup
          visible={showFilter}
          onClose={() => setShowFilter(false)}
          onConfirm={handleFilterConfirm}
          form={form}
        />
      </View>
    </GeneralPage>
  )
}

export default Index
