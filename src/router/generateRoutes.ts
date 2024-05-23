import { convertToTree, type ITreeData } from '@/utils/index'

const AllRouter = import.meta.glob('@/views/**/*.vue')

export default function generateRoutes(serverRoutes: Types.RouteReqItem[]): Types.RouteItem[] {
  const treeData: ITreeData<Types.RouteItem> = {
    data: serverRoutes,
  }

  // 使用通用的 convertToTree 函数转换路由数据
  const routesTree = convertToTree<Types.RouteItem>(treeData)

  // 动态设置组件和处理 meta 属性
  const setComponent = (routes: Types.RouteReqItem[]) => {
    routes.forEach(route => {
      // 直接将 url 字段赋值为 path 字段
      route.url = route.path

      // 处理组件动态加载
      // 如果是顶级路由(parentId === 0)，则使用默认布局组件
      if (route.parentId === 0) {
        route.component = () => import('@/layouts/DefaultLayout.vue')
      } else if (route.component) {
        const componentPath = `/src/views${route.component}/index.vue`
        const importFn = AllRouter[componentPath]
        if (importFn) {
          route.component = importFn
        } else {
          console.error('Component not found for path:', componentPath)
        }
      }

      // 初始化或扩展 meta 对象
      route.meta = route.meta || {}
      if (route.activeMenu) {
        route.meta.activeMenu = route.activeMenu
      }
      if (route.hideBreadcrumb) {
        route.meta.hideBreadcrumb = route.hideBreadcrumb
      }
      if (route.icon) {
        route.meta.icon = route.icon
      }
      if (route.title) {
        route.meta.title = route.title
      }
      if (route.permission) {
        route.meta.permission = route.permission
      }

      // 递归设置子组件
      if (route.children) {
        setComponent(route.children)
      }
    })
  }

  setComponent(routesTree)
  return routesTree
}
