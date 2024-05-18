<template>
  <a-card class="mb15">
    <div class="__table_form_search_component">
      <form-create
        v-model:api="fApi"
        v-model="data"
        :option
        :rule
      >
        <template #type-btns>
          <section class="flex mb15" style="width: 100%;">
            <AButton
              @click="submitForm"
              type="primary"
            >查询</AButton>
            <AButton
              class="ml10"
              @click="resetForm"
            >重置</AButton>
            <div class="flex1 flex_end">
              <AButton
                type="primary"
                @click="emit('addItem')"
              >添加主播</AButton>
            </div>
          </section>
        </template>
      </form-create>
    </div>
  </a-card>
</template>

<script setup>
const params = defineModel()
const data = reactive({
  source_id: 0,
  acct: '',
  nickname: '',
  live_status: 0,
  acct_status: 0,
  join_time: [],
})

const emit = defineEmits(['addItem', 'search'])
const fApi = ref({})
const option = {
  resetBtn: false,
  submitBtn: false,
  global: {
    '*': {
      col: {
        show: false,
      },
      wrap: {
        labelCol: { span: 8 },
      },
    },
  },
}

const rule = ref([
  {
    type: 'select',
    field: 'source_id',
    title: '来源',
    value: '',
    options: [],
    effect: {
      fetch: {
        action: '/api/v1/source/summary',
        to: 'options',
        method: 'get',
        parse: res => [
          { value: 0, label: '所有来源' },
          ...res.items.map(item => ({ value: item.source_id, label: item.source_name })),
        ],
      },
    },
  },
  {
    type: 'input',
    field: 'acct',
    title: '房间号/手机号/邮箱',
    value: '',
    wrap: {
      labelCol: { span: 10 },
    },
  },
  {
    type: 'input',
    field: 'nickname',
    title: '主播昵称',
    value: '',
  },
  {
    type: 'rangePicker',
    field: 'join_time',
    title: '时间区间',
    value: '',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'X',
    },
  },
  {
    type: 'select',
    field: 'live_status',
    title: '直播状态',
    value: '',
    options: Object.keys(ENUM.guild_status).map(key => ({ value: parseInt(key), label: ENUM.guild_status[key] })),
  },
  {
    type: 'select',
    field: 'acct_status',
    title: '账号状态',
    value: '',
    options: Object.keys(ENUM.anchor_acct_status).map(key => ({ value: parseInt(key), label: ENUM.anchor_acct_status[key] })),
  },
  { type: 'btns' },
])

function resetForm() {
  fApi.value.resetFields()
  getData(data)
}

function submitForm() {
  fApi.value.submit(formData => {
    getData(formData)
  })
}

function getData(data) {
  params.value = {
    ...data,
    join_time: data.join_time ? data.join_time?.join(',') : undefined,
  }
}

defineExpose({
  resetForm,
})
</script>

<style lang="sass scoped">
</style>
