import { get, del, post } from '../utils/request'

export const getNoticeListReq = (params?) => get('/api/v1/notice', params)
export const getNoticeUserListReq = (notice_id, params?) => get(`/api/v1/notice/${notice_id}/target/users`, params)

// 添加与编辑
// id 为 null 时为添加
export const noticeAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/notice/' + id, data)
  } else {
    return post('/api/v1/notice', data)
  }
}

export const delNoticeReq = data => del('/api/v1/notice', data)
