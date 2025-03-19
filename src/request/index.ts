import Taro from "@tarojs/taro"

// API 请求统一处理函数
export const getRequest = async <T>(config: any): Promise<T | null>  => {
  const { url, params } = config
  try {
    const cookie = Taro.getStorageSync('cookies')
    const res = await Taro.request({
      url,
      method: 'GET',
      data: params,
      header: {
        cookie: cookie || ''
      }
    })

    return res.data as T
  } catch (error) {
    Taro.showToast({
      title: '接口错误',
      icon: 'none'
    })
    return null
  }
}

export const postRequest = async <T>(config: any): Promise<T | null> => {
  const { url, params } = config
  try {
    const cookie = Taro.getStorageSync('cookies')
    const res = await Taro.request({
      url,
      method: 'POST',
      data: params,
      header: {
        cookie: cookie || ''
      }
    })
    return res.data as T
  } catch (error) {
    Taro.showToast({
      title: '接口错误',
      icon: 'none'
    })
    return null
  }
}