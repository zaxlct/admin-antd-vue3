import { get, post } from '../utils/request'

export const getHierarchyUsersReq = (params?) => get('/api/v1/hierarchy/users/summary', params)

export const createHierarchyReq = data => post('/api/v1/hierarchy', data)
