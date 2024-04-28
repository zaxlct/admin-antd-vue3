import type { RouteRecordRaw } from 'vue-router'
// 系统管理
export default [
  {
    path: '/company',
    component: () => import(/* webpackChunkName: "layout" */ '@/layouts/DefaultLayout.vue'),
    meta: { permission: 'company' },
    children: [
      // 菜单管理
      {
        path: '/company/list',
        component: () => import('@/views/company/list/index.vue'),
        meta: {
          permission: 'company/list',
          title: '公司管理'
        },
      },
      {
        path: '/company/school',
        component: () => import('@/views/company/school/index.vue'),
        meta: {
          permission: 'company/school',
          // activeMenu: '/company/school',
          // hideBreadcrumb: true,
          title: '学校管理',
        },
      },
      {
        path: '/company/skill',
        component: () => import('@/views/company/skill/index.vue'),
        meta: {
          permission: 'company/skill',
          title: '技能管理',
        },
      },
    ],
  },
] as RouteRecordRaw[]
