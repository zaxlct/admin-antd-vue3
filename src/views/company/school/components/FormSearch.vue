<template>
  <div class="__table_form_search_component">
    <form-create
      v-model:api="fApi"
      v-model="value"
      :option
      :rule
    >
    </form-create>
  </div>
</template>

<script setup>
const fApi = ref({})
const option = {
  submitBtn: false,
  resetBtn: false,
}

const value = reactive({

})


const rule = [
  {
    type: 'select',
    field: 'plat_type',
    title: '平台',
    value: '',
    options: [
      { value: 1, label: '全部平台' },
      { value: 2, label: '当前平台' },
      { value: 3, label: '商户平台' },
    ],
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
      // colon: false,
    },
  },
  {
    type: 'select',
    field: 'app_type',
    title: '应用',
    value: '',
    options: [
      { value: 1, label: '全部平台' },
      { value: 2, label: '当前平台' },
      { value: 3, label: '商户平台' },
    ],
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
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
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
    },
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
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
    },
  },
  {
    type: 'select',
    field: 'os_type',
    title: '系统',
    value: '',
    options: Object.keys(ENUM.os_type).map(key => ({ value: parseInt(key), label: ENUM.os_type[key] })),
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
    },
  },
  {
    type: 'input',
    field: 'mu_name',
    title: '商户名称/用户昵称',
    value: '',
    col: {
      span: 5
    },
    wrap: {
      labelCol: { span: 10 },
    },
  },
  {
    type: 'input',
    field: 'au_id',
    title: '应用ID/用户ID',
    value: '',
    col: {
      span: 5
    },
    wrap: {
      labelCol: { span: 8 },
    },
  },
  {
    type: 'input',
    field: 'phone',
    title: '手机号',
    value: '',
    props: {
      type: 'tel',
    },
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
    },
  },
  {
    type: 'input',
    field: 'phone',
    title: 'IP',
    value: '',
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
    },
  },
  {
    type: 'input',
    field: 'email',
    title: '邮箱',
    value: '',
    props: {
      type: 'email',
    },
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
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
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
    },
  },
  {
    type: 'datePicker',
    field: 'reg_time',
    title: '时间区间',
    value: '',
    props: {
    },
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
    },
  },
  {
    type: 'checkbox',
    field: 'reg_time',
    title: '在线用户',
    value: '',
    col: {
      span: 4
    },
    wrap: {
      labelCol: { span: 8 },
    },
  },
]
</script>
