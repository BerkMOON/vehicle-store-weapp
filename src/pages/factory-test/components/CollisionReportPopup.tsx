import { View, Image } from '@tarojs/components'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Input, Popup } from '@nutui/nutui-react-taro'
import { ArrowRight } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { EntryCheckAPI } from '@/request/entryCheckApi'
import { uploadAccidentPhotoToOss } from '@/request/oss'
import { SuccessCode } from '@/common/constants/constants'
import { formatAccidentTimeFromPicker, isValidAccidentTime } from '../utils'
import '../index.scss'

interface CollisionReportPopupProps {
  visible: boolean
  vin: string
  sn: string
  /** 默认工程师姓名（一般用登录用户昵称） */
  defaultEngineerName?: string
  /**
   * 与「失效设备查询」区一致：基于 offlineVersionSummary。
   * true = 当前判定失效；false = 当前判定非失效；null = 暂无数据或本店无该 SN 记录，提交时会再调 queryInvalidDevice。
   */
  currentInvalidDevice?: boolean | null
  onClose: () => void
}

export function CollisionReportPopup({
  visible,
  vin,
  sn,
  defaultEngineerName = '',
  currentInvalidDevice = null,
  onClose,
}: CollisionReportPopupProps) {
  const [accidentTimeStr, setAccidentTimeStr] = useState('')
  const [engineerName, setEngineerName] = useState('')
  const [photoLocalPath, setPhotoLocalPath] = useState('')
  const [collisionSubmitting, setCollisionSubmitting] = useState(false)
  const [timePickerVisible, setTimePickerVisible] = useState(false)

  const accidentPickerValue = useMemo(() => {
    if (accidentTimeStr && isValidAccidentTime(accidentTimeStr)) {
      const d = dayjs(accidentTimeStr, 'YYYY-MM-DD HH:mm:ss')
      if (d.isValid()) return d.toDate()
    }
    return new Date()
  }, [accidentTimeStr])

  const reset = useCallback(() => {
    setAccidentTimeStr('')
    setEngineerName((defaultEngineerName || '').trim())
    setPhotoLocalPath('')
    setTimePickerVisible(false)
  }, [defaultEngineerName])

  useLayoutEffect(() => {
    if (visible) reset()
  }, [visible, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  /** 当前是否失效：优先用页面上已拉取的 summary，否则调通用接口（不要求事故时间） */
  const resolveCurrentInvalid = async (): Promise<boolean> => {
    if (currentInvalidDevice === true) return true
    if (currentInvalidDevice === false) return false
    const res = await EntryCheckAPI.queryInvalidDevice({ vin, sn })
    if (res?.response_status?.code === SuccessCode && res.data) {
      return !!res.data.is_invalid_device
    }
    return false
  }

  const uploadPhoto = async (): Promise<string | undefined> => {
    if (!photoLocalPath) return undefined
    const uploaded = await uploadAccidentPhotoToOss(photoLocalPath)
    return uploaded || undefined
  }

  const handleSubmit = async () => {
    const trimmed = accidentTimeStr.trim()
    const eng = engineerName.trim()
    if (!trimmed) {
      Taro.showToast({ title: '请选择事故时间', icon: 'none' })
      return
    }
    if (!eng) {
      Taro.showToast({ title: '请填写工程师姓名', icon: 'none' })
      return
    }
    if (!isValidAccidentTime(trimmed)) {
      Taro.showToast({ title: '事故时间无效，请重新选择', icon: 'none' })
      return
    }
    if (!photoLocalPath) {
      Taro.showToast({ title: '请拍摄事故整体照片', icon: 'none' })
      return
    }

    setCollisionSubmitting(true)
    try {
      const url = await uploadPhoto()
      if (!url) {
        Taro.showToast({
          title: '照片上传失败，请重试',
          icon: 'none',
        })
        return
      }

      const isInvalid = await resolveCurrentInvalid()
      const sub = await EntryCheckAPI.submitEntryCollisionReport({
        vin,
        sn,
        accident_time: trimmed,
        engineer_name: eng,
        is_invalid_device: isInvalid,
        accident_photo_url: url,
      })
      if (sub?.response_status?.code === SuccessCode) {
        Taro.showToast({ title: '上报成功', icon: 'success' })
        handleClose()
      } else {
        Taro.showToast({
          title: sub?.response_status?.msg || '上报失败',
          icon: 'none',
        })
      }
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '上报失败', icon: 'none' })
    } finally {
      setCollisionSubmitting(false)
    }
  }

  const handleChooseAccidentPhoto = () => {
    Taro.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (r) => {
        const p = r.tempFiles?.[0]?.tempFilePath
        if (p) setPhotoLocalPath(p)
      },
    })
  }

  const hintInvalid =
    currentInvalidDevice === true
      ? '当前判定为失效设备，仍需拍摄事故整体照片后提交。'
      : currentInvalidDevice === false
        ? '当前判定为非失效设备，请拍摄事故整体照片后提交。'
        : '请拍摄事故整体照片；是否失效仅作记录，不影响必须上传照片。'

  return (
    <Popup
      visible={visible}
      position='bottom'
      onClose={handleClose}
      style={{ minHeight: '45%' }}
    >
      <View className='collision-popup'>
        <View className='popup-title'>上报碰撞</View>
        <View className='hint' style={{ marginBottom: 12 }}>
          事故时间仅作线索记录
        </View>
        <View className='hint' style={{ marginBottom: 12 }}>
          {hintInvalid}
        </View>

        <View className='field'>
          <View className='field-label'>事故时间</View>
          <View
            className='time-picker-trigger'
            onClick={() => setTimePickerVisible(true)}
          >
            <View className={accidentTimeStr ? 'time-picker-value' : 'time-picker-placeholder'}>
              {accidentTimeStr || '请选择事故时间'}
            </View>
            <ArrowRight size={12} color='#999' />
          </View>
        </View>
        <View className='field'>
          <View className='field-label'>工程师姓名</View>
          <Input
            placeholder='与业绩登记一致，请填写真实姓名'
            value={engineerName}
            onChange={(v) => setEngineerName(v)}
          />
        </View>

        <View className='hint' style={{ marginTop: 8 }}>
          请拍摄事故整体照片（失效与非失效设备均需上传）。
        </View>
        <Button fill='outline' block onClick={handleChooseAccidentPhoto} style={{ marginTop: 12 }}>
          选择/拍摄照片
        </Button>
        {photoLocalPath ? (
          <Image className='photo-preview' mode='aspectFit' src={photoLocalPath} />
        ) : null}

        <Button
          type='primary'
          block
          loading={collisionSubmitting}
          onClick={handleSubmit}
          style={{ marginTop: 16 }}
        >
          提交上报
        </Button>
      </View>

      <DatePicker
        visible={timePickerVisible}
        title='选择事故时间'
        type='datetime'
        showChinese
        value={accidentPickerValue}
        startDate={dayjs().subtract(5, 'year').toDate()}
        endDate={new Date()}
        onClose={() => setTimePickerVisible(false)}
        onCancel={() => setTimePickerVisible(false)}
        onConfirm={(_, values) => {
          setAccidentTimeStr(formatAccidentTimeFromPicker(values))
          setTimePickerVisible(false)
        }}
      />
    </Popup>
  )
}
