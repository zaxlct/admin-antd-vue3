import { get, del, post } from '../utils/request'

export const getMessageListReq = (params?) => get('/api/v1/message', params)
export const getMessageUserListReq = (notice_id, params?) => get(`/api/v1/notice/${notice_id}/target/users`, params)

// 添加与编辑
// id 为 null 时为添加
export const messageAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/message/' + id, data)
  } else {
    return post('/api/v1/message', data)
  }
}

export const delMessageReq = data => del('/api/v1/message', data)
