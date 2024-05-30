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
  isParent: { // 是否为一级分类
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['changeTab'])
const router = useRouter()

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})
const dataSource = ref([])
const { loading, refresh } = useRequest(() => {
  // 一级分类 parentId 传递 null
  const {
    parentId,
    ...params
  } = props.searchParams
  return getLiveCategoryListReq(props.isParent ? null : parentId, {
    ...params,
    page: pagination.page,
    limit: pagination.limit,
    level: props.isParent ? 1 : 2,
  })
}, {
  refreshDeps: true,
  onSuccess(data) {
    dataSource.value = data.items
    pagination.total = data.total_data
  },
})

function change2SecondLevel(parentId) {
  router.replace({
    query: {
      parentId,
    },
  }).then(() => {
    // 切换到二级分类，并且要等待路由切换完成，否则parentId参数无法再 fApi 中生效
    emit('changeTab')
  })
}

const { createDialog } = useDialog()

const columns = ref([
  {
    title: '分类名称',
    dataIndex: 'name',
  },
  {
    title: props.isParent ? '二级分类数量' : '所属一级分类',
    dataIndex: props.isParent ? 'child_count' : 'parent_name',
    customRender: ({ record }) => <div>
      <a-button onClick={() => change2SecondLevel(record.category_id)} type="link" size="small" v-if={props.isParent}>{ record.child_count }</a-button>
      <span v-else>{record.parent_name }</span>
    </div>
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
])

function delItem(item) {
  loading.value = true
  delLiveCategoryReq({
    category_ids: item.category_id,
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
    parent_id: item.parent_id,
  })

  const isCreate = !item.category_id
  const formModalProps = {
    request: data => liveCategoryAddOrEditReq(isCreate ? null : item.category_id, data),
    getData(data) {
      return {
        name: data.name.trim(),
        index: data.index,
        category_id: isCreate ? data.category_id : undefined,
        parent_id: props.isParent ? null : data.parent_id,
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

  if (!props.isParent) {
    loading.value = true
    const [err, data = {}] = await to(getLiveCategoryListReq(null, { page: 1, limit: 99 }))
    if (err) {
      console.log(err)
      loading.value = false
      return
    }
    loading.value = false
    formModalProps.rule.push({
      type: 'select',
      field: 'parent_id',
      title: '所属一级分类',
      value: '',
      options: data.items.map(item => ({ label: item.name, value: item.category_id })),
      effect: {
        required: true,
      }
    })
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
