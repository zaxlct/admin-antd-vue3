<template>
  <HierarchySetting
    @openUserList="openUserList"
    @onAddHierarchy="getHierarchyList"
    :userListData="userListData"
    :nobleList="nobleList"
  />
  <a-card
    class="mt20"
    title="层级历史"
  >
    <a-table
      :loading="hierarchyTableLoading"
      rowKey="id"
      :pagination="false"
      :scroll="{ x: 1200, y: 800 }"
      :dataSource
      :columns="columns"
    />
  </a-card>

</template>

<script setup lang="jsx">
import HierarchySetting from './components/HierarchySetting.vue'
import { getHierarchyUsersReq, getHierarchyListReq, deleteHierarchyReq } from '@/api/hierarchy'
import { getNobleListReq } from '@/api/public'
import Enums from '@/enums/common'
const { createDialog } = useDialog()
const nobleList = ref([])
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

const dataSource = ref([])
const columns = [
  {
    title: '序号',
    width: 80,
    customRender: ({ index }) => <span>{index}</span>
  },
  {
    title: '层级名称',
    width: 110,
    dataIndex: 'name',
  },
  {
    title: '层级条件',
    dataIndex: 'conds',
    customRender: ({ record }) => (
      <div v-if={record.conds}>
        <a-tag v-if={typeof record.conds.recharged === 'boolean'}>
          <a-space class="fz12">
            <span v-if={record.conds.recharged}>充值过</span>
            <span v-if={record.conds.recharge_range}>
              自定义充值金额范围：
              {record.conds.recharge_range[0]} - {record.conds.recharge_range[1]}
            </span>
          </a-space>
        </a-tag>

        <a-tag v-if={record.conds.noble_status}>
          <a-space class="fz12">
            {record.conds.noble_status === 1 ? '开通过贵族' : '当前为贵族'}
            <span>
              等级：{nobleList.value.find(item => item.value === record.conds.noble_lv)?.label}
            </span>
          </a-space>
        </a-tag>

        <a-tag v-if={record.conds.os_type}>
          {record.conds.os_type === 1 ? 'iOS' : 'Android'}
        </a-tag>

        <a-tag v-if={typeof record.conds.user_all_lv === 'boolean'}>
          <a-space class="fz12">
            <span v-if={record.conds.user_all_lv}>全部等级</span>
            <span v-if={record.conds.user_lv_range}>
              自定义等级范围：
              {record.conds.user_lv_range[0]} - {record.conds.user_lv_range[1]}
            </span>
          </a-space>
        </a-tag>

        <a-tag v-if={typeof record.conds.withdrawn === 'boolean'}>
          <a-space class="fz12">
            <span v-if={record.conds.withdrawn}>提现过</span>
            <span v-if={record.conds.withdrawn_range}>
              自定义提现金额
              {record.conds.withdrawn_range[0]} - {record.conds.withdrawn_range[1]}
            </span>
          </a-space>
        </a-tag>

        <a-tag v-if={record.conds.user_type}>
          <a-space>
            <span class="fz12" v-for={item in record.conds.user_type} key={item}>{Enums.user_type[item]}</span>
          </a-space>
        </a-tag>

        <a-tag v-if={record.conds.lang}>
          <a-space>
            <span class="fz12" v-for={item in record.conds.lang} key={item}>{Enums.lang_type[item]}</span>
          </a-space>
        </a-tag>

        <a-tag v-if={record.conds.bought_vanity_number || record.conds.is_vanity_user}>
          <a-space class="fz12">
            {record.conds.bought_vanity_number ? '购买过靓号' : null}
            {record.conds.is_vanity_user ? '当前为靓号用户' : null}
          </a-space>
        </a-tag>
      </div>
    ),
  },
  {
    title: '操作',
    width: 130,
    customRender: ({ record }) => (
      <div>
        <a-button
          type="link"
          size="small"
          onClick={() => openUserList(record.conds)}
        >
          查看用户
        </a-button>
        <a-popconfirm title='确定删除吗？' onConfirm={() => deleteHierarchy(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
    ),
  },
]

// 删除层级
function deleteHierarchy(record) {
  deleteHierarchyReq({
    hier_ids: [record.id],
  }).then(() => {
    getHierarchyList()
  })
}

onMounted(() => {
  getHierarchyList()
  getNobleListReq().then(data => {
    const list = data.items.map(item => ({
      label: item.noble_name,
      value: item.noble_id,
    }))
    nobleList.value = [{ label: '全部', value: 0 }, ...list]
  })
})

const hierarchyTableLoading = ref(false)
function getHierarchyList() {
  hierarchyTableLoading.value = true
  getHierarchyListReq({
    page: 1,
    limit: 99,
  }).then(data => {
    dataSource.value = data.items
  }).finally(() => {
    hierarchyTableLoading.value = false
  })
}
</script>
