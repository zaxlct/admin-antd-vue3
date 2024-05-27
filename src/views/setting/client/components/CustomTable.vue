<template>
  <a-table
    rowKey="update_id"
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
import { getClientListReq, clientAddOrEditReq, delClientReq } from '@/api/setting'

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
const { loading, refresh } = useRequest(() => getClientListReq({
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

const clientOS = [
  { label: '安卓', value: 1 },
  { label: 'iOS', value: 2 },
  { label: 'PC', value: 3 },
]
const columns = [
  {
    title: '版本标题',
    dataIndex: 'title',
  },
  {
    title: '版本内容',
    dataIndex: 'content',
  },
  {
    title: '版本号',
    dataIndex: 'version',
  },
  {
    title: '版本端口',
    dataIndex: 'target_os',
    customRender: ({ record }) => <div>{clientOS.find(item => item.value === record.target_os)?.label}</div>
  },
  {
    title: '发布端口',
    dataIndex: 'client_type',
  },
  {
    title: '是否强更',
    dataIndex: 'force_update',
    customRender: ({ record }) => <a-tag color={record.force_update ? 'red' : 'green'}>{record.force_update ? '是' : '否'}</a-tag>
  },
  {
    title: '文件文件',
    dataIndex: 'link',
  },
  {
    title: '发布时间',
    dataIndex: 'publish_time',
  },
  {
    title: '操作账号',
    dataIndex: 'oper_info',
    customRender: ({ record }) => <div>{record.oper_info.name}</div>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button type="link" size="small" onClick={() => editItem(record)}>编辑</a-button>
        <a-popconfirm title='确定删除当前版本吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delClientReq({
    update_ids: item.update_id,
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
  const fApi = ref()
  const formValue = ref({
    update_id: item.update_id,
    client_type: item.client_type,
    title: item.title,
    content: item.content,
    version: item.version,
    target_os: item.target_os,
    force_update: item.force_update,
    target_user_type: item.target_user_type,
    file: item.file,
    link: item.link,
    publish_time: item.publish_time,
  })

  const isCreate = !item.update_id
  const rule = ref([
    {
      type: 'radio',
      field: 'client_type',
      title: '更新端口',
      options: [
        { label: '用户端', value: 1 },
        { label: '主播端', value: 2 },
        { label: 'PC助手', value: 3 },
      ],
      effect: {
        required: true,
      },
      control: [
        {
          handle: val => val === 1,
          append: 'force_update',
          rule: [
            {
              type: 'radio',
              field: 'target_user_type',
              title: '更新用户',
              value: '',
              effect: {
                required: true
              },
              options: [
                { label: '全部用户', value: 1 },
                { label: '贵族用户', value: 2 },
                { label: '充值用户', value: 3 },
              ]
            }
          ]
        },
        {
          handle: val => val !== 3,
          append: 'force_update',
          rule: [
            {
              type: 'radio',
              field: 'target_os',
              title: '版本端口',
              options: clientOS.filter(item => item.value !== 3),
              value: '',
              effect: {
                required: true,
              }
            },
          ],
        }
      ]
    },
    {
      type: 'input',
      field: 'title',
      title: '版本标题',
      value: '',
      effect: {
        required: true,
      }
    },
    {
      type: 'input',
      field: 'content',
      title: '版本内容',
      value: '',
      props: {
        type: 'textarea',
      },
      effect: {
        required: true,
      }
    },
    {
      type: 'input',
      field: 'version',
      title: '版本号',
      value: '',
      effect: {
        required: true,
      }
    },
    {
      type: 'radio',
      field: 'force_update',
      title: '是否强更',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
      effect: {
        required: true,
      }
    },
    {
      type: 'upload',
      field: 'file',
      title: '版本文件',
      props: {
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
      field: 'link',
      title: '下载链接',
      value: '',
      effect: {
        required: true,
      }
    },
    {
      type: 'datePicker',
      field: 'publish_time',
      title: '更新时间',
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
  ])
  const formModalProps = {
    request: data => clientAddOrEditReq(isCreate ? null : item.update_id, data),
    getData(data) {
      return {
        ...data,
        update_id: isCreate ? data.update_id : undefined,
        // 如果是PC助手，则 target_os 只能为 3（PC）
        target_os: data.client_type === 3 ? 3 : data.target_os,
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
  }

  createDialog({
    title: isCreate ? '添加版本' : '编辑版本',
    width: 500,
    component:
      <ModalForm
        v-model={formValue.value}
        v-model:fApi={fApi.value}
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
