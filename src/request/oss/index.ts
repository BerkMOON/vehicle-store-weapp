import Taro from '@tarojs/taro'
import { SuccessCode } from '@/common/constants/constants'
import { ResponseInfoType } from 'types/common'
import { getRequest } from '..'
import { OssPostSignatureData } from './typings.d'

const prefix = TARO_APP_API_BASE_URL + '/api/business/common'

function normalizeOssHost(host: string) {
  const h = host.trim()
  if (!h) return ''
  return /^https?:\/\//i.test(h) ? h : `https://${h}`
}

function joinOssObjectKey(dir: string, fileName: string) {
  const d = dir.replace(/\/+$/, '')
  const f = fileName.replace(/^\/+/, '')
  if (!d) return f
  return `${d}/${f}`
}

/** 上传成功后可访问的 OSS 对象 URL（与 PostObject 的 host + key 一致） */
export function buildOssObjectPublicUrl(host: string, objectKey: string) {
  const origin = normalizeOssHost(host).replace(/\/+$/, '')
  const key = objectKey.replace(/^\/+/, '')
  return `${origin}/${encodeURI(key)}`
}

export const OssAPI = {
  /**
   * 获取文件oss上传路径
   * GET /api/business/common/getOssPostSignature
   * 接口ID：458446129
   * 接口地址：https://app.apifox.com/link/project/5084807/apis/api-458446129
   */
  getOssPostSignature: (params: { scene: 'accident-photo' }) =>
    getRequest<ResponseInfoType<OssPostSignatureData>>({
      url: `${prefix}/getOssPostSignature`,
      params,
    }),
}

/**
 * 碰撞/事故现场照片：先拉 PostObject 签名，再直传 OSS。
 * @returns 成功时返回可访问的图片 URL，失败返回 null
 */
export async function uploadAccidentPhotoToOss(filePath: string): Promise<string | null> {
  const sigRes = await OssAPI.getOssPostSignature({ scene: 'accident-photo' })
  if (
    !sigRes ||
    sigRes.response_status?.code !== SuccessCode ||
    !sigRes.data
  ) {
    return null
  }
  const { ossAccessKeyId, host, signature, policy, dir } = sigRes.data
  if (!host || !policy || !signature || !ossAccessKeyId) {
    return null
  }

  const uploadUrl = normalizeOssHost(host)
  if (!uploadUrl) return null

  const extMatch = filePath.match(/\.([a-zA-Z0-9]+)$/)
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg'
  const fileName = `accident_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`
  const objectKey = joinOssObjectKey(dir || '', fileName)

  return new Promise((resolve) => {
    Taro.uploadFile({
      url: uploadUrl,
      filePath,
      name: 'file',
      formData: {
        key: objectKey,
        policy,
        OSSAccessKeyId: ossAccessKeyId,
        Signature: signature,
        success_action_status: '200',
      },
      success: (res) => {
        const ok =
          res.statusCode === 200 ||
          res.statusCode === 201 ||
          res.statusCode === 204
        resolve(ok ? buildOssObjectPublicUrl(host, objectKey) : null)
      },
      fail: () => resolve(null),
    })
  })
}
