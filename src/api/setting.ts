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
