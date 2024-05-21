import { get, post, put } from '../utils/request'

export const getAnchorListReq = (params?) => get('/api/v1/anchor', params)
export const getAnchorDetailReq = (anchor_id) => get(`/api/v1/anchor/${anchor_id}`)
export const getAnchorGuildReq = (anchor_id) => get(`/api/v1/anchor/guild/${anchor_id}`)
export const getAnchorInfoReq = (params?) => get('/api/v1/anchor/recweight/info', params)
export const getAnchorReweightListReq = (params?) => get('/api/v1/anchor/recweight', params)

// 添加与编辑
// id 为 null 时为添加
export const anchorAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/anchor/' + id, data)
  } else {
    return post('/api/v1/anchor', data)
  }
}

// 拉黑
export const setAnchorBlackReq = data => put('/api/v1/anchor/set/blacklist', data)

// 推荐位添加与编辑
// id 为 null 时为添加
export const recweightAddOrEditReq = (id, data) => {
  if (id) {
    return put('/api/v1/anchor/recweight/' + id, data)
  } else {
    return put('/api/v1/anchor/recweight', data)
  }
}
