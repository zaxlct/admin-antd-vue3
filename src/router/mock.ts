
export default [
  {
    id: 1, //路由的id
    pid: 0, //父级id  顶级菜单的pid 0
    component: "", //组件的文件地址，views下
    path: "/user", //浏览器的地址
    title: "用户", //标题
    icon: "icon-menu", //图标
    menu: true, //是否为目录
    redirect: "/user/list" //重定向
  },
  {
    id: 2, //路由的id
    pid: 1, //父级id  顶级菜单的pid 0
    component: "/user/list", //组件的文件地址，views下
    path: "/user/list", //浏览器的地址
    title: "路由配置", //标题
    icon: "", //图标
    menu: false, //是否为目录
    redirect: "" //重定向
  },
  {
    id: 3, //路由的id
    pid: 1, //父级id  顶级菜单的pid 0
    component: "/user/hierarchy", //组件的文件地址，views下
    path: "/user/hierarchy", //浏览器的地址
    title: "层级管理", //标题
    icon: "", //图标
    menu: false, //是否为目录
    redirect: "" //重定向
  },
]
