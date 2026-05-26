import { ResponseInfoType } from 'types/common'
import { getRequest } from '..'
import {
  GetStaticResourceParams,
  GetStaticResourceResponse,
} from './typings.d'

const prefix = TARO_APP_API_BASE_URL + '/api/business/static'

export const StaticAPI = {
  /**
   * GET /api/business/static/getStaticResource
   */
  getStaticResource: (params: GetStaticResourceParams) =>
    getRequest<ResponseInfoType<GetStaticResourceResponse>>({
      url: `${prefix}/getStaticResource`,
      params,
    }),
}

export {
  STATIC_FILE_TYPE_REPAIR_DEVICE_VIDEO,
} from './typings.d'
