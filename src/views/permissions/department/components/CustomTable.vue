<template>
  <a-table
    rowKey="dept_id"
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
import { getDepartmentListReq, departmentAddOrEditReq, delDepartmentReq } from '@/api/permission'

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
const { loading, refresh } = useRequest(() => getDepartmentListReq({
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
    title: '部门名称',
    dataIndex: 'dept_name',
  },
  {
    title: '部门负责人',
    dataIndex: 'dept_head_list',
    customRender: ({ record }) => <div v-if={record.dept_head_list.length}>
      <span v-for={item in record.dept_head_list}>{item.name}</span>
    </div>
  },
  {
    title: '部门成员数',
    dataIndex: 'dept_mem_count',
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
        <a-popconfirm title='确定删除当前部门吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delDepartmentReq({
    dept_ids: item.dept_id,
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
    dept_id: item.dept_id,
    dept_name: item.dept_name,
    dept_head_list: item.dept_head_list ? item.dept_head_list.map(item => item.acct_id) : [],
  })

  const isCreate = !item.dept_id

  const formModalProps = {
    request: data => departmentAddOrEditReq(isCreate ? null : item.dept_id, data),
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
        dept_id: isCreate ? data.dept_id : undefined,
      }
    },
    rule: [
      {
        type: 'input',
        field: 'dept_name',
        title: '部门名称',
        value: '',
        effect: {
          required: true,
        },
      },
      {
        type: 'select',
        field: 'dept_head_list',
        title: '部门负责人',
        value: [],
        props: {
          mode: 'multiple',
          showSearch: true,
          filterOption: (input, option) => option.label.includes(input)
        },
        effect: {
          required: true,
          fetch: {
            action: '/api/v1/permission/account',
            to: 'options',
            data: {
              page: 1,
              role_type: 0,
              limit: 99999,
            },
            method: 'get',
            parse: res => res.items.map(item => ({ value: item.acct_id, label: item.acct_name })),
          },
        },
      },
    ],
  }

  createDialog({
    title: isCreate ? '添加部门' : '编辑部门',
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
