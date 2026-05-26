import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import { PlayStart } from '@nutui/icons-react-taro'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { SuccessCode } from '@/common/constants/constants'
import {
  StaticAPI,
  STATIC_FILE_TYPE_REPAIR_DEVICE_VIDEO,
} from '@/request/staticApi'

interface StepRepairProps {
  needsRepair: boolean
  loading: boolean
  onContinue: () => void
  onBack?: () => void
}

export function StepRepair({ needsRepair, loading, onContinue, onBack }: StepRepairProps) {
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    if (loading || !needsRepair) {
      setVideoUrl('')
      return
    }

    let cancelled = false
    const loadRepairVideo = async () => {
      setVideoLoading(true)
      try {
        const res = await StaticAPI.getStaticResource({
          file_type: STATIC_FILE_TYPE_REPAIR_DEVICE_VIDEO,
        })
        if (cancelled) return
        if (res?.response_status?.code !== SuccessCode) {
          Taro.showToast({
            title: res?.response_status?.msg || '获取修复教程失败',
            icon: 'none',
          })
          return
        }
        const url = res.data?.item_list?.find(
          (item) => item.file_type === STATIC_FILE_TYPE_REPAIR_DEVICE_VIDEO,
        )?.url
        if (url) {
          setVideoUrl(url)
        }
      } finally {
        if (!cancelled) {
          setVideoLoading(false)
        }
      }
    }

    loadRepairVideo()
    return () => {
      cancelled = true
    }
  }, [loading, needsRepair])

  const handlePreviewVideo = () => {
    if (!videoUrl) {
      Taro.showToast({ title: '教程视频暂不可用', icon: 'none' })
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
    <View className='wizard-step'>
      <View className='wizard-step-title'>设备检测</View>
      {loading && <Text className='hint'>正在检测…</Text>}
      {!loading && needsRepair && (
        <>
          <View className='repair-alert'>
            <Text className='repair-alert-title'>设备需修复</Text>
            <Text className='repair-alert-desc'>
              当前设备未达门店要求（可能长期未上线或版本过旧），请按教程完成线下修复后再继续。
            </Text>
          </View>
          <View className='repair-tutorial'>
            <Text className='repair-tutorial-title'>修复教程</Text>
            {videoLoading && <Text className='hint'>教程加载中…</Text>}
            {!videoLoading && videoUrl ? (
              <View className='repair-tutorial-preview' onClick={handlePreviewVideo}>
                <PlayStart size={40} />
                <Text className='repair-tutorial-preview-text'>点击播放修复教程</Text>
              </View>
            ) : null}
            {!videoLoading && !videoUrl ? (
              <Text className='hint'>使用固件更新卡进行固件更新</Text>
            ) : null}
          </View>
        </>
      )}
      {!loading && !needsRepair && (
        <View className='success' style={{ marginTop: 12 }}>
          设备状态正常，无需修复，可继续下一步。
        </View>
      )}
      <Button type='primary' block disabled={loading} onClick={onContinue} style={{ marginTop: 20 }}>
        {needsRepair ? '已修复，下一步' : '下一步'}
      </Button>
      {onBack ? (
        <Button block fill='outline' onClick={onBack} style={{ marginTop: 12 }}>
          上一步
        </Button>
      ) : null}
    </View>
  )
}
