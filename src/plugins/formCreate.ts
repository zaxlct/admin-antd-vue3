import install from '@form-create/ant-design-vue/auto-import'
import { get } from '@/utils/request'
import type { App } from 'vue'

formCreate.use(install)
formCreate.fetch = options => {
  get(options.action, options.data)
    .then(res => {
      options.onSuccess(res)
    })
    .catch(err => {
      console.log('fetch err', err)
    })
}

export default (app: App) => {
  app.use(formCreate, {
    wrap: {
      labelCol: {
        span: 4,
      },
    },
  })
}
