import { get, del, post } from '../utils/request'

export const getRoleListReq = (params?) => get('/api/v1/permission/role', params)
export const getPermissionListReq = (params?) => get('/api/v1/permission/items', params)

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

export const getDepartmentListReq = (params?) => get('/api/v1/permission/department', params)

// 添加与编辑
// id 为 null 时为添加
export const departmentAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/permission/department/' + id, data)
  } else {
    return post('/api/v1/permission/department', data)
  }
}

export const delDepartmentReq = data => del('/api/v1/permission/department', data)

export const getAccountListReq = (params?) => get('/api/v1/permission/account', params)
export const genSecretKeyReq = () => get('/api/v1/permission/gen/secretkey')

// 添加与编辑
// id 为 null 时为添加
export const accountAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/permission/account/' + id, data)
  } else {
    return post('/api/v1/permission/account', data)
  }
}

export const delAccountReq = data => del('/api/v1/permission/account', data)
