import { get, del, post } from '../utils/request'

export const getGiftListReq = (params?) => get('/api/v1/message', params)

// 添加与编辑
// id 为 null 时为添加
export const giftAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/message/' + id, data)
  } else {
    return post('/api/v1/message', data)
  }
}

export const delGiftReq = data => del('/api/v1/message', data)
