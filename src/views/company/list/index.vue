<template>
  <div class="page_container">
    <a-button
      type="primary"
      @click="openFrom = true"
    >新增</a-button>
    <a-table
      :dataSource
      :columns="columns"
      :loading="tableLoading"
    />
    <a-modal
      v-model:open="openFrom"
      title="编辑公司"
      @ok="submitForm"
    >
      <form-create
        :rule="form.rule"
        v-model:api="form.fApi"
        :option="form.options"
        v-model="form.value"
      >
      </form-create>
    </a-modal>
  </div>
</template>

<script setup lang="jsx">
import request from '@/utils/request'

const tableLoading = ref(false)
const openFrom = ref(false)
const dataSource = ref([])
function getList() {
  tableLoading.value = true
  request.get('https://dev.ruzhi.com/api/company/list').then(res => {
    console.log(res)
    dataSource.value = res
    tableLoading.value = false
  }).catch(err => {
    console.log(err)
    tableLoading.value = false
  })
}

onMounted(async () => {
  getList()
})

const form = reactive({
  fApi: {},
  value: { field1: '111', field2: '222', date: '2023-10-23' },
  options: {
    submitBtn: false,
    resetBtn: false,
  },
  rule: [
    { type: 'input', field: 'field1', title: 'field1', value: '' },
    { type: 'input', field: 'field2', title: 'field2', value: '' },
    { type: 'datePicker', field: 'date', title: 'date', value: '' },
    { type: 'btns' },
  ],
})

const columns = [
  {
    title: 'ID',
    dataIndex: 'company_id',
    key: 'company_id',
  },
  {
    title: '公司名称',
    dataIndex: 'company_name',
    key: 'company_name',
  },
  {
    title: '会员数量',
    dataIndex: 'members_num',
    key: 'members_num',
  },
  {
    title: '更新日期',
    customRender: () => {
      return <a-space>
        <a-popconfirm title="Title" onConfirm={confirm}>
          <a-button size="small" danger>删除</a-button>
        </a-popconfirm>
        <a-button size="small" type="primary">修改</a-button>
      </a-space>
    },
  },
]

function submitForm() {
  form.fApi.submit((formData, fApi) => {
    alert(JSON.stringify(formData))
    console.log(fApi)
  })
}

function reset() {
  form.fApi.resetFields()
}

function confirm() {
  console.log('confirm')
}
</script>