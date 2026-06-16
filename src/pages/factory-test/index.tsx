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
import { normalizeVin } from './utils'
import { hasVinLinkedDevice, pickPrimaryDevice } from './deviceUtils'
import { CollisionReportPopup } from './components/CollisionReportPopup'
import { useUserStore } from '@/store/user'
import { WizardProgress } from './components/wizard/WizardProgress'
import { StepVin } from './components/wizard/StepVin'
import { StepDeviceChoice } from './components/wizard/StepDeviceChoice'
import { StepBind } from './components/wizard/StepBind'
import { StepRepair } from './components/wizard/StepRepair'
import { StepMileage } from './components/wizard/StepMileage'
import { StepAccidents } from './components/wizard/StepAccidents'
import { StepComplete } from './components/wizard/StepComplete'
import { WizardStepId, DevicePath } from './wizard/types'
import { deviceNeedsRepair } from './wizard/deviceRepair'
import { filterAccidentTasks } from './wizard/taskFilter'
import { recordVinScan } from './wizard/inspectionLog'

const INITIAL_STEP: WizardStepId = 'vin'

function FactoryTest() {
  const userInfo = useUserStore((s) => s.userInfo)
  const defaultEngineerName = (userInfo?.nickname || '').trim()

  const [step, setStep] = useState<WizardStepId>(INITIAL_STEP)
  const [vinInput, setVinInput] = useState('')
  const [queryLoading, setQueryLoading] = useState(false)
  const [devices, setDevices] = useState<DeviceList[]>([])
  const [tasks, setTasks] = useState<TaskInfo[]>([])
  const [deviceSummary, setDeviceSummary] = useState<DeviceOfflineVersionSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [devicePath, setDevicePath] = useState<DevicePath | null>(null)
  const [bindSn, setBindSn] = useState('')
  const [bindLoading, setBindLoading] = useState(false)
  const [repairAcknowledged, setRepairAcknowledged] = useState(false)
  const [mileageInput, setMileageInput] = useState('')
  const [mileageSubmitting, setMileageSubmitting] = useState(false)
  const [mileageDone, setMileageDone] = useState(false)
  const [collisionVisible, setCollisionVisible] = useState(false)
  const [collisionReported, setCollisionReported] = useState(false)
  const [noAccidentDeclared, setNoAccidentDeclared] = useState(false)
  const [needsRepairFlag, setNeedsRepairFlag] = useState(false)

  const vin = useMemo(() => normalizeVin(vinInput), [vinInput])
  const primaryDevice = useMemo(() => pickPrimaryDevice(devices, vin), [devices, vin])
  const accidentTasks = useMemo(() => filterAccidentTasks(tasks), [tasks])

  const loadDeviceSummary = useCallback(async (sn: string) => {
    setSummaryLoading(true)
    setDeviceSummary(null)
    try {
      const res = await EntryCheckAPI.getOfflineVersionSummary({ sn, before_days: 10 })
      if (res?.response_status?.code === SuccessCode && res.data) {
        setDeviceSummary(res.data)
        return res.data
      }
    } finally {
      setSummaryLoading(false)
    }
    return null
  }, [])

  const fetchTasks = useCallback(async (v: string) => {
    const res = await TaskAPI.List({
      offset: 0,
      limit: 50,
      status: TaskStatus.All,
      vin: v,
    })
    if (res?.response_status?.code === SuccessCode && res.data?.task_list) {
      setTasks(res.data.task_list)
    } else {
      setTasks([])
    }
  }, [])

  const resetWizard = useCallback(() => {
    setStep(INITIAL_STEP)
    setVinInput('')
    setDevices([])
    setTasks([])
    setDeviceSummary(null)
    setDevicePath(null)
    setBindSn('')
    setRepairAcknowledged(false)
    setMileageInput('')
    setMileageDone(false)
    setCollisionReported(false)
    setNoAccidentDeclared(false)
    setNeedsRepairFlag(false)
    setCollisionVisible(false)
  }, [])

  const goRepairStep = useCallback(
    async (sn: string, path: DevicePath) => {
      setDevicePath(path)
      setStep('repair')
      setSummaryLoading(true)
      const summary = await loadDeviceSummary(sn)
      setNeedsRepairFlag(deviceNeedsRepair(summary))
      setSummaryLoading(false)
    },
    [loadDeviceSummary],
  )

  const handleOCR = async () => {
    try {
      const { tapIndex } = await Taro.showActionSheet({
        itemList: ['识别行驶证', '识别其他'],
      })
      const { tempFilePaths } = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
      })
      Taro.showLoading({ title: '识别中...' })
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
          ocr_type: tapIndex === 0 ? 3 : 8,
        },
      })
      let vinNumber = ''
      if (tapIndex === 0) {
        vinNumber = result?.data?.driving_res?.vin?.text
      } else {
        const items = result?.data?.ocr_comm_res?.items || []
        const vinItem = items.find((item: { text: string }) => item.text.startsWith('L'))
        vinNumber = vinItem?.text
      }
      Taro.hideLoading()
      if (vinNumber) {
        setVinInput(vinNumber)
      } else {
        Taro.showToast({ title: '未识别到有效信息', icon: 'none' })
      }
    } catch {
      Taro.hideLoading()
    }
  }

  const handleVinConfirm = async () => {
    const v = normalizeVin(vinInput)
    if (!v) {
      Taro.showToast({ title: '请输入车架号', icon: 'none' })
      return
    }
    setQueryLoading(true)
    setDevices([])
    setTasks([])
    setDeviceSummary(null)
    try {
      await recordVinScan(v)
      const res = await DeviceAPI.list({ page: 1, limit: 20, vin: v })
      if (res?.response_status?.code !== SuccessCode) {
        Taro.showToast({ title: res?.response_status?.msg || '查询失败', icon: 'none' })
        return
      }
      const list = res.data?.device_list || []
      setDevices(list)
      await fetchTasks(v)
      setStep('device_choice')
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '查询失败', icon: 'none' })
    } finally {
      setQueryLoading(false)
    }
  }

  const handleNoDevice = () => {
    setDevicePath('no_device')
    setNeedsRepairFlag(false)
    setRepairAcknowledged(true)
    setMileageDone(false)
    setStep('complete')
  }

  const handleNeedBind = () => {
    setBindSn('')
    setStep('bind')
  }

  const handleAlreadyBound = async () => {
    if (!hasVinLinkedDevice(devices, vin)) {
      Taro.showToast({ title: '请先完成车架号与设备绑定', icon: 'none' })
      return
    }
    const primary = pickPrimaryDevice(devices, vin)
    if (!primary?.sn) {
      Taro.showToast({ title: '无可用设备', icon: 'none' })
      return
    }
    await goRepairStep(primary.sn, 'bound')
  }

  const handleBindSubmit = async () => {
    const sn = bindSn.trim()
    if (!sn) {
      Taro.showToast({ title: '请输入 SN', icon: 'none' })
      return
    }
    setBindLoading(true)
    try {
      const res = await EntryCheckAPI.bindDevice({ sn, vin })
      if (res?.response_status?.code !== SuccessCode) {
        Taro.showToast({ title: res?.response_status?.msg || '绑定失败', icon: 'none' })
        return
      }
      Taro.showToast({ title: '绑定成功', icon: 'success' })
      const listRes = await DeviceAPI.list({ page: 1, limit: 20, vin })
      const list = listRes?.data?.device_list || []
      setDevices(list)
      const primary = pickPrimaryDevice(list, vin)
      if (primary?.sn) {
        await goRepairStep(primary.sn, 'bound_after_bind')
      }
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '绑定失败', icon: 'none' })
    } finally {
      setBindLoading(false)
    }
  }

  const handleRepairContinue = () => {
    setRepairAcknowledged(true)
    setStep('mileage')
  }

  const handleMileageSubmit = async () => {
    const km = Number(mileageInput)
    if (!mileageInput.trim() || Number.isNaN(km) || km < 0) {
      Taro.showToast({ title: '请输入有效里程', icon: 'none' })
      return
    }
    setMileageSubmitting(true)
    try {
      if (devicePath !== 'no_device' && primaryDevice?.sn) {
        const res = await DeviceAPI.updateMileage({ sn: primaryDevice.sn, mileage: km })
        if (res?.response_status?.code !== SuccessCode) {
          Taro.showToast({ title: res?.response_status?.msg || '更新失败', icon: 'none' })
          return
        }
      }
      setMileageDone(true)
      setStep('accidents')
      Taro.showToast({ title: '里程已记录', icon: 'success' })
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '提交失败', icon: 'none' })
    } finally {
      setMileageSubmitting(false)
    }
  }

  const finishFlow = (opts: {
    collisionReported?: boolean
    noAccidentDeclared?: boolean
  }) => {
    if (opts.collisionReported) setCollisionReported(true)
    if (opts.noAccidentDeclared) setNoAccidentDeclared(true)
    setStep('complete')
  }

  const handleCollisionClose = (reported: boolean) => {
    setCollisionVisible(false)
    if (reported) {
      setCollisionReported(true)
      finishFlow({ collisionReported: true })
    }
  }

  const handleNoAccidentComplete = () => {
    setNoAccidentDeclared(true)
    finishFlow({ noAccidentDeclared: true })
  }

  const openCollision = () => {
    if (devicePath !== 'no_device' && !primaryDevice?.sn) {
      Taro.showToast({ title: '无设备信息，可直接完成检测', icon: 'none' })
      return
    }
    setCollisionVisible(true)
  }

  const goTaskDetail = (clueId: string) => {
    Taro.navigateTo({ url: `/pages/order-detail/index?clueId=${encodeURIComponent(clueId)}` })
  }

  const completeSummaryLines = useMemo(() => {
    const lines: string[] = []
    if (devicePath === 'no_device') {
      lines.push('· 无易达安设备，已直接完成入场检测')
      lines.push('· 请向车主播放易达安产品介绍视频')
      return lines
    }
    if (devicePath === 'bound_after_bind') lines.push('· 已完成补绑定')
    else lines.push('· 设备已绑定')
    lines.push(needsRepairFlag ? '· 设备曾需修复（已确认）' : '· 设备检测正常')
    lines.push(mileageDone ? '· 里程已更新' : '· 里程未更新')
    if (collisionReported) lines.push('· 已上报未检出事故')
    else if (noAccidentDeclared) lines.push('· 已确认无需事故上报')
    return lines
  }, [devicePath, needsRepairFlag, mileageDone, collisionReported, noAccidentDeclared])

  const progressStep: WizardStepId =
    step === 'bind' ? 'device_choice' : step

  return (
    <GeneralPage>
      <View className='entry-check-page entry-check-wizard'>
        {step !== 'complete' && (
          <WizardProgress current={progressStep} devicePath={devicePath} />
        )}

        {step === 'vin' && (
          <StepVin
            vinInput={vinInput}
            onVinChange={setVinInput}
            loading={queryLoading}
            onOcr={handleOCR}
            onConfirm={handleVinConfirm}
          />
        )}

        {step === 'device_choice' && (
          <StepDeviceChoice
            vin={vin}
            devices={devices}
            onNoDevice={handleNoDevice}
            onNeedBind={handleNeedBind}
            onAlreadyBound={handleAlreadyBound}
          />
        )}

        {step === 'bind' && (
          <StepBind
            vin={vin}
            bindSn={bindSn}
            onBindSnChange={setBindSn}
            loading={bindLoading}
            onSubmit={handleBindSubmit}
            onBack={() => setStep('device_choice')}
          />
        )}

        {step === 'repair' && (
          <StepRepair
            needsRepair={needsRepairFlag}
            loading={summaryLoading}
            onContinue={handleRepairContinue}
            onBack={() => setStep('device_choice')}
          />
        )}

        {step === 'mileage' && (
          <StepMileage
            vin={vin}
            mileageInput={mileageInput}
            onMileageChange={setMileageInput}
            submitting={mileageSubmitting}
            onSubmit={handleMileageSubmit}
            skipDeviceSteps={devicePath === 'no_device'}
          />
        )}

        {step === 'accidents' && (
          <StepAccidents
            tasks={accidentTasks}
            onGoDetail={goTaskDetail}
            onReportCollision={openCollision}
            onNoAccidentComplete={handleNoAccidentComplete}
          />
        )}

        {step === 'complete' && (
          <StepComplete
            vin={vin}
            summaryLines={completeSummaryLines}
            showProductVideo={devicePath === 'no_device'}
            onRestart={resetWizard}
          />
        )}
      </View>

      <CollisionReportPopup
        key={primaryDevice?.sn ? `collision-${primaryDevice.sn}` : 'collision-no-device'}
        visible={collisionVisible}
        vin={vin}
        sn={primaryDevice?.sn ?? ''}
        defaultEngineerName={defaultEngineerName}
        currentInvalidDevice={null}
        onClose={handleCollisionClose}
      />
    </GeneralPage>
  )
}

export default FactoryTest
