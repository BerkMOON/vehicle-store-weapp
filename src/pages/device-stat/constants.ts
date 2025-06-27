export enum StateTypeEnum {
  All = 'all',
  NotBound = 'not_bound',
  Bound = 'bound',
  BoundAndReported = 'bound_and_reported',
  BoundAndNotReported = 'bound_and_not_reported',
  NotBoundAndReported = 'not_bound_and_reported',
  NotBoundAndNotReported = 'not_bound_and_not_reported',
}

export const StateTypeMap = {
  [StateTypeEnum.All]: '总设备数',
  [StateTypeEnum.NotBound]: '未绑定',
  [StateTypeEnum.Bound]: '已绑定',
  [StateTypeEnum.BoundAndReported]: '上路设备',
  [StateTypeEnum.BoundAndNotReported]:  '未安装已绑定',
  [StateTypeEnum.NotBoundAndReported]: '已安装未绑定',
  [StateTypeEnum.NotBoundAndNotReported]: '库存设备',
}

export const DeviceStatParamsMap = {
  [StateTypeEnum.All]: {},
  [StateTypeEnum.NotBound]: { status: 'init' },
  [StateTypeEnum.Bound]: { status: 'bound' },
  [StateTypeEnum.BoundAndReported]: { report_status: 'reported', status: 'bound' },
  [StateTypeEnum.BoundAndNotReported]: { report_status: 'unreported', status: 'bound' },
  [StateTypeEnum.NotBoundAndReported]: { report_status: 'reported', status: 'init' },
  [StateTypeEnum.NotBoundAndNotReported]: { report_status: 'unreported', status: 'init' },
}

const BoundNameMap = [{
  key: 'sn',
  name: '设备号',
}, {
  key: 'onset_time',
  name: '安装时间',
}, {
  key: 'car_model',
  name: '车型'
}, {
  key: 'phone',
  name: '手机号'
}, {
  key: 'vin',
  name: '车架号'
}, {
  key: 'bind_time',
  name: '绑定时间'
}]

const NotBoundNameMap = [{
  key: 'sn',
  name: '设备号',
}, {
  key: 'onset_time',
  name: '安装时间',
}]

const SnMap = [
  {
    key: 'sn',
    name: '设备号',
  }
]

export const StatKeyAndNamesMap = {
  [StateTypeEnum.All]: BoundNameMap,
  [StateTypeEnum.NotBound]: NotBoundNameMap,
  [StateTypeEnum.Bound]: BoundNameMap,
  [StateTypeEnum.BoundAndReported]: BoundNameMap,
  [StateTypeEnum.NotBoundAndReported]: NotBoundNameMap,
  [StateTypeEnum.BoundAndNotReported]: BoundNameMap,
  [StateTypeEnum.NotBoundAndNotReported]: SnMap
}

export const StatInfoList = [
  [
    {
      state: StateTypeEnum.All,
      title: StateTypeMap[StateTypeEnum.All],
      key: 'total',
    },
    {
      state: StateTypeEnum.Bound,
      title: StateTypeMap[StateTypeEnum.Bound],
      key: 'bound',
    },
    {
      state: StateTypeEnum.NotBound,
      title: StateTypeMap[StateTypeEnum.NotBound],
      key: 'not_bound',
    }
  ],
  [
    {
      state: StateTypeEnum.BoundAndReported,
      title: StateTypeMap[StateTypeEnum.BoundAndReported],
      key: 'reported_in_bound',
    },
    {
      state: StateTypeEnum.BoundAndNotReported,
      title: StateTypeMap[StateTypeEnum.BoundAndNotReported],
      key: 'unreported_in_bound',
    },
  ],
  [
    {
      state: StateTypeEnum.NotBoundAndReported,
      title: StateTypeMap[StateTypeEnum.NotBoundAndReported],
      key: 'reported_in_not_bound',
    },
    {
      state: StateTypeEnum.NotBoundAndNotReported,
      title: StateTypeMap[StateTypeEnum.NotBoundAndNotReported],
      key: 'unreported_in_not_bound',
    },
  ],
]