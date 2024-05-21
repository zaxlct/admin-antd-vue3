<template>
  <a-table
    rowKey="anchor_id"
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
import { getAnchorListReq, anchorAddOrEditReq, setAnchorBlackReq } from '@/api/anchor'
import ENUMS from '@/enums/common'
import blockUserRule from '@/rules/blockUserRule'
import MerchCell from '@/components/Business/MerchCell.jsx'
import useAnchorRule from '../hooks/useAnchorRule'
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

const router = useRouter()
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})
const anchorRule = useAnchorRule()
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

const { customRender } = MerchCell(loading)

const columns = [
  customRender,
  {
    title: '主播来源',
    dataIndex: 'source_name',
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
    customRender: ({ record }) =>
    <div>
        <a-tag color="green" v-if={record.live_status === 1}>直播中</a-tag>
        <a-tag v-if={record.live_status === 2}>未开播</a-tag>
        <a-tag v-else>--</a-tag>
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
    customRender: ({ record }) =>
      <a-tag color={record.acct_status === 1 ? undefined : 'red'}>
        {ENUMS.anchor_acct_status[record.acct_status]}
      </a-tag>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button disabled={record.acct_status !== 1} type="link" size="small" onClick={() => router.push('/anchor/detail?anchor_id=' + record.anchor_id)}>编辑</a-button>
        <a-button type="link" size="small" onClick={() => editItem(record)}>数据</a-button>
        <a-button type="link" size="small" onClick={() => blockUser(record)} v-if={record.acct_status === 1}>拉黑</a-button>
      </div>
  }
]

// 拉黑
function blockUser(userItem) {
  const formValue = ref({
    anchor_id: userItem.anchor_id,
    block_type: '',
    ageing_type: '',
    end_time: '',
    reason: '',
  })

  const formModalProps = {
    request: setAnchorBlackReq,
    getData(data) {
      const { anchor_id, ...params } = data
      return {
        ...params,
        anchor_ids: [anchor_id],
      }
    },

    rule: [
      {
        type: 'input',
        field: 'anchor_id',
        value: userItem.anchor_id,
        hidden: true,
      },
      ...blockUserRule,
    ],
  }

  createDialog({
    title: '拉黑',
    width: 500,
    component:
      <ModalForm
        v-model={formValue.value}
        {...formModalProps}
      />,
    onConfirm(status) {
      if (status) {
        const current = dataSource.value.find(item => item.anchor_id === userItem.anchor_id)
        if (current) {
          current.acct_status = 2
        }
      }
    },
  })
}

// 添加主播，不可编辑
async function editItem() {
  const formValue = ref({
    avatar_url: '',
    nickname: '',
    phone: '',
    email: '',
    guild_id: '',
    ps_ratio: '',
    hourly_rate: '',
    hourly_rate_ulimit: '',
    password: '',
    merch_id: [],
  })

  const formModalProps = reactive({
    request: data => anchorAddOrEditReq(null, data),
    rule: anchorRule,
  })

  createDialog({
    title: '添加主播',
    width: 500,
    component:
      <ModalForm
        v-model={formValue.value}
        {...formModalProps}
      >
      </ModalForm>
    ,
    onConfirm() {
      pagination.page = 1
      pagination.total = 0
      props.resetSearch()
    },
  })
}

defineExpose({
  editItem,
})
</script>
