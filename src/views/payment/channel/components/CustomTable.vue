<template>
  <a-table
    rowKey="chan_id"
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
import { getSmsChannelConfigListReq, smsChannelAddOrEditReq, delSmsChannelReq } from '@/api/sms'

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
const { loading, refresh } = useRequest(() => getSmsChannelConfigListReq({
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
    title: '渠道ID',
    dataIndex: 'chan_id',
  },
  {
    title: '渠道名称',
    dataIndex: 'chan_name',
  },
  {
    title: '支持区域',
    dataIndex: 'supp_area',
    customRender: ({ record }) => <div>{record.supp_area.map(item => ENUM.sms_supp_area[item]).join('、')}</div>
  },
  {
    title: '短信渠道',
    dataIndex: 'target_os_type',
    customRender: ({ record }) => <div>{ENUM.sms_chan_type[record.sms_chan_type]}</div>
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
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }) => <a-tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '启用中' : '已停用'}</a-tag>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button  type="link" size="small" onClick={() => editItem(record)}>编辑</a-button>
        <a-popconfirm title='确定删除当前渠道吗？' onConfirm={() => delItem(record)}>
          <a-button type="link" danger size="small">删除</a-button>
        </a-popconfirm>
      </div>
  }
]

function delItem(item) {
  loading.value = true
  delSmsChannelReq(item.conf_id).then(() => {
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
    chan_id: item.chan_id,
    chan_name: item.chan_name,
    supp_area: item.supp_area || [],
    sms_chan_type: item.sms_chan_type || [],
    acc_key: item.acc_key,
    acc_secret: item.acc_secret,
    status: item.status,
  })

  const isCreate = !item.chan_id

  const formModalProps = {
    request: data => smsChannelAddOrEditReq(isCreate ? null : item.chan_id, data),
    getData(data) {
      return {
        ...data,
        chan_id: isCreate ? data.chan_id : undefined,
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
        field: 'chan_name',
        title: '渠道名称',
        value: '',
        effect: {
          required: true,
        },
      },
      {
        type: 'checkbox',
        field: 'supp_area',
        title: '支持区域',
        value: [],
        options: Object.keys(ENUM.sms_supp_area).filter(key => parseInt(key) !== 0).map(key => ({ value: parseInt(key), label: ENUM.sms_supp_area[key] })),
        effect: {
          required: true,
        },
      },
      {
        type: 'radio',
        field: 'sms_chan_type',
        title: '短信渠道',
        options: Object.keys(ENUM.sms_chan_type).filter(key => parseInt(key) !== 0).map(key => ({ value: parseInt(key), label: ENUM.sms_chan_type[key] })),
        value: '',
        effect: {
          required: true,
        },
      },
      {
        type: 'input',
        field: 'acc_key',
        title: 'AccessKey ID',
        value: '',
        effect: {
          required: true,
        },
      },
      {
        type: 'input',
        field: 'acc_secret',
        title: 'AccessKey Secret',
        value: '',
        effect: {
          required: true,
        },
      },
      {
        type: 'radio',
        field: 'status',
        title: '状态',
        options: [
          { value: 1, label: '启用' },
          { value: 2, label: '停用' },
        ],
        value: '',
        effect: {
          required: true,
        },
      },
    ],
  }

  createDialog({
    title: isCreate ? '添加渠道' : '编辑渠道',
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
