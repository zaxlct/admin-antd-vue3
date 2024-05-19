import { get, del, post } from '../utils/request'

export const getGiftListReq = (params?) => get('/api/v1/gift', params)

// 添加与编辑
// id 为 null 时为添加
export const giftAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/gift/' + id, data)
  } else {
    return post('/api/v1/gift', data)
  }
}

export const delGiftReq = id => del(`/api/v1/gift/${id}`)
