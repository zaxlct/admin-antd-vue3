import { get, post, put } from '../utils/request'

export const getUserListReq = (params?) => get('/api/v1/users', params)
export const getUserLogListReq = (user_id, params) => get('/api/v1/users/logs/device/' + user_id, params)
export const getUserFunclubListReq = (user_id, params) => get('/api/v1/users/fanclub/' + user_id, params)
export const setUserRemarkReq = (user_id, data) => post('/api/v1/users/set/remark/' + user_id, data)
export const setBlackReq = data => put('/api/v1/users/set/blacklist', data)
export const setMuteReq = data => put('/api/v1/users/set/mute', data)

// 标签
export const setUserTagsReq = data => put('/api/v1/users/tags', data)

// 获取某个用户的标签列表
export const getUserTagsReq = (user_id) => get('/api/v1/users/tags/' + user_id)
