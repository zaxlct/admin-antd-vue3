<template>
  <div class="login-page">
    <img
      class="logo"
      src="@/assets/images/logo.png"
      alt="LOGO"
    >
    <section class="login-form">
      <div class="form_container">
        <h3 class="title tc">{{ appTitle }}</h3>
        <a-form
          ref="formRef"
          :model="state.loginInfo"
          :rules="rules"
          class="form"
          :wrapper-col="{ span: 24 }"
          @keydown.enter="handleLogin"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="state.loginInfo.username"
              placeholder="请输入账号"
              type="text"
            >
              <template #prefix>
                <icon-font type="i-user" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="word">
            <a-input
              v-model:value="state.loginInfo.word"
              auto-complete="off"
              placeholder="请输入密码"
              type="password"
            >
              <template #prefix>
                <icon-font type="i-lock" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item style="width: 100%">
            <a-button
              block
              class="login"
              :loading="state.loading"
              type="primary"
              size="large"
              @click.prevent="handleLogin"
            >
              登 录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'
import { setToken } from '@/utils/auth'

import type { LocationQuery } from 'vue-router'

import { loginRequest } from '@/api/auth'
import config from '@/config'
import { cryptoPassword } from '@/utils'
import { setStorage } from '@bwrong/storage'
import type { FormProps } from 'ant-design-vue/es'

const rules: FormProps['rules'] = {
  username: [
    {
      type: 'string',
      required: true,
      trigger: 'blur',
      message: '请输入账号',
    },
    // { validator: ruleUserName }
  ],
  word: [
    {
      type: 'string',
      required: true,
      trigger: 'blur',
      message: '请输入密码',
    },
  ],
}
const appTitle = config.appTitle
const route = useRoute()
const router = useRouter()
const formRef = ref()
const state = reactive({
  loginInfo: {
    username: '',
    word: '',
  },
  loading: false,
  isShowModal: false,
})
const redirect = computed(() => {
  const noRedirect = ['/err', '/login']
  const redirectUrl = (route.query.redirect as string) || '/'
  return noRedirect.includes(redirectUrl) ? '/' : redirectUrl
})

function getOtherQuery(query: LocationQuery) {
  return Object.keys(query).reduce(
    (acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    },
    {} as Record<string, LocationQueryValue | LocationQueryValue[]>
  )
}

// 登录
function handleLogin() {
  formRef.value
    .validate()
    .then(() => {
      state.loading = true
      const { username, word } = state.loginInfo
      loginRequest({
        username,
        password: cryptoPassword(word, config.cryptoKey),
      })
        .then(async res => {
          message.success('登录成功！')
          setToken(res.token)
          // 存储用户信息
          setStorage('userinfo', res)
          router.replace({
            path: redirect.value,
            query: getOtherQuery(route.query),
          })
          state.loading = false
        })
        .catch(err => {
          console.log(err)
          state.loading = false
        })
    })
    .catch((err: Error) => {
      console.log(err)
      state.loading = false
      message.error('用户名或密码输入不正确！')
    })
}
</script>
<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
  background: url('@/assets/images/login_bg.png') center center / cover no-repeat;
}

.logo {
  position: fixed;
  left: 20px;
  top: 20px;
  height: 26px;
}

.login-form {
  padding-left: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 916px;
  height: 600px;
  border-radius: 24px;
  box-shadow: 0px 4px 50px 0px rgba(0, 0, 0, 0.25);
  background: url('@/assets/images/login_box_bg.png') #fff left center no-repeat;
  background-size: 400px 600px;

  @media screen and (max-width: 960px) {
    padding-left: 0;
    background: #fff;
    width: 80%;
    height: 80%;
  }

  .form_container {
    width: 388px;

    .title {
      margin-bottom: 48px;
      font-size: 24px;
      font-weight: bold;
    }
  }
}
</style>
