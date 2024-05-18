import { get, put, post } from '../utils/request'

export const getMerchantListReq = (params?) => get('/api/v1/merchant', params)

// 添加与编辑
// id 为 null 时为添加
export const merchantAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/merchant/' + id, data)
  } else {
    return post('/api/v1/merchant', data)
  }
}

export const setMerchantStatusReq = (id, data) => put(`/api/v1/merchant/${id}/set/status`, data)
