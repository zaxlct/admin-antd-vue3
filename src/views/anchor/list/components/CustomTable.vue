<template>
  <a-table
    rowKey="guild_id"
    :pagination="false"
    :scroll="{ x: 1200, y: 800 }"
    :dataSource
    :columns="columns"
    :loading="loading"
  />
  <a-pagination
    class="mt15"
    hideOnSinglePage
    v-model:current="pagination.page"
    v-model:pageSize="pagination.limit"
    size="small"
    :total="pagination.total"
  />
</template>

<script setup lang="jsx">
import { getAnchorListReq, anchorAddOrEditReq } from '@/api/anchor'
import { getMerchantListReq } from '@/api/public'

const props = defineProps({
  searchParams: {
    type: Object,
    default: () => ({}),
  },
  resetSearch: {
    type: Function,
    default: () => { },
  },
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})

const dataSource = ref([])
const { loading, refresh } = useRequest(() => getAnchorListReq({
  ...props.searchParams,
  page: pagination.page,
  limit: pagination.limit,
}), {
  refreshDeps: true,
  onSuccess(data) {
    dataSource.value = data.items
    pagination.total = data.total_data
  },
})
const { createDialog } = useDialog()

const columns = [
  {
    title: '主播来源',
    dataIndex: 'source_name',
  },
  {
    title: '展示商户',
    dataIndex: 'merch_rel',
    customRender: ({ record }) =>
      <div>
        <p v-if={record.merch_rel?.is_all}>所有商户</p>
        <p v-else-if={record.merch_rel?.count}>
          <span v-if={record.merch_rel.count === 1}>
            {record.merch_rel?.sample_data?.merch_name}
          </span>
          <a-button
            v-else-if={record.merch_rel.count > 1}
            type="link"
            size="small"
            onClick={() => openMerchantModal(record.guild_id)}
          >
            {record.merch_rel?.count || 0}个商户
          </a-button>
        </p>
        <span v-else>--</span>
      </div>
  },
  {
    title: '主播头像',
    dataIndex: 'avatar_url',
    customRender: ({ record }) =>
      <a-avatar src={record.avatar_url} size={40} />
  },
  {
    title: '主播昵称',
    dataIndex: 'nickname',
  },
  {
    title: '房间号',
    dataIndex: 'room_id',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '所属公会',
    dataIndex: 'guild_rel',
    customRender: ({ record }) => <span v-if={record.guild_rel}>{record.guild_rel?.guild_name || '--'}</span>
  },
  {
    title: '分成比例',
    dataIndex: 'ps_ratio',
    customRender: ({ record }) => <div>{record.ps_ratio}%</div>
  },
  {
    title: '直播状态',
    dataIndex: 'live_status',
    // TODO: live_status 没有API文档说明
    customRender: ({ record }) =>
    <div>
        <a-tag color="green" v-if={record.live_status}>直播中</a-tag>
        <a-tag v-else>未开播</a-tag>
    </div>
  },
  {
    title: '搜索推荐权重',
    dataIndex: 'sr_weight',
  },
  {
    title: '关注推荐权重',
    dataIndex: 'fr_weight',
  },
  {
    title: '房间推荐权重',
    dataIndex: 'rr_weight',
  },
  {
    title: '热度值',
    dataIndex: 'heat_value',
  },
  {
    title: '收益余额',
    dataIndex: 'eps_balance',
  },
  {
    title: '入驻时间',
    dataIndex: 'join_time',
  },
  {
    title: '账号状态',
    dataIndex: 'acct_status',
    // TODO: acct_status 没有API文档说明
    // TODO: 正常、拉黑、注销、冻结，状态太多，需要确认
    customRender: ({ record }) =>
      <div>
        <a-tag color="green" v-if={record.acct_status}>正常</a-tag>
        <a-tag v-else>拉黑</a-tag>
      </div>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        {/* TODO:拉黑或者注销时不可编辑 */}
        <a-button type="link" size="small" onClick={() => editItem(record)}>编辑</a-button>
        <a-button type="link" size="small" onClick={() => editItem(record)}>数据</a-button>

        <a-popconfirm title='确定拉黑吗？' onConfirm={() => blockUser(record)}>
          {/* TODO:判断已经拉黑或者未拉黑 */}
          <a-button type="link" size="small">拉黑</a-button>
        </a-popconfirm>
      </div>
  }
]

// 拉黑用户
function blockUser() {
  // TODO:复用用户拉黑的接口？
}

async function getMerchantList(guild_id) {
  loading.value = true
  const [err, data] = await to(getMerchantListReq({ guild_id }))
  if (err) {
    console.log(err)
    loading.value = false
    throw new Error(err)
  }
  loading.value = false
  return data
}

// 展示商户列表
async function openMerchantModal(guild_id) {
  const data = await getMerchantList(guild_id)
  createDialog({
    width: 500,
    footer: null,
    component: () =>
      <div v-if={data.items}>
        <div class="dialog_item_list" v-for={(item, index) in data.items} key={index}>
          {item.merch_name}
        </div>
      </div>
    ,
  })
}

function editItem() {

}

defineExpose({
  editItem,
})
</script>
