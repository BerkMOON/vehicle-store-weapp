import { View, Text, Video } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { useEffect, useState } from 'react'
import './index.scss'
import { TaskAPI } from '@/request/taskApi'
import { useRouter } from '@tarojs/taro'
import { TaskInfo } from '@/request/taskApi/typings'
import Taro from '@tarojs/taro'
import { MapAPI } from '@/request/mapApi'

function OrderDetail() {
  const router = useRouter()
  const [orderInfo, setOrderInfo] = useState<TaskInfo>()
  const [localVideoUrl, setLocalVideoUrl] = useState<string>('')
  const [addressInfo, setAddressInfo] = useState<string>('')

  const fetchDetail = async () => {
    try {
      const res = await TaskAPI.Detail(
        router.params.clueId || ''
      )
      if (res?.response_status?.code === 200) {
        setOrderInfo(res?.data)

        if (res?.data.gps?.lng && res?.data.gps?.lat) {
          const gdMapInfo = await MapAPI.getGDAddressInfo({
            location: `${res.data.gps.lng},${res.data.gps.lat}`
          })
          const address = gdMapInfo?.regeocode?.formatted_address
          setAddressInfo(address)
        }
      }
    } catch (error) {
      console.error('获取详情失败:', error)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [router.params.clueId])

  const handleAction = (type: 'confirm' | 'transfer' | 'updateValue' | 'follow') => {
    console.log('操作类型：', type)
  }


  const handleLocation = () => {
    Taro.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        Taro.openLocation({
          latitude,
          longitude,
          scale: 18,
          name: '事故位置',
          address: addressInfo
        })
      }
    })
    // Taro.openLocation({
    //   latitude: 116.407497,
    //   longitude: 39.902949,
    //   scale: 18,
    //   name: '事故位置',
    //   address: addressInfo
    // })
  }

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

      {/* 事故地点 */}
      {
        addressInfo && <View className='section'>
          <View className='section-title'>事故地点</View>
          <View className='follow-record'>
            <View>地点信息：{addressInfo}</View>
            <View className='address-info'>
              <Button color='#4e54c8' onClick={handleLocation}>路线规划</Button>
            </View>
          </View>
        </View>
      }

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