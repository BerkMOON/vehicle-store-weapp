import Taro from "@tarojs/taro"

// 保存当前页面路径和参数
const saveCurrentPage = () => {
  const pages = Taro.getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = `/${currentPage.route}`
  const options = currentPage.options
  const queryString = Object.keys(options).map(key => `${key}=${options[key]}`).join('&')
  const fullPath = queryString ? `${url}?${queryString}` : url
  Taro.setStorageSync('lastPage', fullPath)
}

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

    // 处理 401 状态
    if (res.statusCode === 401) {
      saveCurrentPage()
      Taro.reLaunch({
        url: '/pages/login/index'
      })
      return null
    }

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

    // 处理 401 状态
    if (res.statusCode === 401) {
      saveCurrentPage()
      Taro.reLaunch({
        url: '/pages/login/index'
      })
      return null
    }

    return res.data as T
  } catch (error) {
    Taro.showToast({
      title: '接口错误',
      icon: 'none'
    })
    return null
  }
}