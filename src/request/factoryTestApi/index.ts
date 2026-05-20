import { ResponseInfoType } from "types/common"
import { getRequest, postRequest } from ".."
import {
  FactoryTestRequest,
  FactoryTestResponse,
  TestDetailRequest,
  TestDetailResponse,
  TestHistoryRequest,
  TestHistoryResponse,
} from './typings.d'

const prefix = TARO_APP_API_BASE_URL + '/api/business/factory-test'

export const FactoryTestAPI = {
  /**
   * 开始出厂检测
   * POST /api/business/factory-test/start
   * 接口ID：待定
   * 接口地址：待定
   */
  startTest: (params: FactoryTestRequest) => postRequest<ResponseInfoType<FactoryTestResponse>>({
    url: `${prefix}/start`,
    params
  }),

  /**
   * 获取检测详情
   * GET /api/business/factory-test/detail
   * 接口ID：待定
   * 接口地址：待定
   */
  getDetail: (params: TestDetailRequest) => getRequest<ResponseInfoType<TestDetailResponse>>({
    url: `${prefix}/detail`,
    params
  }),

  /**
   * 获取检测历史列表
   * GET /api/business/factory-test/history
   * 接口ID：待定
   * 接口地址：待定
   */
  getHistory: (params: TestHistoryRequest) => getRequest<ResponseInfoType<TestHistoryResponse>>({
    url: `${prefix}/history`,
    params
  }),

  /**
   * 重新检测
   * POST /api/business/factory-test/retest
   * 接口ID：待定
   * 接口地址：待定
   */
  retest: (params: FactoryTestRequest) => postRequest<ResponseInfoType<FactoryTestResponse>>({
    url: `${prefix}/retest`,
    params
  }),
}
