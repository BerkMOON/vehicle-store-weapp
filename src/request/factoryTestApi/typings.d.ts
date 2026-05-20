// 出厂检测请求参数
export interface FactoryTestRequest {
  sn: string  // 设备SN号
}

// 检测项结果
export interface TestItemResult {
  id: string
  name: string
  status: 'success' | 'failed' | 'testing'
  message?: string
  timestamp?: string
}

// 出厂检测响应数据
export interface FactoryTestResponse {
  sn: string
  test_items: TestItemResult[]
  total_count: number
  success_count: number
  failed_count: number
  test_time: string
  overall_status: 'pass' | 'fail' | 'testing'
}

// 检测详情请求参数
export interface TestDetailRequest {
  sn: string
  test_id?: string
}

// 检测详情响应数据
export interface TestDetailResponse {
  sn: string
  test_id: string
  test_items: TestItemResult[]
  test_time: string
  operator?: string
  overall_status: 'pass' | 'fail'
}

// 检测历史列表请求参数
export interface TestHistoryRequest {
  sn?: string
  start_time?: string
  end_time?: string
  status?: string
  page: number
  limit: number
}

// 检测历史记录
export interface TestHistoryItem {
  id: string
  sn: string
  test_time: string
  overall_status: 'pass' | 'fail'
  operator?: string
  success_count: number
  failed_count: number
  total_count: number
}

// 检测历史列表响应数据
export interface TestHistoryResponse {
  test_list: TestHistoryItem[]
  meta: {
    total: number
    page: number
    limit: number
    total_page: number
  }
}
