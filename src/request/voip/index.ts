import { postRequest } from "..";
import { AliyunResponse, MakeCallRequest } from "./typings";


const prefix = TARO_APP_API_BASE_URL + '/api/business/voip'

export const VoipAPI = {
  makeCall: (params: MakeCallRequest) => postRequest<AliyunResponse<any>>({
    url: `${prefix}/b2bCall`,
    params
  }),

  acquirePhone: () => postRequest<any>({
    url: `${prefix}/acquire`,
  }),

  releasePhone: () => postRequest<any>({
    url: `${prefix}/release`,
  }),
}