import { get, post, del } from '../utils/request'

export const getSmsChannelConfigListReq = (params?) => get('/api/v1/sms/channel/config', params)

// 添加与编辑
// id 为 null 时为添加
export const smsChannelAddOrEditReq = (id, data) => {
  if (id) {
    return post('/api/v1/sms/channel/config/' + id, data)
  } else {
    return post('/api/v1/sms/channel/config', data)
  }
}

export const delSmsChannelReq = conf_id => del(`/api/v1/sms/channel/config/${conf_id}`)
