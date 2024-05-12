declare namespace Types {
  interface RouteItem {
    id: number              // 路由的唯一标识
    parentId: number             // 父路由的唯一标识，如果为0，则表示是根路由
    path: string            // 路由的路径
    url: string            // 路由的路径,直接复制path
    title: string           // 路由的标题
    component?: any      // 路由的组件路径
    icon?: string           // 路由的图标
    menu: boolean           // 是否作为菜单项
    redirect?: string       // 重定向路径
    children?: RouteItem[]  // 子路由数组
  }

  interface Menu {
    path: string //地址
    url: string //路由的路径,直接复制path
    icon: string //图标
    title: string //标题
    children: Array<Menu> //子项
  }
}
