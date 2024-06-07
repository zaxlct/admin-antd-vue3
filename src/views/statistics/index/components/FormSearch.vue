<template>
  <a-card class="mb15 w1174">
    <div class="__table_form_search_component">
      <form-create
        v-model:api="fApi"
        v-model="data"
        :option
        :rule
      >
        <template #type-btns>
          <section>
            <AButton
              @click="submitForm"
              type="primary"
              class="mr10"
            >查询</AButton>
            <AButton
              class="mr10"
              @click="resetForm"
            >重置</AButton>
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
  merch_id: '',
  merch_name: '',
  os_type: 0,
  time_range: [],
  data_type: 0,
})

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
    type: 'input',
    field: 'merch_name',
    title: '商户名称',
    value: '',
  },
  merchSelectRule,
  {
    type: 'select',
    field: 'os_type',
    title: '系统',
    value: '',
    options: Object.keys(ENUM.os_type).map(key => ({ value: parseInt(key), label: ENUM.os_type[key] })),
  },
  {
    type: 'rangePicker',
    field: 'time_range',
    title: '时间区间',
    value: '',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'X',
    },
  },
  {
    type: 'radio',
    field: 'data_type',
    value: '',
    options: [
      { value: 0, label: '全部数据(默认当日数据，可切换查看统计总数据)' },
      { value: 1, label: '仅看平台数据' },
    ],
    col: {
      span: 24
    },
    wrap: {
      labelCol: { span: 4 },
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
    time_range: data.time_range ? data.time_range?.join(',') : undefined,
  }
}

defineExpose({
  resetForm,
})
</script>

<style lang="sass scoped">
</style>
