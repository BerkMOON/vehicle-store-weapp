import { Role } from "@/common/constants/constants"
import { PageInfo } from "types/common"

// b端登录 请求参数
export interface LoginRequest {
  username: string
  password: string
}

// b端登录 返回结果
export interface UserInfo {
  username: string
  header_img: string
  nickname: string
  phone: string
  email: string
  company_name: string
  store_name: string
  status: {
    code: number
    name: string
  }
  role: Role
  create_time: string
  modify_time: string
}

// b端注册 请求参数
export interface RegisterRequest {
  username: string
  password: string
  header_img?: string
  nickname?: string
  phone?: string
  email?: string
  role: string
}

// 获取b端用户 请求参数
export interface GetAllBusinessUsersRequest {
  page?: number
  limit?: number
  username?: string
  phone?: string
  email?: string
  status?: number
  role?: string
}

export interface UserListInfo {
  id?: number
  username?: string
  header_img?: string
  nickname?: string
  phone?: string
  email?: string
  company_name?: string
  store_name?: string
  status?: { code: number, name: string }
  role: Role
  create_time?: string
  modify_time?: string
}

// 获取b端用户 返回结果
export interface GetAllBusinessUsersResponse {
  meta: PageInfo
  user_list: UserListInfo[]
}

// 更新b端用户状态 请求参数
export interface StatusRequest {
  user_id: number
  status: number
}
// 更新b端用户信息 请求参数
export interface UpdateRequest {
  user_id: number
  header_img?: string
  nickname?: string
  phone?: string
  email?: string
}

// 更新用户角色 请求参数
export interface RoleRequest {
  user_id: number
  role: string
}

// 获取b端权限列表 返回结果
export interface GetAllBusinessRoleResponse {
  role_list?: {
    role: string
    desc: string
  }[]
}

