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
              class="mr10"
            >查询</AButton>
            <AButton
              class="mr10"
              @click="resetForm"
            >重置</AButton>
            <div class="flex1 flex_end">
              <!-- <AButton
                type="primary"
                class="mr10"
                @click="emit('hieraEdit')"
              >层级设置</AButton> -->
              <AButton
                type="primary"
                @click="emit('addItem')"
              >添加用户</AButton>
            </div>
          </section>
        </template>
      </form-create>
    </div>
  </a-card>
</template>

<script setup>
import merchSelectRule from '@/rules/merchSelectRule'
const params = defineModel()
const data = reactive({
  merch_id: 0,
  app_id: 0,
  acct_status: 0,
  is_bind: 0,
  os_type: 0,
  mu_name: '',
  au_id: '',
  phone: '',
  ip: '',
  email: '',
  hiera: 0,
  is_online: false,
  reg_time: [],
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
  merchSelectRule,
  {
    type: 'select',
    field: 'app_id',
    title: '应用',
    value: '',
    options: [],
    effect: {
      fetch: {
        action: '/api/v1/app/summary',
        to: 'options',
        method: 'get',
        parse: res => [
          { value: 0, label: '所有应用' },
          ...res.items.map(item => ({ value: item.app_id, label: item.app_name })),
        ],
      },
    },
  },
  {
    type: 'select',
    field: 'is_bind',
    title: '绑定用户',
    value: '',
    options: [
      { value: 0, label: '全部' },
      { value: 1, label: '已绑定' },
      { value: 2, label: '未绑定' },
    ],
  },
  {
    type: 'select',
    field: 'acct_status',
    title: '账号状态',
    value: '',
    options: Object.keys(ENUM.user_acct_status).map(key => ({ value: parseInt(key), label: ENUM.user_acct_status[key] })),
  },
  {
    type: 'select',
    field: 'os_type',
    title: '系统',
    value: '',
    options: Object.keys(ENUM.os_type).map(key => ({ value: parseInt(key), label: ENUM.os_type[key] })),
  },
  {
    type: 'input',
    field: 'mu_name',
    title: '商户名称/用户昵称',
    value: '',
    wrap: {
      labelCol: { span: 10 },
    },
  },
  {
    type: 'input',
    field: 'au_id',
    title: '应用ID/用户ID',
    value: '',
  },
  {
    type: 'input',
    field: 'phone',
    title: '手机号',
    value: '',
    props: {
      type: 'tel',
    },
  },
  {
    type: 'input',
    field: 'phone',
    title: 'IP',
    value: '',
  },
  {
    type: 'input',
    field: 'email',
    title: '邮箱',
    value: '',
    props: {
      type: 'email',
    },
  },
  {
    type: 'select',
    field: 'hiera',
    title: '层级',
    value: '',
    options: [],
    effect: {
      fetch: {
        action: '/api/v1/hierarchy/summary',
        to: 'options',
        method: 'get',
        parse: res => [
          { value: 0, label: '所有层级' },
          ...res.items.map(item => ({ value: item.hier_id, label: item.hier_name })),
        ],
      },
    },
  },
  {
    type: 'rangePicker',
    field: 'reg_time',
    title: '时间区间',
    value: '',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'X',
    },
  },
  {
    type: 'switch',
    field: 'is_online',
    title: '只查询在线用户',
    value: '',
    wrap: {
      labelCol: { span: 14 },
    },
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
    reg_time: data.reg_time ? data.reg_time?.join(',') : undefined,
  }
}

defineExpose({
  resetForm,
})
</script>

<style lang="sass scoped">
</style>
