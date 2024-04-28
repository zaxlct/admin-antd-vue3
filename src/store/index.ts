import { getStorage, setStorage } from '@bwrong/storage'

interface IUserInfo {
  username: string
}

export const useRootStore = defineStore('root', () => {
  const userinfo = ref<IUserInfo>(getStorage<IUserInfo>('userinfo') || {} as IUserInfo)

  const userinfoGetter = computed(() => {
    if (userinfo.value.username) {
      return userinfo.value
    } else {
      const storedUserInfo = getStorage<IUserInfo>('userinfo') || {} as IUserInfo
      userinfo.value = storedUserInfo
      return storedUserInfo
    }
  })

  function setUserinfo(data: IUserInfo) {
    userinfo.value = data
    setStorage('userinfo', data)
  }

  function getUserinfo() {
    const userInfo = getStorage<IUserInfo>('userinfo') || {} as IUserInfo
    setUserinfo(userInfo)
  }

  return { userinfo, userinfoGetter, setUserinfo, getUserinfo }
})
