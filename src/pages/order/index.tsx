import { Text, View } from '@tarojs/components'
import { BackTop, Button } from '@nutui/nutui-react-taro'
import Taro, { useDidShow } from '@tarojs/taro'
import './index.scss'
import GeneralPage from '@/components/GeneralPage'
import ScrollableTabList from '@/components/ScrollableTabList'
import { TaskAPI, TaskStatus, TaskType } from '@/request/taskApi'
import { useRef, useState } from 'react'
import { TaskInfo } from '@/request/taskApi/typings'
import FollowPopup from './components/FollowPopup'
import { SuccessCode } from '@/common/constants/constants'

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

  const fetchData = async ({ status, page }: { status: string; page: number }) => {
    const params: any = {
      offset: (page - 1) * 10,
      limit: 10
    }

    if (status !== TaskStatus.All) {
      params.status = status
    }

    const res = await TaskAPI.List(params)
    return res?.data?.task_list || []
  }

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
          <Button size='small' color="#4e54c8" onClick={(e) => {
            e.stopPropagation()
            handleFollow(order)
          }}>
            跟进
          </Button>
        </View>
      </View>
    )
  }

  return (
    <GeneralPage>
      <View className='index-container'>
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
      </View>
    </GeneralPage>
  )
}

export default Index
