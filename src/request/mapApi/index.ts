import { getRequest } from ".."
import { AddressParams } from "./typings"
import { GdMapApiKey } from "@/common/constants/constants"
const prefix = 'https://restapi.amap.com/v3/geocode'

export const MapAPI = {
  getGDAddressInfo: (params: AddressParams) => getRequest<any>({
    url: `${prefix}/regeo`,
    params: {
     ...params,
      key: GdMapApiKey,
    }
  }),
}