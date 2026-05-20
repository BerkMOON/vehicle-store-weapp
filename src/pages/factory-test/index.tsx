import { View } from '@tarojs/components'
import { useCallback, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import GeneralPage from '@/components/GeneralPage'
import { DeviceAPI } from '@/request/deviceApi'
import { DeviceList } from '@/request/deviceApi/typings.d'
import { TaskAPI, TaskStatus } from '@/request/taskApi'
import { TaskInfo } from '@/request/taskApi/typings'
import { EntryCheckAPI } from '@/request/entryCheckApi'
import { DeviceOfflineVersionSummary } from '@/request/entryCheckApi/typings.d'
import { SuccessCode } from '@/common/constants/constants'
import { normalizeVin, isValidVin } from './utils'
import { isBoundDevice, pickPrimaryDevice } from './deviceUtils'
import { VinQuerySection } from './components/VinQuerySection'
import { QueryEmptySection } from './components/QueryEmptySection'
import { UnboundNoticeBanner } from './components/UnboundNoticeBanner'
import { CurrentDeviceCard } from './components/CurrentDeviceCard'
import { FirmwareSection } from './components/FirmwareSection'
import { InvalidDeviceQuerySection } from './components/InvalidDeviceQuerySection'
import { MileageSection } from './components/MileageSection'
import { TaskListSection } from './components/TaskListSection'
import { CollisionEntrySection } from './components/CollisionEntrySection'
import { CollisionReportPopup } from './components/CollisionReportPopup'
import { useUserStore } from '@/store/user'

function FactoryTest() {
  const userInfo = useUserStore((s) => s.userInfo)
  const defaultEngineerName =
    (userInfo?.nickname || '').trim()
  const [vinInput, setVinInput] = useState('')
  const [queryLoading, setQueryLoading] = useState(false)
  const [queried, setQueried] = useState(false)
  const [devices, setDevices] = useState<DeviceList[]>([])
  const [tasks, setTasks] = useState<TaskInfo[]>([])
  const [mileageInput, setMileageInput] = useState('')
  const [mileageSubmitting, setMileageSubmitting] = useState(false)
  const [deviceSummary, setDeviceSummary] = useState<DeviceOfflineVersionSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [collisionVisible, setCollisionVisible] = useState(false)

  const vin = useMemo(() => normalizeVin(vinInput), [vinInput])
  const primaryDevice = useMemo(() => pickPrimaryDevice(devices), [devices])
  const hasBound = useMemo(() => devices.some(isBoundDevice), [devices])

  /** 与 REQUIREMENTS / InvalidDeviceQuerySection 一致：仅「当前」是否失效（offline 规则） */
  const collisionCurrentInvalid = useMemo<boolean | null>(() => {
    if (!deviceSummary) return null
    if (!deviceSummary.in_company_store) return null
    return !!(deviceSummary.in_company_store && deviceSummary.offline_over_n_days)
  }, [deviceSummary])

  const fetchTasks = useCallback(async (vin: string) => {
    const res = await TaskAPI.List({
      offset: 0,
      limit: 50,
      status: TaskStatus.All,
      vin, 
    })
    if (res?.response_status?.code === SuccessCode && res.data?.task_list) {
      setTasks(res.data.task_list)
    }
  }, [])

  const loadDeviceSummary = useCallback(async (sn: string) => {
    setSummaryLoading(true)
    setDeviceSummary(null)
    try {
      const res = await EntryCheckAPI.getOfflineVersionSummary({
        sn,
        before_days: 10,
      })
      if (res?.response_status?.code === SuccessCode && res.data) {
        setDeviceSummary(res.data)
      } else if (res?.response_status?.msg) {
        Taro.showToast({ title: res.response_status.msg, icon: 'none' })
      }
    } finally {
      setSummaryLoading(false)
    }
  }, [])

  const handleQueryDevice = async () => {
    // if (!isValidVin(vin)) {
    //   Taro.showToast({
    //     title: '请输入正确17位车架号',
    //     icon: 'none',
    //   })
    //   return
    // }
    setQueryLoading(true)
    setQueried(true)
    setDevices([])
    setTasks([])
    setDeviceSummary(null)
    setMileageInput('')
    try {
      const res = await DeviceAPI.list({
        page: 1,
        limit: 20,
        vin,
      })
      if (res?.response_status?.code === SuccessCode) {
        const list = res.data?.device_list || []
        setDevices(list)
        const primary = pickPrimaryDevice(list)
        if (primary?.sn) {
          await loadDeviceSummary(primary.sn)
          await fetchTasks(vin)
        }
      } else {
        Taro.showToast({
          title: res?.response_status?.msg || '查询失败',
          icon: 'none',
        })
      }
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '查询失败', icon: 'none' })
    } finally {
      setQueryLoading(false)
    }
  }
  // 处理图像识别
  const handleOCR = async () => {
    try {
      // 先让用户选择识别类型
      const { tapIndex } = await Taro.showActionSheet({
        itemList: ['识别行驶证', '识别其他']
      })

      // 选择图片
      const { tempFilePaths } = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album']
      })

      Taro.showLoading({
        title: '识别中...',
      })

      // 调用OCR识别
      //@ts-ignore
      const result = await Taro.serviceMarket.invokeService({
        service: 'wx79ac3de8be320b71',
        api: 'OcrAllInOne',
        data: {
          //@ts-ignore
          img_url: new Taro.serviceMarket.CDN({
            type: 'filePath',
            filePath: tempFilePaths[0],
          }),
          data_type: 3,
          ocr_type: tapIndex === 0 ? 3 : 8  // 根据选择设置不同的识别类型
        }
      })

      let vinNumber = ''
      if (tapIndex === 0) {
        // 驾驶证识别结果处理
        vinNumber = result?.data?.driving_res?.vin?.text
      } else {
        // 车架号铭牌识别结果处理
        const items = result?.data?.ocr_comm_res?.items || []
        const vinItem = items.find(item => item.text.startsWith('L'))
        vinNumber = vinItem?.text
      }

      if (vinNumber) {
        console.log('识别结果：', vinNumber)
        setVinInput(vinNumber)
        Taro.hideLoading()
      } else {
        Taro.hideLoading()
        Taro.showToast({
          title: '未识别到有效信息',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('识别失败error.message：', error.message)
      Taro.hideLoading()
      Taro.showToast({
        title: '识别失败',
        icon: 'error'
      })
    }
  }

  const handleSubmitMileage = async () => {
    if (!primaryDevice) {
      Taro.showToast({ title: '请先完成设备查询', icon: 'none' })
      return
    }
    const km = Number(mileageInput)
    if (!mileageInput.trim() || Number.isNaN(km) || km < 0) {
      Taro.showToast({ title: '请输入有效里程数', icon: 'none' })
      return
    }
    setMileageSubmitting(true)
    try {
      const res = await DeviceAPI.updateMileage({
        sn: primaryDevice.sn,
        mileage: km,
      })
      if (res?.response_status?.code === SuccessCode) {
        Taro.showToast({ title: '里程已更新', icon: 'success' })
        setMileageInput('')
        const listRes = await DeviceAPI.list({
          page: 1,
          limit: 20,
          vin,
        })
        if (listRes?.response_status?.code === SuccessCode) {
          setDevices(listRes.data?.device_list || [])
        }
      } else {
        Taro.showToast({
          title: res?.response_status?.msg || '更新失败',
          icon: 'none',
        })
      }
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '提交失败', icon: 'none' })
    } finally {
      setMileageSubmitting(false)
    }
  }

  const openCollision = () => {
    if (!primaryDevice) {
      Taro.showToast({ title: '请先完成设备查询', icon: 'none' })
      return
    }
    setCollisionVisible(true)
  }

  const goTaskDetail = (clueId: string) => {
    Taro.navigateTo({
      url: `/pages/order-detail/index?clueId=${encodeURIComponent(clueId)}`,
    })
  }

  const handleResetVin = () => {
    setVinInput('')
    setDevices([])
    setTasks([])
    setDeviceSummary(null)
    setMileageInput('')
    setQueried(false)
  }

  return (
    <GeneralPage>
      <View className='entry-check-page'>
        <VinQuerySection
          vinInput={vinInput}
          onVinChange={setVinInput}
          queryLoading={queryLoading}
          onQuery={handleQueryDevice}
          onOcr={handleOCR}
        />

        {queried && devices.length === 0 && !queryLoading && isValidVin(vin) && (
          <QueryEmptySection onResetVin={handleResetVin} />
        )}

        {devices.length > 0 && primaryDevice && (
          <>
            {!hasBound && <UnboundNoticeBanner />}
            <CurrentDeviceCard device={primaryDevice} />
            <FirmwareSection summaryLoading={summaryLoading} summary={deviceSummary} />
            <InvalidDeviceQuerySection
              key={`invalid-${primaryDevice.sn}`}
              sn={primaryDevice.sn}
              summary={deviceSummary}
              summaryLoading={summaryLoading}
            />
            <MileageSection
              currentMileageKm={primaryDevice.mileage}
              mileageInput={mileageInput}
              onMileageChange={setMileageInput}
              mileageSubmitting={mileageSubmitting}
              onSubmit={handleSubmitMileage}
            />
            <CollisionEntrySection onOpenReport={openCollision} />
            <TaskListSection tasks={tasks} onGoDetail={goTaskDetail} />
          </>
        )}
      </View>

      {/* key 勿含 vin：否则每输入一字 remount，小程序下会导致 VIN 输入框失焦 */}
      <CollisionReportPopup
        key={primaryDevice?.sn ? `collision-${primaryDevice.sn}` : 'collision-pending'}
        visible={collisionVisible}
        vin={vin}
        sn={primaryDevice?.sn ?? ''}
        defaultEngineerName={defaultEngineerName}
        currentInvalidDevice={collisionCurrentInvalid}
        onClose={() => setCollisionVisible(false)}
      />
    </GeneralPage>
  )
}

export default FactoryTest
