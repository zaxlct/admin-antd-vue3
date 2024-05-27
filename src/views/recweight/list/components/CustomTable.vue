<template>
  <a-table
    rowKey="rec_id"
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
import { debounce } from 'lodash-es'
import mitt from 'mitt'
import dayjs from 'dayjs'
import { getAnchorReweightListReq, recweightAddOrEditReq, getAnchorInfoReq } from '@/api/anchor'
import ENUMS from '@/enums/common'

const props = defineProps({
  recType: {
    type: Number,
    default: 1,
  },
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
const { loading, refresh } = useRequest(() => getAnchorReweightListReq({
  ...props.searchParams,
  rec_type: props.recType,
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
    title: '主播头像',
    dataIndex: 'avatar_url',
    customRender: ({ record }) =>
      <a-avatar src={record.avatar_url} size={40} />
  },
  {
    title: '主播昵称',
    dataIndex: 'nickname',
  },
  {
    title: '主播ID',
    dataIndex: 'anchor_id',
  },
  {
    title: '所属公会',
    dataIndex: 'guild_rel',
    customRender: ({ record }) => <div>{record.guild_rel?.guild_name}%</div>
  },
  {
    title: '推荐权重',
    dataIndex: 'rec_weight',
    customRender: ({ record }) => <div>{record.rec_weight}</div>
  },
  {
    title: '生效时间',
    dataIndex: 'effect_time',
    customRender: ({ record }) => <div v-if={record.effect_time}>{record.effect_time[0]}-{record.effect_time[1]}-</div>
  },
  {
    title: '设置时间',
    dataIndex: 'create_time',
  },
  {
    title: '推荐状态',
    dataIndex: 'rec_status',
    customRender: ({ record }) =>
      <a-tag color={record.rec_status === 1 ? 'green' : 'red'}>
        {ENUMS.recweight_status[record.rec_status]}
      </a-tag>
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <div>
        <a-button type="link" size="small" onClick={() => editItem(record)}>编辑</a-button>
      </div>
  }
]

// 推荐主播/修改推荐权重
async function editItem(Item = {}) {
  const fApi = ref()
  const formValue = ref({
    rec_weight: Item.rec_weight,
    anchor_id: Item.anchor_id?.toString(), // formCreate 不支持 number 类型，所以转为字符串。提交接口时需要转为 number 类型
    nickname: Item.nickname,
    guild_name: Item.guild_rel?.guild_name,
    effect_time: Item.effect_time?.length ? [dayjs(Item.effect_time[0]).format('X'), dayjs(Item.effect_time[1]).format('X')] : [],
  })
  const eventBus = mitt()
  const isCreate = !Item.rec_id
  const currentInfo = ref({})
  const formModalProps = reactive({
    request: data => recweightAddOrEditReq(Item.rec_id || currentInfo.value.rec_id, data),
    getData(data) {
      return {
        rec_id: Item.rec_id || currentInfo.value.rec_id,
        rec_type: props.recType,
        rec_weight: data.rec_weight,
        anchor_id: parseInt(data.anchor_id),
        nickname: data.nickname,
        guild_rel: currentInfo.value.guild_rel,
        effect_time: data.effect_time,
      }
    },
    rule: [
      {
        type: 'input',
        field: 'anchor_id',
        title: '主播ID',
        value: '',
        validate: [
          {
            required: true,
            pattern: '^[0-9]*$',
            message: '请输入主播ID，ID为纯数字组成'
          }
        ],
        props: {
          type: 'digit',
          disabled: !isCreate,
        },
        options: [],
        effect: {
          loadData: {
            attr: 'labelOptions',
            to: 'options'
          },
        },
        on: {
          change: debounce(e => {
            const value = e.target.value.trim()
            eventBus.emit('switchLoading')
            getAnchorInfoReq({ anchor_id: value, rec_type: props.recType }).then(data => {
              if (data?.nickname) {
                currentInfo.value = data // 保存查询的结果
                fApi.value.setValue({
                  nickname: data.nickname,
                  rec_weight: data.rec_weight,
                  effect_time: data.effect_time?.length ? [dayjs(data.effect_time[0]).format('X'), dayjs(data.effect_time[1]).format('X')] : [],
                  guild_name: data.guild_rel?.guild_id ? data.guild_rel.guild_name : '',
                })
                fApi.value.clearValidateState()
              } else {
                $message.error(`ID ${value} 未查到对应主播，请重新输入`)
                formValue.value.nickname = ''
                formValue.value.guild_name = ''
                fApi.value.setValue({
                  nickname: '',
                  guild_name: '',
                })
                currentInfo.value = {}
              }
            }).finally(() => {
              eventBus.emit('switchLoading')
            })
          }, 500),
        },
      },
      {
        type: 'input',
        field: 'nickname',
        title: '主播昵称',
        value: '',
        props: {
          disabled: true,
        },
        effect: {
          required: true,
        }
      },
      {
        type: 'input',
        field: 'guild_name',
        title: '所属公会',
        value: '',
        props: {
          disabled: true,
        },
        effect: {
          required: true,
        }
      },
      {
        type: 'input-number',
        field: 'rec_weight',
        title: '推荐权重',
        value: '',
        props: {
          max: 100,
          min: 0,
          step: 1,
          precision: 0,
        },
        effect: {
          required: true,
        }
      },
      {
        type: 'rangePicker',
        field: 'effect_time',
        title: '推荐时间',
        value: '',
        props: {
          format: 'YYYY-MM-DD',
          valueFormat: 'X',
        },
        effect: {
          required: true,
        }
      },
    ],
  })

  createDialog({
    title: '推荐主播',
    width: 500,
    component:
      <ModalForm
        v-model={formValue.value}
        v-model:fApi={fApi.value}
        {...formModalProps}
        eventBus={eventBus}
      >
      </ModalForm>
    ,
    onConfirm() {
      pagination.page = 1
      pagination.total = 0
      props.resetSearch()
    },
  })
}

defineExpose({
  editItem,
})
</script>
