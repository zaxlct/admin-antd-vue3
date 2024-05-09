import { get, post } from '../utils/request'

export const getUserListReq = (params?) => get('/api/v1/users', params)
export const getUserLogListReq = (user_id) => get('/api/v1/users/logs/device/' + user_id)
