import { ResponseInfoType } from "types/common"
import { getRequest, postRequest } from ".."
import {
  LoginRequest,
  UserInfo,
  RegisterRequest,
  GetAllBusinessUsersRequest,
  GetAllBusinessUsersResponse,
  StatusRequest,
  UpdateRequest,
  RoleRequest,
  GetAllBusinessRoleResponse
} from './typings'
import Taro from "@tarojs/taro"

const prefix_ = '/api/business'
const prefix = `${prefix_}/user`

export const UserAPI = {
  /**
   * b端登录
   * POST /api/business/login
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  login: (params: LoginRequest) => Taro.request<ResponseInfoType<UserInfo>>({
    url: `${prefix_}/login`,
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
    url: `${prefix_}/logout`
  }),

  /**
   * b端注册
   * POST /api/business/register
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  register: (params: RegisterRequest) => postRequest<ResponseInfoType<null>>({
    url: `${prefix_}/register`,
    params
  }),

  /**
   * 获取b端用户
   * GET /api/business/user/getAllBusinessUsers
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  getAllBusinessUsers: (params: GetAllBusinessUsersRequest) => getRequest<ResponseInfoType<GetAllBusinessUsersResponse>>({
    url: `${prefix}/getAllBusinessUsers`,
    params
  }),

  /**
   * 更新b端用户状态
   * POST /api/business/user/status
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  status: (params: StatusRequest) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/status`,
    params
  }),

  /**
   * 更新b端用户信息
   * POST /api/business/user/update
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  update: (params: UpdateRequest) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/update`,
    params
  }),

  /**
   * 更新用户角色
   * POST /api/business/user/role
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  role: (params: RoleRequest) => postRequest<ResponseInfoType<null>>({
    url: `${prefix}/role`,
    params
  }),

  /**
   * 获取b端权限列表
   * GET /api/business/user/getAllBusinessRole
   * 接口ID：undefined
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-undefined
   */
  getAllBusinessRole: () => getRequest<ResponseInfoType<GetAllBusinessRoleResponse>>({
    url: `${prefix}/getAllBusinessRole`
  }),

  getUserInfo: () => getRequest<ResponseInfoType<UserInfo>>({
    url: `${prefix_}/getSelfInfo`,
  }),
}
