<template>
  <HierarchySetting
    @openUserList="openUserList"
    :userListData="userListData"
  />
  <a-card
    class="mt20"
    title="层级历史"
  >
    <a-table
      rowKey="id"
      :pagination="false"
      :scroll="{ x: 1200, y: 800 }"
      :dataSource
      :columns="columns"
      :loading="loading"
    />
  </a-card>

</template>

<script setup lang="jsx">
import HierarchySetting from './components/HierarchySetting.vue'
import { getHierarchyUsersReq, getHierarchyListReq } from '@/api/hierarchy'
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

const loading = ref(false)
const dataSource = ref([])
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => <span>{index}</span>
  },
  {
    title: '层级名称',
    dataIndex: 'name',
  },
  {
    title: '层级条件',
    dataIndex: 'conds',
    customRender: ({ record }) => (
      <div v-if={record.conds}>
        <span v-if={record.conds.recharged}>充值过 | </span>
        <span v-if={record.conds.recharge_range}>
          自定义充值金额范围
          {record.conds.recharge_range[0]} - {record.conds.recharge_range[1]}
          &nbsp;|&nbsp;
        </span>
        <span v-if={record.noble_status}></span>
      </div>
    ),
  },
  {
    title: '操作',
    customRender: ({ record }) => (
      <div>
        <a-button
          type="link"
          onClick={() => openUserList({ hierarchy_id: record.id })}
        >
          查看用户
        </a-button>
        <a-popconfirm title='确定删除吗？' onConfirm={() => openRescindModal(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
    ),
  },
]


onMounted(() => {
  getHierarchyList()
})
function getHierarchyList() {
  getHierarchyListReq({
    page: 1,
    limit: 99,
  }).then(data => {
    dataSource.value = data.items
  })
}
</script>
