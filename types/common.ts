export interface ResponseInfoType<T> {
  response_status: ResponseStatus;
  data: T;
}

export interface ResponseStatus {
  code: number;
  extension: {
    key: string;
    value: string;
  };
  msg: string;
}

export interface PageInfo {
  total_count: number;
  total_page: number;
}

export interface StatusInfo {
  code: number
  name: string
}

export interface BaseListInfo {
  meta: PageInfo;
}

export interface PageInfoParams {
  page: number;
  limit: number;
}