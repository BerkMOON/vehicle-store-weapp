import { View, Text, Video } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { useEffect, useState } from 'react'
import './index.scss'
import { TaskAPI } from '@/request/taskApi'
import { useRouter } from '@tarojs/taro'
import { TaskInfo } from '@/request/taskApi/typings'
import Taro from '@tarojs/taro'

function OrderDetail() {
  const router = useRouter()
  const [orderInfo, setOrderInfo] = useState<TaskInfo>()

  const fetchDetail = async () => {
    try {
      const res = await TaskAPI.Detail(
        router.params.taskId || ''
      )
      if (res?.response_status?.code === 200) {
        setOrderInfo(res?.data)
      }
    } catch (error) {
      console.error('获取详情失败:', error)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [router.params.taskId])

  const handleAction = (type: 'confirm' | 'transfer' | 'updateValue' | 'follow') => {
    console.log('操作类型：', type)
  }

  const [localVideoUrl, setLocalVideoUrl] = useState<string>('')

  useEffect(() => {
    if (orderInfo?.video_url) {
      Taro.downloadFile({
        url: orderInfo.video_url,
        success: (res) => {
          if (res.statusCode === 200) {
            console.log('视频预加载成功')
            setLocalVideoUrl(res.tempFilePath)
          }
        },
        fail: (err) => {
          console.error('视频预加载失败:', err)
        }
      })
    }
  }, [orderInfo?.video_url])

  return (
    <View className='order-detail'>
      {/* 头部信息 */}
      <View className='header'>
        <View className='order-base'>
          <View className='order-no'>
            <Text className='label'>工单号：</Text>
            <Text className='value'>{orderInfo?.clue_id}</Text>
          </View>
        </View>
        <View className='car-info'>
          <Text className='label'>状态：</Text>
          <Text className='status'>{orderInfo?.status.name}</Text>
        </View>
      </View>

      {/* 跟进记录 */}
      <View className='section'>
        <View className='section-title'>跟进记录</View>
        <View className='follow-record'>
          <View>首次跟进：{orderInfo?.create_time}</View>
          <View>跟进人：{orderInfo?.handler_name}</View>
        </View>
      </View>

      {/* DVR线索信息 */}
      <View className='section'>
        <View className='section-title'>线索信息</View>
        <View className='follow-record'>
          <View>车架号：{orderInfo?.vin || '-'}</View>
          <View>设备号：{orderInfo?.device_id}</View>
          <View>备注信息：{orderInfo?.remark || '-'}</View>
        </View>
      </View>

      {/* 车辆服务状况 */}
      {/* <View className='section'>
        <View className='section-title'>车辆服务状况</View>
        <OrderContent items={orderInfo.serviceInfo} />
      </View> */}

      {/* 视频详情 */}
      <View className='section'>
        <View className='section-title'>视频详情</View>
        <View className='video-section'>
          {localVideoUrl ? (
            <Video
              src={localVideoUrl}
              controls
              showFullscreenBtn
              showPlayBtn
              showCenterPlayBtn
              enableProgressGesture
              className='video'
            />
          ) : (
            <View className='loading'>视频加载中...</View>
          )}
        </View>
      </View>

      {/* 底部按钮 */}
      <View className='footer'>
        <Button
          className='action-btn'
          onClick={() => handleAction('transfer')}
        >
          认领
        </Button>
        <Button
          className='action-btn primary'
          onClick={() => handleAction('follow')}
        >
          跟进
        </Button>
      </View>
    </View>
  )
}

export default OrderDetail