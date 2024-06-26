import system from './system'
import company from './company'

import type { RouteRecordRaw } from 'vue-router'
// 注意：为了方便和后台返回菜单合并，提取url，path需要填写完整路径
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/Index.vue'),
        meta: { title: '首页' },
      },
    ],
  },
  ...system,
  ...company,
]
export default routes
