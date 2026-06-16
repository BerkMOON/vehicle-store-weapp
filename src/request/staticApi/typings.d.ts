export interface StaticResourceItem {
  url: string
  poster_url?: string
  file_type: string
}

export interface GetStaticResourceResponse {
  item_list: StaticResourceItem[]
}

export interface GetStaticResourceParams {
  file_type: string
}

/** 与后端 StaticFileTypeRepairDeviceVideo 保持一致 */
export const STATIC_FILE_TYPE_REPAIR_DEVICE_VIDEO = 'repair_device_video'

/** 与后端 StaticFileTypeInstructionProduct 保持一致 */
export const STATIC_FILE_TYPE_INSTRUCTION_PRODUCT = 'instruction_product'
