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
import { convertToTree } from '@/utils/index'
import { getRoleListReq, roleAddOrEditReq, delRoleReq, getPermissionListReq } from '@/api/permission'
const VITE_GUILD_PERMISSION = import.meta.env.VITE_GUILD_PERMISSION
const VITE_DEPARTMENT_PERMISSION = import.meta.env.VITE_DEPARTMENT_PERMISSION

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

async function editItem(item = {}) {
  loading.value = true
  const [err, data] = await to(getPermissionListReq())
  if (err) {
    console.log(err)
    loading.value = false
    return
  }
  loading.value = false
  const treeData = convertToTree({ data: data.items })

  const formValue = ref({
    role_id: item.role_id,
    role_name: item.role_name,
    role_type: item.role_type,
    role_perms: item.role_perms || [],
    role_perms2: [1, 2], // 公会账号的值，写死即可
    role_perms3: [1], //机构账号的值，写死即可
  })

  const isCreate = !item.role_id
  const formModalProps = {
    request: data => roleAddOrEditReq(isCreate ? null : item.role_id, data),
    getData(data) {
      const {
        role_id,
        role_name,
        role_type,
        role_perms,
      } = data
      // role_perms2 和 role_perms3压根用不到，作用仅仅是让checkbox选中，因为不能更改
      // 提交的数据如果不是role_type为1的话，role_perms2和role_perms3都是写死的
      return {
        role_id,
        role_name,
        role_type,
        role_perms: role_type === 1 ? role_perms : role_type === 2 ? VITE_GUILD_PERMISSION.split(',') : VITE_DEPARTMENT_PERMISSION.split(',')
      }
    },
    rule: [
      {
        type: 'input',
        field: 'role_name',
        title: '角色名称',
        value: '',
        validate: [{ type: 'string', max: 10, required: true, message: '角色名称最多10个字'}],
      },
      {
        type: 'radio',
        field: 'role_type',
        title: '角色类型',
        value: '',
        options: Object.keys(ENUM.role_type).filter(key => parseInt(key) !== 0).map(key => ({ value: parseInt(key), label: ENUM.role_type[key] })),
        effect: {
          required: true,
        },
        control: [
          {
            handle: val => val === 1,
            append: 'role_type',
            rule: [
              {
                type: 'tree-select',
                field: 'role_perms',
                title: '角色权限',
                value: '',
                effect: {
                  required: true,
                },
                props: {
                  treeData,
                  fieldNames: { key: 'id', value: 'id' },
                  multiple: true,
                  allowClear: true,
                  treeDefaultExpandAll: true,
                  treeCheckable: true,
                }
              },
            ]
          },
          {
            handle: val => val === 2,
            append: 'role_type',
            rule: [
              {
                type: 'checkbox',
                field: 'role_perms2',
                title: '角色权限',
                value: '',
                effect: {
                  required: true,
                },
                options: [
                  {
                    label: '主播管理',
                    value: 1
                  },
                  {
                    label: '直播管理',
                    value: 2
                  },
                ],
                props: {
                  disabled: true,
                }
              },
            ]
          },
          {
            handle: val => val === 3,
            append: 'role_type',
            rule: [
              {
                type: 'checkbox',
                field: 'role_perms3',
                title: '角色权限',
                value: '',
                effect: {
                  required: true,
                },
                options: [
                  {
                    label: '人脸管理',
                    value: 1
                  },
                ],
                props: {
                  disabled: true,
                }
              },
            ]
          },
        ]
      },
    ],
  }

  createDialog({
    title: isCreate ? '添加角色' : '编辑角色',
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
