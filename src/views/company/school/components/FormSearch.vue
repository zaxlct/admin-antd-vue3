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
            <AButton
              type="primary"
              class="mr10"
              @click="emit('hieraEdit')"
            >层级设置</AButton>
            <AButton
              type="primary"
              class="mr10"
              @click="emit('addItem')"
            >添加用户</AButton>
          </div>
        </template>
      </form-create>
    </div>
  </a-card>
</template>

<script setup>
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
  reg_time: '',
})

const emit = defineEmits(['addItem', 'hieraEdit'])
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
    field: 'merch_id',
    title: '商户',
    value: '',
    options: [
      { value: 0, label: '所有商户' },
      { value: 1, label: '商户1' },
      { value: 2, label: '商户2' },
    ],
  },
  {
    type: 'select',
    field: 'app_id',
    title: '应用',
    value: '',
    options: [
      { value: 0, label: '所有应用' },
      { value: 1, label: '应用1' },
      { value: 2, label: '应用2' },
    ],
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
    options: [
      { value: 0, label: '全部' },
      { value: 1, label: '正常' },
      { value: 2, label: '拉黑' },
      { value: 3, label: '禁言' },
    ],
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
    options: [
      { value: 0, label: '所有层级' },
      { value: 1, label: '层级A' },
      { value: 2, label: '层级B' },
    ],
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
}

function submitForm() {
  fApi.value.submit(formData => {
    console.log('formData', formData)
  })
}
</script>

<style lang="sass scoped">
</style>
