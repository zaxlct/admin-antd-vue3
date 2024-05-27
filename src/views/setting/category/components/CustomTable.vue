<template>
  <a-table
    rowKey="category_id"
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
import { getLiveCategoryListReq, liveCategoryAddOrEditReq, delLiveCategoryReq } from '@/api/setting'

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
const { loading, refresh } = useRequest(() => getLiveCategoryListReq(null, {
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
    title: '分类名称',
    dataIndex: 'name',
  },
  {
    title: '二级分类数量',
    dataIndex: 'child_count',
  },
  {
    title: '排序',
    dataIndex: 'index',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
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
        <a-popconfirm title='确定删除当前分类吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delLiveCategoryReq({
    // TODO:
    // parent_id: item.parent_id,
    category_ids: item.notice_id,
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
    category_id: item.category_id,
    name: item.name,
    index: item.index,
  })

  const isCreate = !item.category_id
  const formModalProps = {
    request: data => liveCategoryAddOrEditReq(isCreate ? null : item.category_id, data),
    getData(data) {
      return {
        ...data,
        category_id: isCreate ? data.category_id : undefined,
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
        field: 'name',
        title: '分类名称',
        value: '',
        validate: [{ type: 'string', max: 10, required: true, message: '分类名称最多10个字'}],
      },
      {
        type: 'input-number',
        field: 'index',
        title: '分类排序',
        value: '',
        props: {
          max: 99,
          min: 0,
          step: 1,
          precision: 0,
        },
        effect: {
          required: true,
        }
      },
    ],
  }

  createDialog({
    title: isCreate ? '添加分类' : '编辑分类',
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
