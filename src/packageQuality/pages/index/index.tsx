import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { MessageType, QualityMessage, DeviceInfo, CheckResult } from './types'
import './index.scss'
import { SuccessCode } from '@/common/constants/constants'

function QualityCheck() {
  const [checking, setChecking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [systemStatus, setSystemStatus] = useState<'normal' | 'error'>('normal')
  const pollingTimer = useRef<any>(null)
  const currentSN = useRef<string>('')

  // 开始轮询检查状态
  const startPolling = (sn: string) => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current)
    }

    currentSN.current = sn
    setChecking(true)
    setProgress(0)
    setCheckResult(null)

    // 立即执行一次
    checkStatus(sn)

    // 每3秒轮询一次
    pollingTimer.current = setInterval(() => {
      checkStatus(sn)
    }, 3000)
  }

  // 停止轮询
  const stopPolling = () => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current)
      pollingTimer.current = null
    }
    currentSN.current = ''
    setChecking(false)
  }

  // 检查状态
  const checkStatus = async (sn: string) => {
    try {
      const res = await Taro.request({
        url: 'http://192.168.8.132:8888/api/check/status',
        method: 'GET',
        data: { sn }
      })

      const { code, data, message } = res.data

      if (code === SuccessCode) {
        handleStatusData(data)
      } else {
        Taro.showToast({
          title: message || '获取状态失败',
          icon: 'error'
        })
        stopPolling()
      }
    } catch (error) {
      console.error('获取状态失败：', error)
      stopPolling()
    }
  }

  // 处理状态数据
  const handleStatusData = (data: any) => {
    const { status, progress, deviceInfo, checkResult } = data

    if (deviceInfo) {
      setDeviceInfo(deviceInfo)
    }

    if (typeof progress === 'number') {
      setProgress(progress)
    }

    if (checkResult) {
      setCheckResult(checkResult)
      stopPolling()
    }

    if (status === 'error') {
      Taro.showToast({
        title: data.message || '质检失败',
        icon: 'error'
      })
      stopPolling()
    }
  }

  // 扫描设备二维码
  const handleScan = async () => {
    try {
      const res = await Taro.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode']
      })

      if (res.result) {
        // 发起质检请求
        const checkRes = await Taro.request({
          url: 'http://192.168.8.132:8888/api/check/start',
          method: 'POST',
          data: {
            sn: res.result
          }
        })

        if (checkRes.data.code === SuccessCode) {
          startPolling(res.result)
        } else {
          Taro.showToast({
            title: checkRes.data.message || '启动质检失败',
            icon: 'error'
          })
        }
      }
    } catch (error) {
      console.error('扫码失败：', error)
      Taro.showToast({
        title: '扫码失败',
        icon: 'error'
      })
    }
  }

  // 组件卸载时清理轮询
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [])

  return (
    <View className='quality-check'>
      <View className='connection-status'>
        <View>系统状态：{systemStatus === 'normal' ? '正常' : '异常'}</View>
      </View>

      {/* 其他UI部分保持不变 */}
    </View>
  )
}

export default QualityCheck