<template>
  <a-table
    rowKey="role_id"
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
import { getRoleListReq, roleAddOrEditReq, delRoleReq } from '@/api/role'

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
const { loading, refresh } = useRequest(() => getRoleListReq({
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
    title: '角色名称',
    dataIndex: 'role_name',
  },
  {
    title: '角色类型',
    dataIndex: 'role_type',
    customRender: ({ record }) => <div>{ENUM.role_type[record.role_type]}</div>
  },
  {
    title: '引用账号数',
    dataIndex: 'acct_ref_count',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
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
        <a-popconfirm title='确定删除当前角色吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" disabled={record.acct_ref_count} danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delRoleReq({
    role_ids: [item.role_id]
  }).then(() => {
    loading.value = false
    pagination.page = 1
    pagination.total = 0
    props.resetSearch()
  }).catch(() => {
    loading.value = false
  })
}

async function editItem(userItem = {}) {
  const formValue = ref({
    role_id: userItem.role_id,
    role_name: userItem.role_name,
    role_price: userItem.role_price,
    role_icon: userItem.role_icon,
    role_anim: userItem.role_anim,
    role_type: userItem.role_type,
    is_featured_role: userItem.is_featured_role,
    remark: userItem.remark,
    role_status: userItem.role_status,
  })

  const isCreate = !userItem.role_id
  const formModalProps = {
    request: data => roleAddOrEditReq(isCreate ? null : userItem.role_id, data),
    getData(data) {
      return {
        ...data,
        role_id: isCreate ? data.role_id : undefined,
      }
    },
    rule: [
      {
        type: 'upload',
        field: 'role_icon',
        title: '礼物图标',
        props: {
          listType: "picture-card",
          action: 'https://jsonplaceholder.typicode.com/posts/',
          onSuccess(file) {
            file.url = file.response.url || 'http://form-create.com/logo.png'
          },
        },
        value: [],
        effect: {
          required: true,
        }
      },
      {
        type: 'input',
        field: 'role_name',
        title: '礼物名称',
        value: '',
        validate: [{ type: 'string', max: 10, required: true, message: '礼物名称最多10个字'}],
      },
      {
        type: 'input-number',
        field: 'role_price',
        title: '礼物价值',
        value: '',
        props: {
          max: 100000,
          min: 0,
          step: 1,
          precision: 0,
        },
        effect: {
          required: true,
        }
      },
      {
        type: 'input',
        field: 'role_anim',
        title: '动画文件',
        value: '',
        props: {
          placeholder: '请输入外部链接',
        },
        effect: {
          required: true,
        }
      },
      {
        type: 'select',
        field: 'role_type',
        title: '礼物类型',
        value: '',
        options: Object.keys(ENUM.role_type).map(key => ({ value: parseInt(key), label: ENUM.role_type[key] })),
        effect: {
          required: true,
        },
      },
      {
        type: 'radio',
        field: 'is_featured_role',
        title: '精选礼物',
        value: '',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
        effect: {
          required: true,
        },
      },
      {
        type: 'input',
        field: 'remark',
        title: '备注',
        value: '',
        props: {
          type: 'textarea'
        },
      },
    ],
  }

  createDialog({
    title: isCreate ? '添加礼物' : '编辑礼物',
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
