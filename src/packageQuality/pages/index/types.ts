export enum MessageType {
  StartCheck = 'start_check',
  CheckProgress = 'check_progress',
  CheckResult = 'check_result',
  CheckError = 'check_error',
  DeviceInfo = 'device_info',
  SystemStatus = 'system_status'
}

export interface QualityMessage {
  type: MessageType;
  data?: any;
  message?: string;
  timestamp: number;
}

export interface DeviceInfo {
  deviceCode: string;
  deviceName: string;
  deviceType: string;
  status: string;
}

export interface CheckResult {
  deviceCode: string;
  checkItems: Array<{
    name: string;
    status: 'pass' | 'fail';
    value: string;
    standardValue: string;
  }>;
  checkTime: string;
  overallResult: 'pass' | 'fail';
}