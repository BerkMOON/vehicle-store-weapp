export interface MakeCallRequest {
  callee: string
  caller: string
}

export interface AliyunResponse<T> {
  Code: string;
  Data: T;
  HttpStatusCode:number;
  RequestId: string;
}