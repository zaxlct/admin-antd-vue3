import type { RouteRecordRaw } from 'vue-router'
// 静态路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Index.vue'),
    meta: {},
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/error/Index.vue'),
    meta: {},
  },
]
export default routes
// 未匹配到路由时显示的页面
export const noMatchRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  redirect: '/error',
}
