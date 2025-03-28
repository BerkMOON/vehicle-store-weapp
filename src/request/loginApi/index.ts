import { ResponseInfoType } from "types/common"
import { postRequest } from ".."
import {
  LoginRequest,
  ResetRequest,
} from './typings.d'
import Taro from "@tarojs/taro"
import { UserInfo } from "../userApi/typings"

const prefix = TARO_APP_API_BASE_URL + '/api/business'

export const LoginAPI = {
  /**
   * b端登录
   * POST /api/business/login
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  login: (params: LoginRequest) => Taro.request<ResponseInfoType<UserInfo>>({
    url: `${prefix}/login`,
    method: 'POST',
    data: params
  }),

  /**
   * b端登出
   * POST /api/business/logout
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  logout: () => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/logout`
  }),

  /**
   * b端用户重置密码
   * POST /api/business/resetPass
   * 接口ID：277687765
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-277687765
   */
  resetPassword: (params: ResetRequest) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/resetPass`,
    params
  }),
}
