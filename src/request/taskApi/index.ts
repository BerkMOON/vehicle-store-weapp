import { ResponseInfoType } from "types/common"
import { getRequest, postRequest } from ".."
import {
  ListRequest,
  ListResponse,
  AcceptRequest,
  ProcessRequest,
  TaskInfo,
} from './typings'

const prefix = TARO_APP_API_BASE_URL + '/api/business/task'

export const TaskAPI = {

  /**
   * b端工单列表
   * GET /api/business/task/list
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  List: (params: ListRequest) => getRequest<ResponseInfoType<ListResponse>>({
    url: `${prefix}/list`,
    params
  }),

  /**
   * b端工单确认
   * POST /api/business/task/accept
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  Accept: (params: AcceptRequest) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/accept`,
    params
  }),

  /**
   * b端工单处理
   * POST /api/business/task/process
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  Process: (params: ProcessRequest) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/process`,
    params
  }),

  /**
   * b端工单详情
   * GET /api/business/task/detail
   * 接口ID：273166677
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-273166677
   */
  Detail: (taskId: string) => getRequest<ResponseInfoType<TaskInfo>>({
    url: `${prefix}/detail`,
    params: {
      task_id: taskId
    }
  })
}

export enum TaskType {
  Pending = 1,
}

export enum TaskStatus {
  All = 'all',
  /** 待处理 */
  Pending = 'pending',
  /** 已处理 */
  Processing = 'processing',
  /** 已完成 */
  Returned = 'returned',
  /** 已拒绝 */
  Rejected = 'rejected',
}