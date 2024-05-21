import { get, del, post, put } from '../utils/request'

export const getMarqueeListReq = (params?) => get('/api/v1/marquee', params)
export const getMarqueeStatusReq = () => get('/api/v1/marquee/status')
export const setMarqueeStatusReq = (data) => put('/api/v1/marquee/status', data)

// 添加与编辑
// id 为 null 时为添加
export const marqueeAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/marquee/' + id, data)
  } else {
    return post('/api/v1/marquee', data)
  }
}

export const delMarqueeReq = data => del('/api/v1/marquee', data)
