import { get, post, del } from '../utils/request'

export const getHierarchyUsersReq = (params?) => get('/api/v1/hierarchy/users/summary', params)
export const getHierarchyListReq = (params?) => get('/api/v1/hierarchy', params)

export const createHierarchyReq = data => post('/api/v1/hierarchy', data)
export const deleteHierarchyReq = data => del('/api/v1/hierarchy', data)
