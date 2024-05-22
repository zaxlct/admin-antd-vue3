import { clearStorage } from '@bwrong/storage'

import router, { resetRouter } from '@/router'

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token: string) {
  return localStorage.setItem('token', token)
}

// 登出，清理登录信息
export function logout() {
  // clearAuthData()
  clearStorage(['theme'])
  router.replace('/login')
  resetRouter()
  location.reload()
}
