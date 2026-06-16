import { View, Text, Image } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { PlayStart } from '@nutui/icons-react-taro'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { SuccessCode } from '@/common/constants/constants'
import {
  StaticAPI,
  STATIC_FILE_TYPE_INSTRUCTION_PRODUCT,
} from '@/request/staticApi'

interface StepCompleteProps {
  vin: string
  summaryLines: string[]
  showProductVideo?: boolean
  onRestart: () => void
}

export function StepComplete({
  vin,
  summaryLines,
  showProductVideo = false,
  onRestart,
}: StepCompleteProps) {
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [posterUrl, setPosterUrl] = useState('')

  useEffect(() => {
    if (!showProductVideo) {
      setVideoUrl('')
      setPosterUrl('')
      return
    }

    let cancelled = false
    const loadProductVideo = async () => {
      setVideoLoading(true)
      try {
        const res = await StaticAPI.getStaticResource({
          file_type: STATIC_FILE_TYPE_INSTRUCTION_PRODUCT,
        })
        if (cancelled) return
        if (res?.response_status?.code !== SuccessCode) {
          Taro.showToast({
            title: res?.response_status?.msg || '获取产品介绍视频失败',
            icon: 'none',
          })
          return
        }
        const item = res.data?.item_list?.find(
          (i) => i.file_type === STATIC_FILE_TYPE_INSTRUCTION_PRODUCT,
        )
        if (item?.url) {
          setVideoUrl(item.url)
          setPosterUrl(item.poster_url || '')
        }
      } finally {
        if (!cancelled) {
          setVideoLoading(false)
        }
      }
    }

    loadProductVideo()
    return () => {
      cancelled = true
    }
  }, [showProductVideo])

  const handlePreviewVideo = () => {
    if (!videoUrl) {
      Taro.showToast({ title: '产品介绍视频暂不可用', icon: 'none' })
      return
    }
    Taro.previewMedia({
      sources: [{
        url: videoUrl,
        type: 'video',
      }],
    })
  }

  return (
    <View className='wizard-step wizard-step--complete'>
      <View className='complete-ring'>
        <Text className='complete-percent'>100%</Text>
      </View>
      <View className='wizard-step-title' style={{ textAlign: 'center' }}>
        入场检测完成
      </View>
      <Text className='wizard-step-desc' style={{ textAlign: 'center' }}>
        车架号 {vin}
      </Text>
      <View className='complete-summary'>
        {summaryLines.map((line) => (
          <Text key={line} className='complete-summary-line'>
            {line}
          </Text>
        ))}
      </View>
      {showProductVideo ? (
        <View className='product-intro' style={{ marginTop: 16, textAlign: 'left' }}>
          <View className='repair-alert'>
            <Text className='repair-alert-title'>向车主介绍易达安</Text>
            <Text className='repair-alert-desc'>
              本车未安装易达安设备，请向车主播放以下产品介绍视频，协助推广设备销售。
            </Text>
          </View>
          <View className='repair-tutorial'>
            <Text className='repair-tutorial-title'>易达安产品介绍</Text>
            {videoLoading && <Text className='hint'>视频加载中…</Text>}
            {!videoLoading && videoUrl ? (
              <View className='repair-tutorial-preview' onClick={handlePreviewVideo}>
                {posterUrl ? (
                  <Image
                    className='repair-tutorial-preview-poster'
                    src={posterUrl}
                    mode='aspectFill'
                  />
                ) : null}
                <View className='repair-tutorial-preview-overlay'>
                  <PlayStart size={40} color='#fff' />
                  <Text className='repair-tutorial-preview-text'>点击播放产品介绍</Text>
                </View>
              </View>
            ) : null}
            {!videoLoading && !videoUrl ? (
              <Text className='hint'>产品介绍视频暂不可用，请联系管理员</Text>
            ) : null}
          </View>
        </View>
      ) : null}
      <Button type='primary' block onClick={onRestart} style={{ marginTop: 24 }}>
        再检一台
      </Button>
    </View>
  )
}
