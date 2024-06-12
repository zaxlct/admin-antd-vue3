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
import { getGuildListReq, guildAddOrEditReq, guildRescindReq, guildRenewalReq } from '@/api/guilds'
import MerchCell from '@/components/Business/MerchCell.jsx'
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
const {
  merchRelRule
} = useMerchantMultipleSelect()
const { loading, refresh } = useRequest(() => getGuildListReq({
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

const {
  customRender,
  getMerchantList,
} = MerchCell(loading)
const columns = [
  {
    title: '工会来源',
    dataIndex: 'source_name',
  },
  customRender,
  {
    title: '工会名称',
    dataIndex: 'guild_name',
  },
  {
    title: '负责人',
    dataIndex: 'supv_name',
  },
  {
    title: '主播数量',
    dataIndex: 'anchor_count',
  },
  {
    title: '月钻石收益/余额',
    dataIndex: 'month_diamond_stat',
    customRender: ({ record }) =>
      <div v-if={record.month_diamond_stat}>
        {record.month_diamond_stat.earnings}/{record.month_diamond_stat.balance}
      </div>
  },
  {
    title: '总钻石收益/余额',
    dataIndex: 'month_diamond_stat',
    customRender: ({ record }) =>
      <div v-if={record.total_diamond_stat}>
        {record.total_diamond_stat.earnings}/{record.total_diamond_stat.balance}
      </div>
  },
  {
    title: '基础分成',
    dataIndex: 'basic_ps',
    customRender: ({ record }) =>
      <div>
        {record.basic_ps}%
      </div>
  },
  {
    title: '入驻时间',
    dataIndex: 'join_time',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }) =>
      <div>
        {ENUM.guild_status[record.status]}
      </div>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button type="link" size="small" onClick={() => editItem(record)}>编辑工会</a-button>
        <a-popconfirm title='确定解约吗？' onConfirm={() => openRescindModal(record)} v-if={record.status === 1}>
          <a-button type="link" danger size="small">解约</a-button>
        </a-popconfirm>

        <a-popconfirm title='确定续约吗？' onConfirm={() => openRenewalModal(record)} v-if={record.status === 2}>
          <a-button type="link" size="small">续约</a-button>
        </a-popconfirm>
      </div>
  }
]

// 工会解约
function openRescindModal(item) {
  loading.value = true
  guildRescindReq({ guild_ids: [item.guild_id] }).then(() => {
    loading.value = false
    item.status = 2
  }).catch(() => {
    loading.value = false
  })
}

// 工会续约
function openRenewalModal(item) {
  loading.value = true
  guildRenewalReq({ guild_ids: [item.guild_id] }).then(() => {
    loading.value = false
    item.status = 1
  }).catch(() => {
    loading.value = false
  })
}

// 添加/编辑用户
async function editItem(Item = {}) {
  let merch_rel = []
  if (Item?.merch_rel?.is_all) {
    merch_rel = ['*']
  } else if (Item?.merch_rel?.count && Item.guild_id) {
    const data = await getMerchantList(Item.guild_id)
    merch_rel = data.items.map(item => item.merch_id)
  }
  const formValue = ref({
    guild_name: Item.guild_name,
    supv_name: Item.supv_name,
    basic_ps: Item.basic_ps,
    merch_rel,
  })

  const isCreate = !Item.guild_id
  const formModalProps = {
    request: data => guildAddOrEditReq(Item.guild_id, data),
    getData(data) {
      return {
        ...data,
        merch_rel: data.merch_rel.includes('*') ? [] : data.merch_rel,
      }
    },
    option: {
      global: {
        '*': {
          wrap: {
            labelCol: { span: 6 },
          },
        },
      },
    },
    rule: [
      {
        type: 'input',
        field: 'guild_name',
        title: '工会名称',
        value: '',
        validate: [{ type: 'string', max: 15, required: true, message: '名称必填，最多15个字'}],
      },
      {
        type: 'input',
        field: 'supv_name',
        title: '负责人姓名',
        value: '',
        validate: [{ type: 'string', max: 15, required: true, message: '姓名必填，最多10个字' }],
      },
      {
        type: 'input-number',
        field: 'basic_ps',
        title: '分成比例',
        value: '',
        props: {
          formatter: value => `${value}%`,
          max: 100,
          min: 0,
          step: 1,
          precision: 0,
        },
      },
      merchRelRule,
    ],
  }

  createDialog({
    title: isCreate ? '添加商户' : '编辑商户',
    width: 500,
    component:
      <ModalForm
        v-model={formValue.value}
        {...formModalProps}
      />
    ,
    onConfirm() {
      if (isCreate) {
        pagination.page = 1
        pagination.total = 0
        props.resetSearch()
      } else {
        refresh()
      }
    },
  })
}

defineExpose({
  editItem,
})
</script>
