import { get, put, del, post } from '../utils/request'

export const getLevelListReq = (params?) => get('/api/v1/setting/level', params)

// 添加与编辑
// id 为 null 时为添加
export const levelAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/setting/level/' + id, data)
  } else {
    return post('/api/v1/setting/level', data)
  }
}
export const setLevelConfigReq = data => put('/api/v1/setting/level/config', data)
export const getLevelConfigReq = () => get('/api/v1/setting/level/config')
export const delLevelReq = data => del('/api/v1/setting/level', data)

export const getClientListReq = (params?) => get('/api/v1/setting/client/update', params)

// 添加与编辑
// id 为 null 时为添加
export const clientAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/setting/client/update/' + id, data)
  } else {
    return post('/api/v1/setting/client/update', data)
  }
}
export const delClientReq = data => del('/api/v1/setting/client/update', data)

export const getLiveCategoryListReq = (parent_id, params?) => get(`/api/v1/setting/live/category${parent_id ? '/' + parent_id : ''}`, params)
// 添加与编辑
// id 为 null 时为添加
export const liveCategoryAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/setting/live/category/' + id, data)
  } else {
    return post('/api/v1/setting/live/category', data)
  }
}
export const delLiveCategoryReq = data => del('/api/v1/setting/live/category', data)

// get综合配置
export const getSettingGeneralReq = () => get('/api/v1/setting/general')
// 保存综合配置
export const saveSettingGeneralReq = data => put('/api/v1/setting/general', data)


// get综合配置
export const getSettingRedirectReq = () => get('/api/v1/setting/redirect')
// 保存综合配置
export const saveSettingRedirectReq = data => put('/api/v1/setting/redirect', data)
