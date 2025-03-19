import { StatusInfo } from "types/common"

// b端工单列表 请求参数
export interface ListRequest {
  offset?: number
  limit?: number
  status?: string
}

export interface TaskInfo {
  id: number
  clue_id: string
  device_id: string
  vin: string
  report_time: string
  video_url: string
  handler_name: string
  status: StatusInfo
  remark: string
  create_time: string
  modify_time: string
}

// b端工单列表 返回结果
export interface ListResponse {
  task_list: TaskInfo[]
}

// b端工单确认 请求参数
export interface AcceptRequest {
  task_id: number
  clue_id: string
}

// b端工单处理 请求参数
export interface ProcessRequest {
  task_id: number
  clue_id: string
  status: string
  remark?: string
}


