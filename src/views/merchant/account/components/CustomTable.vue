<template>
  <a-table
    rowKey="merch_id"
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
import { getMerchantListReq, merchantAddOrEditReq, setMerchantStatusReq } from '@/api/merchant'

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
const { loading, refresh } = useRequest(() => getMerchantListReq({
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
    title: '商户负责人',
    dataIndex: 'supv_name',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }) =>
      <a-tag color={record.status === 1 ? 'green' : 'red'}>
        {record.status === 1 ? '启用中' : '已停用'}
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
        <a-popconfirm title='确定停用当前商户吗？' onConfirm={() => setStatus(record)} v-if={record.status === 1}>
          <a-button type="link" danger size="small">停用</a-button>
        </a-popconfirm>

        <a-popconfirm title='确定启用当前商户吗？' onConfirm={() => setStatus(record)} v-if={record.status === 2}>
          <a-button type="link" size="small">启用</a-button>
        </a-popconfirm>
      </div>
  }
]

// 商户启用/停用
function setStatus(item) {
  loading.value = true
  setMerchantStatusReq(item.merch_id, { status: item.status === 1 ? 2 : 1 }).then(() => {
    loading.value = false
    item.status = item.status === 1 ? 2 : 1
  }).catch(() => {
    loading.value = false
  })
}

// 推荐主播/修改推荐权重
async function editItem(userItem = {}) {
  const formValue = ref({
    merch_id: userItem.merch_id,
    merch_name: userItem.merch_name,
    supv_name: userItem.supv_name,
    phone: userItem.phone,
    password: userItem.password,
  })

  const isCreate = !userItem.merch_id
  const formModalProps = {
    request: data => merchantAddOrEditReq(isCreate ? null : userItem.merch_id, data),
    getData(data) {
      return {
        ...data,
        // 如果是修改商户，body 里 merch_id 传 null，merch_id 放到 url path中。反之，创建用户，merch_id 放到 body 中
        merch_id: isCreate ? data.merch_id : undefined,
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
        field: 'merch_name',
        title: '商户名称',
        value: '',
        validate: [{ type: 'string', max: 10, required: true, message: '商户名称最多10个字'}],
      },
      {
        type: 'input',
        field: 'supv_name',
        title: '商户负责人',
        value: '',
        validate: [{ type: 'string', max: 10, required: true, message: '商户负责人姓名最多10个字' }],
      },
      {
        type: 'input',
        field: 'phone',
        title: '手机号',
        value: '',
        validate: [{ type: 'string', message: '请输入正确的手机号' }],
        props: {
          type: 'tel'
        },
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
