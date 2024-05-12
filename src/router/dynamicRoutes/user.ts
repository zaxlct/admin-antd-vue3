import type { RouteRecordRaw } from 'vue-router'
// 系统管理
export default [
  {
    path: '/user',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { permission: 'user' },
    children: [
      // 菜单管理
      {
        path: '/user/list',
        component: () => import('@/views/user/list/index.vue'),
        meta: {
          permission: 'user/list',
          title: '用户管理'
        },
      },
      {
        path: '/user/hierarchy',
        component: () => import('@/views/user/hierarchy/index.vue'),
        meta: {
          permission: 'user/hierarchy',
          // activeMenu: '/user/school',
          // hideBreadcrumb: true,
          title: '层级管理',
        },
      },
    ],
  },
] as RouteRecordRaw[]
