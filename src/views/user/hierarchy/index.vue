<template>
  <HierarchySetting
    @openUserList="openUserList"
    :userListData="userListData"
  />
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
  loading: false,
})
async function openUserList(params) {
  userListData.loading = true
  getHierarchyUsersReq(params).then(data => {
    userListData.items = data.items
    userListData.total = data.total_data
    userListData.loading = false
  }).finally(() => {
    userListData.loading = false
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
          loading={userListData.loading}
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
