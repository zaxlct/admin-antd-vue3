import { get, post, put } from '../utils/request'

export const getUserListReq = (params?) => get('/api/v1/users', params)
export const getUserLogListReq = (user_id, params) => get('/api/v1/users/logs/device/' + user_id, params)
export const setUserRemarkReq = (user_id, data) => post('/api/v1/users/set/remark/' + user_id, data)
export const setBlackReq = data => put('/api/v1/users/set/blacklist', data)
export const setMuteReq = data => put('/api/v1/users/set/mute', data)

// 标签
export const setUserTagsReq = data => put('/api/v1/users/tags', data)

// 获取某个用户的标签列表
export const getUserTagsReq = (user_id) => get('/api/v1/users/tags/' + user_id)

// 生成 user_id
export const createUserIdReq = () => get('/api/v1/users/gen/userid')


// 添加与编辑
// id 为 null 时为添加
export const userAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/users/' + id, data)
  } else {
    return post('/api/v1/users', data)
  }
}

// 重置密码
export const resetPasswordReq = user_id => put('/api/v1/users/reset/password/' + user_id)
