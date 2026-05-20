import { View } from '@tarojs/components'
import { Button, Popup, Input } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './CallConfirmPopup.scss'
import { VoipAPI } from '@/request/voip'
import { SuccessCode } from '@/common/constants/constants'
import { encryptPhone } from '@/utils/utils'

interface CallConfirmPopupProps {
  visible: boolean
  onClose: () => void
  callerPhone: string  // 拨打人的标识（通常是username）
  calleePhone: string  // 被拨打的手机号
}

enum CallStatus {
  Idle = 'idle',           // 空闲状态
  Acquiring = 'acquiring', // 获取虚拟号中
  Calling = 'calling',     // 通话中
  Releasing = 'releasing'  // 释放虚拟号中
}

function CallConfirmPopup({ visible, onClose, callerPhone, calleePhone }: CallConfirmPopupProps) {
  const [phone, setPhone] = useState(callerPhone)
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.Idle)
  const [virtualNumber, setVirtualNumber] = useState('')

  useEffect(() => {
    if (visible) {
      setPhone(callerPhone)
      setCallStatus(CallStatus.Idle)
    }
  }, [visible, callerPhone])

  // 开始拨打
  const handleStartCall = async () => {
    // 如果手机号为空，提示输入
    if (!phone.trim()) {
      Taro.showToast({
        title: '请输入您的手机号',
        icon: 'none'
      })
      return
    }

    // 验证手机号格式
    const phoneReg = /^1[3-9]\d{9}$/
    if (!phoneReg.test(phone.trim())) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    try {
      // 1. 获取虚拟号
      setCallStatus(CallStatus.Acquiring)
      const acquireRes = await VoipAPI.acquirePhone()
      
      if (acquireRes?.response_status?.code !== SuccessCode) {
        Taro.showToast({
          title: acquireRes?.response_status?.msg || '获取虚拟号失败',
          icon: 'none'
        })
        setCallStatus(CallStatus.Idle)
        return
      }

      const virtualPhone = acquireRes?.data?.virtual_number || ''
      setVirtualNumber(virtualPhone)

      // 2. 发起呼叫
      setCallStatus(CallStatus.Calling)
      const callRes = await VoipAPI.makeCall({
        caller: phone,
        callee: calleePhone
      })

      console.log('callRes', callRes)
      if (callRes?.HttpStatusCode !== 200) {
        Taro.showToast({
          title: callRes?.Data?.Message || '呼叫失败',
          icon: 'none'
        })
        // 呼叫失败，释放虚拟号
        await handleReleasePhone()
        return
      }
    } catch (error) {
      console.error('拨打电话失败:', error)
      Taro.showToast({
        title: '拨打失败，请重试',
        icon: 'none'
      })
      // 失败时也要释放虚拟号
      if (callStatus === CallStatus.Calling) {
        await handleReleasePhone()
      } else {
        setCallStatus(CallStatus.Idle)
      }
    }
  }

  // 结束通话（用户挂断电话后点击）
  const handleEndCall = async () => {
    await handleReleasePhone()
    onClose()
  }

  // 释放虚拟号
  const handleReleasePhone = async () => {
    try {
      setCallStatus(CallStatus.Releasing)
      const res = await VoipAPI.releasePhone()
      
      if (res?.response_status?.code === SuccessCode) {
        setCallStatus(CallStatus.Idle)
        setVirtualNumber('')
      } else {
        Taro.showToast({
          title: res?.response_status?.msg || '释放虚拟号失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('释放虚拟号失败:', error)
    }
  }

  // 取消拨打（仅在未开始通话时可用）
  const handleCancel = () => {
    if (callStatus === CallStatus.Idle) {
      onClose()
    }
  }

  const getStatusText = () => {
    switch (callStatus) {
      case CallStatus.Acquiring:
        return '正在获取虚拟号...'
      case CallStatus.Calling:
        return '通话中'
      case CallStatus.Releasing:
        return '正在结束通话...'
      default:
        return ''
    }
  }

  return (
    <Popup
      visible={visible}
      position='bottom'
      closeable={callStatus === CallStatus.Idle}
      onClose={handleCancel}
    >
      <View className='call-confirm-popup'>
        <View className='popup-header'>
          <View className='title'>拨打电话</View>
        </View>

        <View className='popup-content'>
          {/* 被拨打号码 */}
          <View className='info-section'>
            <View className='info-label'>被拨打号码</View>
            <View className='info-value'>{encryptPhone(calleePhone)}</View>
          </View>

          {/* 您的手机号 */}
          <View className='form-section'>
            <View className='form-label'>您的手机号</View>
            <Input
              className='phone-input'
              type='number'
              placeholder='请输入您的手机号'
              value={phone}
              onChange={(val) => setPhone(val)}
              disabled={callStatus !== CallStatus.Idle}
              maxLength={11}
            />
            <View className='form-hint'>
              {phone 
                ? '号码正确可直接拨打，如需修改请重新输入' 
                : '请输入您的手机号，接通后您将收到来电'}
            </View>
          </View>

          {/* 虚拟号显示 */}
          {virtualNumber && (
            <View className='info-section'>
              <View className='info-label'>虚拟号码</View>
              <View className='info-value'>{virtualNumber}</View>
            </View>
          )}

          {/* 状态显示 */}
          {callStatus !== CallStatus.Idle && (
            <View className='status-section'>
              <View className={`status-text ${callStatus}`}>
                {getStatusText()}
              </View>
              {callStatus === CallStatus.Calling && (
                <View className='status-hint'>
                  请在电话挂断后点击下方"结束通话"按钮
                </View>
              )}
            </View>
          )}
        </View>

        <View className='popup-footer'>
          {callStatus === CallStatus.Idle ? (
            <>
              <Button
                fill='outline'
                onClick={handleCancel}
                style={{ marginRight: '12px' }}
              >
                取消
              </Button>
              <Button
                type='primary'
                onClick={handleStartCall}
              >
                确认拨打
              </Button>
            </>
          ) : (
            <Button
              type='primary'
              block
              onClick={handleEndCall}
              disabled={callStatus === CallStatus.Releasing || callStatus === CallStatus.Acquiring}
              loading={callStatus === CallStatus.Releasing}
            >
              {callStatus === CallStatus.Releasing ? '正在结束...' : '已挂断电话，点击结束'}
            </Button>
          )}
        </View>
      </View>
    </Popup>
  )
}

export default CallConfirmPopup
