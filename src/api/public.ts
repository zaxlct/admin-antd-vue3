import { get } from '../utils/request'

export const getUserFunclubListReq = (user_id, params) => get('/api/v1/users/fanclub/summary/' + user_id, params)
export const getMerchantListReq = params => get('/api/v1/merchant/summary', params)
export const getNobleListReq = params => get('/api/v1/noble/summary', params)
