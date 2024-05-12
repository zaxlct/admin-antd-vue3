import { convertToTree, type ITreeData } from '@/utils/index'

const AllRouter = import.meta.glob('@/views/**/*.vue')

export default function transformRoutes(serverRoutes: Types.RouteItem[]): Types.RouteItem[] {
  const treeData: ITreeData<Types.RouteItem> = {
    data: serverRoutes,
    parentId: 0,                // 顶级节点的 ID
    children: 'children',  // 子集标识key
    pidName: 'parentId',        // 父级标译key
    idName: 'id'           // ID 标识key
  }

  // 使用通用的 convertToTree 函数转换路由数据
  const routesTree = convertToTree<Types.RouteItem>(treeData)

  // 由于路由可能需要动态加载组件，这里额外处理组件路径
  const setComponent = (routes: Types.RouteItem[]) => {
    routes.forEach(route => {
      if (route.menu) {
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

      if (route.children) {
        setComponent(route.children)
      }
    })
  }

  setComponent(routesTree)
  return routesTree
}
