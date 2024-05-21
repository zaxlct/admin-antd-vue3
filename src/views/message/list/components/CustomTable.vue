<template>
  <a-table
    rowKey="msg_id"
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
import { getMessageListReq, messageAddOrEditReq, delMessageReq } from '@/api/message'

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
const { loading, refresh } = useRequest(() => getMessageListReq({
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
    title: '推送方式',
    dataIndex: 'push_type',
    customRender: ({ record }) => <div>{ENUM.push_type[record.push_type]}</div>
  },
  {
    title: '消息标题',
    dataIndex: 'title',
  },
  {
    title: '消息内容',
    dataIndex: 'content',
  },
  {
    title: '消息封面',
    dataIndex: 'msg_cover',
    customRender: ({ record }) => <img v-if={record.msg_cover} src={record.msg_cover} width="50" height="50" />
  },
  {
    title: '推送用户',
    dataIndex: 'target_user',
    customRender: ({ record }) => <div v-if={record.target_user}>
      <span v-if={record.target_user.type !== 4}>{ENUM.push_user_type[record.target_user.type]}</span>
      <span v-if={record.target_user.type === 4}>{record.target_user.count || 0}位</span>
    </div>
  },
  {
    title: '跳转方式',
    dataIndex: 'redirect_conf',
    customRender: ({ record }) => <div>{record.redirect_conf?.type === 1 ? '跳转地址' : '跳转页面'}</div>
  },
  {
    title: '跳转地址',
    dataIndex: 'redirect_conf_url',
    customRender: ({ record }) => <div>{record.redirect_conf?.url}</div>
  },
  {
    title: '发送时间',
    dataIndex: 'push_time',
    customRender: ({ record }) => <div>{record.push_time}</div>
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  },
  {
    title: '状态',
    dataIndex: 'message_type',
    customRender: ({ record }) => <a-tag color={record.status === 1 ? 'green' : null}>{record.status === 1 ? '已发送' : '待发送'}</a-tag>
  },
  {
    title: '操作账号',
    dataIndex: 'oper_info',
    customRender: ({ record }) => <div>{record.oper_info?.name}</div>
  },
  {
    title: '推送数/点击数/点击率',
    dataIndex: 'stat_data',
    customRender: ({ record }) => <div>{record.stat_data?.pushes_count || 0}/{record.stat_data?.clicks_count || 0 }/{record.stat_data?.click_through_rate || 0}%</div>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button disabled={record.status === 1} type="link" size="small" onClick={() => editItem(record)}>编辑</a-button>
        <a-popconfirm title='确定删除当前消息吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delMessageReq({
    message_ids: item.msg_id,
  }).then(() => {
    loading.value = false
    pagination.page = 1
    pagination.total = 0
    props.resetSearch()
  }).catch(() => {
    loading.value = false
  })
}

const { userRelRule } = useUserSelect()
async function editItem(item = {}) {
  const formValue = ref({
    msg_id: item.msg_id,
    push_type: item.push_type,
    title: item.title,
    content: item.content,
    msg_cover: item.msg_cover,
    target_user_type: item.target_user?.type,
    target_user_list: [], // TODO:
    redirect_type: item.redirect_conf?.type,
    redirect_url: item.redirect_conf?.url,
    push_time: item.push_time ? dayjs(item.push_time).format('X') : null,
  })

  const isCreate = !item.msg_id
  const formModalProps = {
    request: data => messageAddOrEditReq(isCreate ? null : item.msg_id, data),
    getData(data) {
      return {
        ...data,
        msg_id: isCreate ? data.msg_id : undefined,
        target_user_list: data.target_user_type === 4 ? data.target_user_list.map(item => item.value) : undefined,
      }
    },
    rule: [
      {
        type: 'radio',
        field: 'push_type',
        title: '推送方式',
        value: '',
        options: [
          { label: '站内信', value: 1 },
          { label: '推送消息', value: 2 },
        ],
        effect: {
          required: true,
        },
      },
      {
        type: 'input',
        field: 'title',
        title: '消息标题',
        value: '',
        effect: {
          required: true,
        },
      },
      {
        type: 'upload',
        field: 'msg_cover',
        title: '消息封面',
        props: {
          listType: "picture-card",
          action: 'https://jsonplaceholder.typicode.com/posts/',
          onSuccess(file) {
            file.url = file.response.url || 'http://form-create.com/logo.png'
          },
        },
        value: [],
        effect: {
          // required: true,
        }
      },
      {
        type: 'input',
        field: 'content',
        title: '消息内容',
        value: '',
        props: {
          type: 'textarea'
        },
      },
      {
        type: 'radio',
        field: 'target_user_type',
        title: '推送用户',
        value: '',
        options: Object.keys(ENUM.push_user_type).map(key => ({ value: parseInt(key), label: ENUM.push_user_type[key] })),
        effect: {
          required: true,
        },
        control: [
          {
            handle: val => val === 4,
            append: 'target_user_type',
            rule: [ userRelRule ]
          }
        ]
      },
      {
        type: 'radio',
        field: 'redirect_type',
        title: '跳转方式',
        value: '',
        options: [
          { label: '跳转地址', value: 1 },
          { label: '跳转页面', value: 2 },
        ],
        effect: {
          required: true,
        },
      },
      {
        type: 'input',
        field: 'redirect_url',
        title: '跳转地址',
        value: '',
        effect: {
          required: true,
        },
      },
      {
        type: 'datePicker',
        field: 'push_time',
        title: '发送时间',
        value: '',
        effect: {
          required: true
        },
        props: {
          showTime: { defaultValue: dayjs('00:00:00', 'HH:mm:ss') },
          disabledDate: (current) => {
            return current && current < dayjs().endOf('day')
          },
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'X',
        }
      }
    ],
  }

  createDialog({
    title: isCreate ? '添加消息' : '编辑消息',
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
