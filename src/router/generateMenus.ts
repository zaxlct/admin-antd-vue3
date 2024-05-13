export type Iconfont = string // 假设 Iconfont 只是一个字符串类型

// types.ts
export interface IMenu {
  title: string
  path: string
  url?: string
  icon?: Iconfont // 确保 Iconfont 类型也已定义
  type?: number
  hide?: boolean
  children?: IMenu[]
  [K: string]: any
}

/**
 * 根据路由树生成菜单数组
 * @param routes - 路由树数组
 * @returns {IMenu[]} - 生成的菜单数组
 */
export default function generateMenus(routes: Types.RouteItem[]): IMenu[] {
  const menus: IMenu[] = []

  const buildMenus = (routeItems, menuList) => {
    routeItems.forEach(route => {
      // 跳过被隐藏的路由
      if (route.hide) {
        return
      }

      // 初始化菜单项
      const menu = {
        title: route.title,
        path: route.path,
        url: route.url,
        icon: route.icon,
        hidden: route.hidden,
      }

      // 处理子路由
      if (route.children && route.children.length > 0) {
        menu.children = []
        buildMenus(route.children, menu.children)

        // 如果只有一个子菜单，并且该子菜单没有自己的子菜单，合并父菜单与子菜单
        if (menu.children.length === 1 && (!menu.children[0].children || menu.children[0].children.length === 0)) {
          const childMenu = menu.children[0]
          menu.title = childMenu.title // 更新标题为子菜单的标题
          menu.path = childMenu.path   // 更新路径为子菜单的路径
          menu.url = childMenu.url     // 更新URL为子菜单的URL
          menu.icon = childMenu.icon || menu.icon // 若子菜单无图标则保持原图标
          delete menu.children // 移除子菜单数组
        }
      }

      menuList.push(menu)
    })
  }

  buildMenus(routes, menus)
  return menus
}
