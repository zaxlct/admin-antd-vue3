import { createPinia } from 'pinia'
import { createApp } from 'vue'
import router from './router'
import ENUMS from '@/enums/common'

import directives from '@/directives'
import plugins from '@/plugins'
import '@/assets/styles/common.less'
import '@/assets/styles/index.sass'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$enums = ENUMS

app.use(createPinia())
app.use(router)
app.use(plugins) // 注册插件
app.use(directives) // 注册指令
app.mount('#app')
export default app
