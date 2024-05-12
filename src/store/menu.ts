
export default defineStore('menu', () => {
  const dynamicRoutes = ref<Types.RouteItem[]>([])

  function setDynamicRoutes(routes: Types.RouteItem[]) {
    dynamicRoutes.value = routes
  }

  return { dynamicRoutes, setDynamicRoutes }
})
