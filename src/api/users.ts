import { get, post } from '../utils/request'

export const getUserListReq = (params?) => get('/api/v1/users', params)
