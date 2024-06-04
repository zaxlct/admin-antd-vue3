import { get } from '../utils/request'

export const getStatSummaryReq = (params?) => get('/api/v1/stat/summary', params)
