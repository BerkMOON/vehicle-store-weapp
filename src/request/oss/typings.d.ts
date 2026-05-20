/** GET getOssPostSignature 返回的 PostObject 凭证（与后端 `GetOssPostSignatureResp` / `OssPolicyTokenType` 对齐） */
export interface OssPostSignatureData {
  ossAccessKeyId: string
  host: string
  signature: string
  policy: string
  /** 对象 key 须以此目录为前缀（starts-with） */
  dir: string
}
