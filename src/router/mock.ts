
export default [
  {
    id: 9999999, //路由的id
    parentId: 0, //父级id  顶级菜单的pid 0
    component: "", //组件的文件地址，views下
    path: "/", //浏览器的地址
    title: "首页", //标题
    icon: "icon-menu", //图标
    menu: true, //是否为目录
    redirect: "/home" //重定向
  },
  {
    id: 888888,
    parentId: 9999999,
    component: "/home/home",
    path: "/home",
    title: "首页",
    icon: "",
    menu: false,
    redirect: ""
  },
  {
    id: 1, //路由的id
    parentId: 0, //父级id  顶级菜单的pid 0
    component: "", //组件的文件地址，views下
    path: "/user", //浏览器的地址
    title: "用户", //标题
    icon: "icon-menu", //图标
    menu: true, //是否为目录
    redirect: "/user/list" //重定向
  },
  {
    id: 2,
    parentId: 1,
    component: "/user/list",
    path: "/user/list",
    title: "用户管理",
    icon: "",
    menu: false,
    redirect: ""
  },
  {
    id: 3,
    parentId: 1,
    component: "/user/hierarchy",
    path: "/user/hierarchy",
    title: "层级管理",
    icon: "",
    menu: false,
    redirect: ""
  },
  {
    id: 4, //路由的id
    parentId: 0,
    component: "",
    path: "/guild",
    title: "工会管理",
    icon: "icon-menu",
    menu: true,
    redirect: "/guild/list"
  },
  {
    id: 44, //路由的id
    parentId: 4,
    component: "/guild/list",
    path: "/guild/list",
    title: "工会管理",
    icon: "icon-menu",
    menu: false,
    redirect: ""
  },
  {
    id: 5,
    parentId: 0,
    component: "",
    path: "/anchor",
    title: "主播",
    icon: "icon-menu",
    menu: true,
    redirect: "/anchor/list",
  },
  {
    id: 6,
    parentId: 5,
    component: "/anchor/list",
    path: "/anchor/list",
    title: "主播管理",
    icon: "icon-menu",
    menu: false,
    redirect: "",
  },
  {
    id: 7,
    parentId: 5,
    component: "/anchor/detail",
    path: "/anchor/detail",
    title: "编辑主播信息",
    icon: "icon-menu",
    menu: false,
    hide: true,
    redirect: "",
    activeMenu: "/anchor/list",
  },
  {
    id: 8,
    parentId: 5,
    component: "/anchor/statistics",
    path: "/anchor/statistics",
    title: "主播直播数据",
    icon: "icon-menu",
    menu: false,
    redirect: "",
  },
  {
    id: 9,
    parentId: 0,
    component: "",
    path: "/recweight",
    title: "推荐位配置",
    icon: "icon-menu",
    menu: true,
    redirect: "/recweight/list",
  },
  {
    id: 10,
    parentId: 9,
    component: "/recweight/list",
    path: "/recweight/list",
    title: "推荐位配置",
    icon: "icon-menu",
    menu: false,
    redirect: "",
  },
  {
    id: 899,
    parentId: 0,
    component: "",
    path: "/merchant",
    title: "商户管理",
    icon: "icon-menu",
    menu: true,
    redirect: "/merchant/list",
  },
  {
    id: 900,
    parentId: 899,
    component: "/merchant/list",
    path: "/merchant/list",
    title: "商户管理",
    icon: "icon-menu",
    menu: false,
    redirect: "",
  },
  {
    id: 901,
    parentId: 0,
    component: "",
    path: "/gift",
    title: "礼物管理",
    icon: "icon-menu",
    menu: true,
    redirect: "/gift/list",
  },
  {
    id: 902,
    parentId: 901,
    component: "/gift/list",
    path: "/gift/list",
    title: "礼物管理",
    icon: "icon-menu",
    menu: false,
    redirect: "",
  },
  {
    id: 903,
    parentId: 0,
    component: "",
    path: "/message",
    title: "消息管理",
    icon: "icon-menu",
    menu: true,
    redirect: "/message/list",
  },
  {
    id: 904,
    parentId: 903,
    component: "/message/list",
    path: "/message/list",
    title: "消息管理",
    icon: "icon-menu",
    menu: false,
    redirect: "",
  },
  {
    id: 905,
    parentId: 0,
    component: "",
    path: "/notice",
    title: "公告",
    icon: "icon-menu",
    menu: true,
    redirect: "/notice/list"
  },
  {
    id: 906,
    parentId: 905,
    component: "/notice/list",
    path: "/notice/list",
    title: "公告管理",
    icon: "",
    menu: false,
    redirect: ""
  },
  {
    id: 907,
    parentId: 905,
    component: "/notice/marquee",
    path: "/notice/marquee",
    title: "跑马灯配置",
    icon: "",
    menu: false,
    redirect: ""
  },
]
