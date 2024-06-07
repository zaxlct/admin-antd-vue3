<template>
  <a-table
    rowKey="notice_id"
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
import { getNoticeListReq, noticeAddOrEditReq, delNoticeReq, getNoticeUserListReq } from '@/api/notice'

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
const { loading, refresh } = useRequest(() => getNoticeListReq({
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
    title: '公告标题',
    dataIndex: 'title',
  },
  {
    title: '公告内容',
    dataIndex: 'content',
  },
  {
    title: '推送系统',
    dataIndex: 'target_os_type',
    customRender: ({ record }) => <div>{ENUM.os_type[record.target_os_type]}</div>
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
    title: '绑定跑马灯',
    dataIndex: 'is_bind_marquee',
    customRender: ({ record }) => <div>{record.is_bind_marquee ? '是' : '否'}</div>
  },
  {
    title: '生效时间',
    dataIndex: 'effect_time',
    customRender: ({ record }) => <div v-if={record.effect_time}>{record.effect_time[0]}-{record.effect_time[1]}</div>
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }) => <a-tag color={record.status === 1 ? 'green' : null}>{record.status === 1 ? '已发送' : '待发送'}</a-tag>
  },
  {
    title: '操作账号',
    dataIndex: 'oper_info',
    customRender: ({ record }) => <div>{record.oper_info?.name}</div>
  },

  {
    title: '数据',
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
        <a-popconfirm title='确定删除当前公告吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delNoticeReq({
    notice_ids: item.notice_id,
  }).then(() => {
    loading.value = false
    pagination.page = 1
    pagination.total = 0
    props.resetSearch()
  }).catch(() => {
    loading.value = false
  })
}

const { richEditorRule } = useRichEditor('公告内容')
const { userRelRule } = useUserSelect()
async function editItem(item = {}) {
  const formValue = ref({
    notice_id: item.notice_id,
    title: item.title,
    content: item.content,
    target_os_type: item.target_os_type,
    target_user_type: item.target_user?.type,
    target_user_list: [],
    is_bind_marquee: item.is_bind_marquee,
    effect_time: item.effect_time ? [dayjs(item.effect_time[0]).format('X'), dayjs(item.effect_time[1]).format('X')] : [],
  })

  const isCreate = !item.notice_id
  if (item.target_user?.type === 4) {
    loading.value = true

    const [err, data] = await to(getNoticeUserListReq(item.notice_id))
    if (err) {
      console.log(err)
      loading.value = false
      return
    }
    formValue.value.target_user_list = data.items.map(item => ({ label: item.nickname, value: item.user_id }))
    loading.value = false
  }

  const formModalProps = {
    request: data => noticeAddOrEditReq(isCreate ? null : item.notice_id, data),
    getData(data) {
      return {
        ...data,
        notice_id: isCreate ? data.notice_id : undefined,
        target_user_list: data.target_user_type === 4 ? data.target_user_list.map(item => item.value) : undefined,
      }
    },
    option: {
      global: {
        '*': {
          wrap: {
            labelCol: { span: 5 },
          },
        },
      },
    },
    rule: [
      {
        type: 'input',
        field: 'title',
        title: '公告标题',
        value: '',
        effect: {
          required: true,
        },
      },
      richEditorRule,
      {
        type: 'radio',
        field: 'target_os_type',
        title: '推送系统',
        value: '',
        options: [
          { label: '全部', value: 0 },
          { label: 'iOS', value: 1 },
          { label: '安卓', value: 2 },
        ],
        effect: {
          required: true,
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
        field: 'is_bind_marquee',
        title: '绑定跑马灯',
        value: '',
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
        effect: {
          required: true,
        },
      },
      {
        type: 'rangePicker',
        field: 'effect_time',
        title: '生效时间',
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
    title: isCreate ? '添加公告' : '编辑公告',
    width: 700,
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
