import { BaseListInfo, PageInfoParams, StatusInfo } from "types/common";

export interface StatRequest {
  company_id: string
  store_id: string
}

export interface StatResponse {
  total: number,
  bound: number,
  not_bound: number,
  reported_in_bound: number,
  unreported_in_bound: number,
  reported_in_not_bound: number,
  unreported_in_not_bound: number
}

export interface DeviceResponse extends BaseListInfo {
  device_list: DeviceList[];
}

export interface DeviceList {
  createTime: string;
  mileage: number;
  onsetTime: string;
  phone: string;
  sn: string;
  status: StatusInfo;
  store_name: string;
  onset_time: string;
  vin: string;
}

export interface DeviceRequest extends PageInfoParams {
  unreported?: boolean;
  endTime?: string;
  phone?: string;
  sn?: string;
  startTime?: string;
  /**
   * 状态，init未绑定，bound已绑定
   */
  status?: string;
  vin?: string;
}