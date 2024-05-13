import { get, post, put } from '../utils/request'

export const getGuildListReq = (params?) => get('/api/v1/guild', params)

// 添加与编辑
// id 为 null 时为添加
export const guildAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/guild/' + id, data)
  } else {
    return post('/api/v1/guild', data)
  }
}

// 解约
export const guildRescindReq = data => put('/api/v1/guild/rescind', data)

// 续约
export const guildRenewalReq = data => put('/api/v1/guild/renewal', data)
