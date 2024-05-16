import { useRequestDevToolsPlugin } from 'vue-hooks-plus'
import formCreate from './formCreate'
import type { App } from 'vue'

export default (app: App) => {
  // console.log(app);
  app.use(useRequestDevToolsPlugin)
  formCreate(app)
}
