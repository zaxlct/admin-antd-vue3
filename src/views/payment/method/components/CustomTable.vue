<template>
  <a-table
    rowKey="conf_id"
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
import dayjs from 'dayjs'
import { getMarqueeListReq, marqueeAddOrEditReq, delMarqueeReq } from '@/api/marquee'

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
const { loading, refresh } = useRequest(() => getMarqueeListReq({
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
    title: '跑马灯位置',
    dataIndex: 'position',
    customRender: ({ record }) => <div v-if={record.position?.length}>{record.position.map(item => ENUM.marquee_position[item]).join(',')}</div>
  },
  {
    title: '跑马灯内容',
    dataIndex: 'content',
  },
  {
    title: '展示时间',
    dataIndex: 'effect_time',
    customRender: ({ record }) => <div v-if={record.effect_time}>{record.effect_time[0]}-{record.effect_time[1]}</div>
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }) => <div>{record.status === 1 ? '进行中' : '已失效'}</div>
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
        <a-popconfirm title='确定删除当前跑马灯吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delMarqueeReq({
    marquee_ids: [item.marquee_id]
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
    marquee_id: item.marquee_id,
    position: item.position || [],
    content: item.content,
    effect_time: item.effect_time ? [dayjs(item.effect_time[0]).format('X'), dayjs(item.effect_time[1]).format('X')] : [],
  })

  const isCreate = !item.marquee_id
  const formModalProps = {
    request: data => marqueeAddOrEditReq(isCreate ? null : item.marquee_id, data),
    getData(data) {
      return {
        ...data,
        marquee_id: isCreate ? data.marquee_id : undefined,
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
        field: 'content',
        title: '跑马灯内容',
        value: '',
        props: {
          type: 'textarea'
        },
        effect: {
          required: true,
        },
      },
      {
        type: 'checkbox',
        field: 'position',
        title: '跑马灯位置',
        value: [],
        options: Object.keys(ENUM.marquee_position).filter(key => parseInt(key) !== 0).map(key => ({ value: parseInt(key), label: ENUM.marquee_position[key] })),
        effect: {
          required: true,
        },
      },
      {
        type: 'rangePicker',
        field: 'effect_time',
        title: '展示时间',
        value: '',
        effect: {
          required: true
        },
        props: {
          format: 'YYYY-MM-DD',
          valueFormat: 'X',
          disabledDate: (current) => {
            return current && current < dayjs().endOf('day')
          },
        }
      }
    ],
  }

  createDialog({
    title: isCreate ? '添加跑马灯' : '编辑跑马灯',
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
