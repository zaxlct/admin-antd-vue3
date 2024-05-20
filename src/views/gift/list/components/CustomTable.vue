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
import { getGiftListReq, giftAddOrEditReq, delGiftReq } from '@/api/gift'

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
const { loading, refresh } = useRequest(() => getGiftListReq({
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
    title: '礼物ID',
    dataIndex: 'gift_id',
  },
  {
    title: '礼物图标',
    dataIndex: 'gift_icon',
    customRender: ({ record }) => <img src={record.gift_icon} width="50" height="50" />
  },
  {
    title: '礼物名称',
    dataIndex: 'gift_name',
  },
  {
    title: '礼物价值',
    dataIndex: 'gift_price',
  },
  {
    title: '动画文件',
    dataIndex: 'gift_anim',
  },
  {
    title: '礼物类型',
    dataIndex: 'gift_type',
    customRender: ({ record }) => <div>{ENUM.gift_type[record.gift_type]}</div>
  },
  {
    title: '精选礼物',
    dataIndex: 'is_featured_gift',
    customRender: ({ record }) => <div>{record.is_featured_gift ? '是' : '否'}</div>
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button type="link" size="small" onClick={() => editItem(record)}>编辑</a-button>
        <a-popconfirm title='确定删除当前礼物吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delGiftReq({
    gift_ids: [item.gift_id]
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
    gift_id: userItem.gift_id,
    gift_label: userItem.gift_label,
    gift_price: userItem.gift_price,
    gift_icon: userItem.gift_icon,
    gift_anim: userItem.gift_anim,
    gift_type: userItem.gift_type,
    is_featured_gift: userItem.is_featured_gift,
    remark: userItem.remark,
    gift_status: userItem.gift_status,
  })

  const isCreate = !userItem.gift_id
  const formModalProps = {
    request: data => giftAddOrEditReq(isCreate ? null : userItem.gift_id, data),
    getData(data) {
      return {
        ...data,
        gift_id: isCreate ? data.gift_id : undefined,
      }
    },
    rule: [
      {
        type: 'upload',
        field: 'gift_icon',
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
        field: 'gift_name',
        title: '礼物名称',
        value: '',
        validate: [{ type: 'string', max: 10, required: true, message: '礼物名称最多10个字'}],
      },
      {
        type: 'input-number',
        field: 'gift_price',
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
        field: 'gift_anim',
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
        field: 'gift_type',
        title: '礼物类型',
        value: '',
        options: Object.keys(ENUM.gift_type).map(key => ({ value: parseInt(key), label: ENUM.gift_type[key] })),
        effect: {
          required: true,
        },
      },
      {
        type: 'radio',
        field: 'is_featured_gift',
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
