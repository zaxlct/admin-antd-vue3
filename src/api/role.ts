import { get, del, post } from '../utils/request'

export const getRoleListReq = (params?) => get('/api/v1/permission/role', params)

// 添加与编辑
// id 为 null 时为添加
export const roleAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/permission/role/' + id, data)
  } else {
    return post('/api/v1/permission/role', data)
  }
}

export const delRoleReq = data => del('/api/v1/permission/role', data)
