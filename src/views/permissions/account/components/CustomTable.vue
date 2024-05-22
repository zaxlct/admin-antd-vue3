<template>
  <a-table
    rowKey="acct_id"
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
import { getAccountListReq, accountAddOrEditReq, delAccountReq, genSecretKeyReq } from '@/api/permission'

const props = defineProps({
  searchParams: {
    type: Object,
    default: () => ({}),
  },
  resetSearch: {
    type: Function,
    default: () => ({}),
  },
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})
const dataSource = ref([])
const { loading, refresh } = useRequest(() => getAccountListReq({
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
    title: '账号名称',
    dataIndex: 'acct_name',
  },
  {
    title: '所属部门',
    dataIndex: 'dept_name',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '秘钥',
    dataIndex: 'secret_key',
  },
  {
    title: '登录IP',
    dataIndex: 'bind_ip',
  },
  {
    title: '所属角色',
    dataIndex: 'role_name',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  },
  {
    title: '操作账号',
    dataIndex: 'dept_name',
  },
  {
    title: '操作账号',
    dataIndex: 'oper_info',
    customRender: ({ record }) => <div>{record.oper_info?.name}</div>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button type="link" size="small" onClick={() => editItem(record)}>编辑</a-button>
        <a-popconfirm title='确定删除当前账号吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delAccountReq({
    acct_ids: item.acct_id,
  }).then(() => {
    loading.value = false
    pagination.page = 1
    pagination.total = 0
    props.resetSearch()
  }).catch(() => {
    loading.value = false
  })
}

async function editItem(item = {}) {
  const formValue = ref({
    acct_id: item.acct_id,
    acct_name: item.acct_name,
    role_id: item.role_id,
    dept_id: item.dept_id,
    acct_type: item.acct_type,
    phone: item.phone,
    secret_key: item.secret_key,
    bind_ip: item.bind_ip,
    password: item.password,
  })
  const isCreate = !item.acct_id

  const rule = ref([
    {
      type: 'input',
      field: 'acct_name',
      title: '账号名称',
      value: '',
      effect: {
        required: true,
      },
    },
    {
      type: 'select',
      field: 'acct_id',
      title: '选择角色',
      value: '',
      effect: {
        required: true,
        fetch: {
          action: '/api/v1/permission/role/summary',
          to: 'options',
          data: {
            page: 1,
            limit: 99999,
          },
          method: 'get',
          parse: res => res.items.map(item => ({ value: item.role_id, label: item.role_name })),
        },
      },
    },
    {
      type: 'select',
      field: 'dept_id',
      title: '选择部门',
      value: '',
      effect: {
        fetch: {
          action: '/api/v1/permission/department/summary',
          to: 'options',
          data: {
            page: 1,
            limit: 99999,
          },
          method: 'get',
          parse: res => res.items.map(item => ({ value: item.dept_id, label: item.dept_name })),
        },
      },
    },
    {
      type: 'radio',
      field: 'acct_type',
      title: '设为负责人',
      value: 2,
      options: [
        { label: '设为负责人', value: 1 },
        { label: '普通成员', value: 2 },
      ],
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
      field: 'secret_key',
      title: '绑定秘钥',
      value: '',
      wrap: {
        help: '绑定秘钥后，通过身份验证器获得登录密码'
      },
      effect: {
        required: true,
      },
      props: {
        disabled: true,
      },
      children: [
        {
          type: 'a-button',
          slot: 'suffix',
          children: [
            '生成秘钥'
          ],
          props: {
            type: 'link',
            size: 'small',
            onClick: () => {
              genSecretKeyReq().then(res => {
                formValue.value.secret_key = res.secret_key
              })
            },
          },
        },
      ]
    },
    {
      type: 'input',
      field: 'bind_ip',
      title: '登录IP',
      value: '',
      wrap: {
        help: '当前账号除登录IP外，其他IP地址不可登录后台'
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
  ])
  const formModalProps = {
    request: data => accountAddOrEditReq(isCreate ? null : item.acct_id, data),
    option: {
      global: {
        '*': {
          wrap: {
            labelCol: { span: 6 },
          },
        },
      },
    },
    getData(data) {
      return {
        ...data,
        acct_type: (data.dept_id && !data.acct_type) ? 2 : data.acct_type, // 选择部门后，默认设为负责人默认为普通成员
        acct_id: isCreate ? data.acct_id : undefined,
      }
    },
  }

  createDialog({
    title: isCreate ? '添加账号' : '编辑账号',
    width: 500,
    component:
      <ModalForm
        v-model={formValue.value}
        {...formModalProps}
        rule={rule.value}
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
