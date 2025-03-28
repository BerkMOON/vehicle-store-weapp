// b端登录 请求参数
export interface LoginRequest {
  username: string
  password: string
}

export interface ResetRequest {
  username: string,
  old: string,
  new: string
}