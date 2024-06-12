<template>
  <a-table
    rowKey="acc_id"
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
import { getMerchantAccountListReq, merchantAccountAddOrEditReq, setMerchantAccountStatusReq } from '@/api/merchant'

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
const { loading, refresh } = useRequest(() => getMerchantAccountListReq({
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
    title: '商户名称',
    dataIndex: 'merch_name',
  },
  {
    title: '登录账号',
    dataIndex: 'acc_name',
  },
  {
    title: '状态',
    dataIndex: 'acc_status',
    customRender: ({ record }) =>
      <a-tag color={record.acc_status === 1 ? 'green' : 'red'}>
        {record.acc_status === 1 ? '启用中' : '已停用'}
      </a-tag>
  },
  {
    title: '操作账号',
    dataIndex: 'oper_info',
    customRender: ({ record }) => <div>{ record.oper_info.name }</div>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button type="link" size="small" onClick={() => editItem(record)}>编辑</a-button>
        <a-popconfirm title='确定停用当前商户后台账号吗？' onConfirm={() => setStatus(record)} v-if={record.acc_status === 1}>
          <a-button type="link" danger size="small">停用</a-button>
        </a-popconfirm>

        <a-popconfirm title='确定启用当前商户后台账号吗？' onConfirm={() => setStatus(record)} v-if={record.acc_status === 2}>
          <a-button type="link" size="small">启用</a-button>
        </a-popconfirm>
      </div>
  }
]

function setStatus(item) {
  loading.value = true
  setMerchantAccountStatusReq(item.merch_id, item.acc_id, { acc_status: item.acc_status === 1 ? 2 : 1 }).then(() => {
    loading.value = false
    item.acc_status = item.acc_status === 1 ? 2 : 1
  }).catch(() => {
    loading.value = false
  })
}

// 推荐主播/修改推荐权重
async function editItem(Item = {}) {
  const formValue = ref({
    acc_id: Item.acc_id,
    merch_id: Item.merch_id,
    acc_name: Item.acc_name,
    password: Item.password,
  })

  const isCreate = !Item.acc_id
  const formModalProps = {
    request: data => merchantAccountAddOrEditReq(isCreate ? null : Item.acc_id, data),
    getData(data) {
      return {
        ...data,
        acc_id: isCreate ? data.acc_id : undefined,
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
        type: 'select',
        field: 'merch_id',
        title: '所属商户',
        value: '',
        options: [],
        effect: {
          required: true,
          fetch: {
            action: '/api/v1/merchant/summary',
            to: 'props.options',
            method: 'get',
            parse: res => res.items.map(item => ({ value: item.merch_id, label: item.merch_name })),
          },
        },
      },
      {
        type: 'input',
        field: 'acc_name',
        title: '登录账号',
        value: '',
        validate: [{ type: 'string', required: true, pattern: '^[A-Za-z][A-Za-z0-9]{4,11}$', message: '登录账号5～12位，字母开头，字母数字组合' }],
      },
      {
        type: 'input',
        field: 'password',
        title: '密码',
        value: '',
        validate: [{ type: 'pattern', required: true, pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,16}$', message: '请输入 8~16位数字和字母组合密码' }],
        props: {
          type: 'password',
          placeholder: '请输入 8~16 位数字和字母组合密码',
        },
      },
    ],
  }

  createDialog({
    title: isCreate ? '添加商户后台账号' : '编辑商户后台账号',
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
