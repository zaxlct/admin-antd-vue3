import { createPinia } from 'pinia'
import { createApp } from 'vue'
import formCreate from '@form-create/ant-design-vue'
import install from '@form-create/ant-design-vue/auto-import'
import router from './router'
import request from '@/utils/request'

import directives from '@/directives'
import plugins from '@/plugins'
import '@/assets/styles/common.less'
import '@/assets/styles/index.sass'
import App from './App.vue'
import { authPlugin } from '@bwrong/auth-tool'
formCreate.use(install)

formCreate.fetch = options => {
  request[options.method](options.action, options.data).then(res => {
    options.onSuccess(res)
  })
}

const app = createApp(App)
app.use(createPinia())
app.use(formCreate, {
  wrap: {
    labelCol: {
      span: 4,
    },
  },
})
app.use(router)
app.use(plugins) // 注册插件
app.use(directives) // 注册指令
app.use(authPlugin)
app.mount('#app')
export default app
