<template>
  <HierarchySetting @openUserList="openUserList" />
  <a-card
    class="mt20"
    title="层级历史"
  >

  </a-card>

</template>

<script setup lang="jsx">
import HierarchySetting from './components/HierarchySetting.vue'
import { getHierarchyUsersReq } from '@/api/hierarchy'
const { createDialog } = useDialog()

const userListData = reactive({
  items: [],
  total: 0,
})
async function openUserList(params) {
  const loading = ref(true)
  getHierarchyUsersReq(params).then(data => {
    userListData.items = data.items
    userListData.total = data.total_data
    loading.value = false
  }).finally(() => {
    loading.value = false
  })

  const columns = [
    {
      title: '用户昵称',
      dataIndex: 'nickname',
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
    },
  ]

  createDialog({
    width: 500,
    title: '层级用户',
    footer: null,
    component: () =>
      <div>
        <a-table
          loading={loading.value}
          rowKey="user_id"
          pagination={false}
          scroll={{x: 480, y: 500 }}
          dataSource={userListData.items}
          columns={columns}
        />

        <p class="mt10 fz12 c666">
          已选择 {userListData.total} 位用户
        </p>
      </div>
  })
}
</script>
