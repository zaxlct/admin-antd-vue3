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
import { getMerchantListReq, getGuildListReq } from '@/api/public'
import MultipleSelect from '@/components/Form/MultipleSelect/MultipleSelect.vue'
import ENUMS from '@/enums/common'

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
    customRender: ({ record }) =>
      <a-tag color={record.acct_status === 1 ? undefined : 'red'}>
        { ENUMS.acct_status[record.acct_status]}
      </a-tag>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button disabled={record.acct_status !== 1} type="link" size="small" onClick={() => editItem(record)}>编辑</a-button>
        <a-button type="link" size="small" onClick={() => editItem(record)}>数据</a-button>

        <a-popconfirm title='确定拉黑吗？' onConfirm={() => blockUser(record)} v-if={record.acct_status === 1}>
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

  let guildList = []
  getGuildListReq().then(res => {
    guildList = res.items
    formCreate.setData('labelOptions', res.items.map(item => ({ value: item.guild_id, label: item.guild_name })))
  })

  const formModalProps = reactive({
    request: data => anchorAddOrEditReq(null, data),
    rule: [
      {
        type: 'upload',
        field: 'avatar_url',
        title: '主播头像',
        props: {
          listType: "picture-card",
          action: 'https://jsonplaceholder.typicode.com/posts/',
          onSuccess(file) {
            file.url = file.response.url || 'http://form-create.com/logo.png'
          },
        },
        value: []
      },
      {
        type: 'input',
        field: 'nickname',
        title: '用户昵称',
        value: '',
        validate: [{ type: 'string', max: 10, required: true, message: '用户昵称最多10个字'}],
      },
      {
        type: 'input',
        field: 'phone',
        title: '手机号',
        value: '',
        validate: [{ type: 'string', message: '请输入正确的手机号', required: true }],
        props: {
          type: 'tel',
        },
      },
      {
        type: 'input',
        field: 'email',
        title: '邮箱',
        value: '',
        validate: [{ type: 'email', message: '请输入正确的邮箱' }],
        props: {
          type: 'email'
        },
      },
      {
        type: 'select',
        field: 'guild_id',
        title: '所属公会',
        value: '',
        options: [],
        props: {
          allowClear: true,
        },
        effect: {
          loadData: {
            attr: 'labelOptions',
            to: 'options'
          },
        },
        update(val, rule, api) {
          if (val) {
            // 选择公会后，默认跟随公会分成比例
            api.getRule('ps_ratio').value = guildList.find(item => item.guild_id === val).ps_ratio
            api.getRule('ps_ratio').props.disabled = true
          } else {
            api.getRule('ps_ratio').props.disabled = false
          }
        }
      },
      {
        type: 'input-number',
        field: 'ps_ratio',
        title: '分成比例',
        value: '',
        props: {
          formatter: value => `${value}%`,
          max: 100,
          min: 0,
          step: 1,
          precision: 0,
        },
        wrap: {
          help: '选择公会后，默认跟随公会分成比例',
        },
      },
      {
        type: 'input-number',
        field: 'hourly_rate',
        title: '主播时薪',
        value: '',
        props: {
          min: 0,
          step: 1,
          precision: 0,
        },
        wrap: {
          help: '仅做直播时长薪资计算，和分成无关',
        },
      },
      {
        type: 'input-number',
        field: 'hourly_rate_ulimit',
        title: '时薪上限',
        value: '',
        props: {
          step: 1,
          precision: 0,
        },
        wrap: {
          help: '按小时计算，直播每日可活动时薪的小时上限',
        },
      },
      {
        type: 'input',
        field: 'password',
        title: '登录密码',
        value: '',
        validate: [{ type: 'pattern', required: true, pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,16}$', message: '请输入 8~16位数字和字母组合密码' }],
        props: {
          type: 'password',
          placeholder: '请输入 8~16 位数字和字母组合密码',
        },
      },
      {
        type: 'MultipleSelect',
        field: 'merch_id',
        title: '展示商户',
        value: '',
        options: [],
        props: {
        },
        effect: {
          fetch: {
            action: '/api/v1/merchant/summary',
            to: 'props.options',
            method: 'get',
            parse: res => [
              { value: '*', label: '所有商户' },
              ...res.items.map(item => ({ value: item.merch_id, label: item.merch_name })),
            ],
          },
        },
      },
    ],
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

onBeforeMount(() => {
  formCreate.component('MultipleSelect', MultipleSelect)
})
</script>
