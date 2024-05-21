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
          <section
            class="flex mb15"
            style="width: 100%;"
          >
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
                @click="emit('addItem')"
              >添加公告</AButton>
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
  title: '',
  status: 0,
  marquee_status: 0,
  create_time: [],
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
    type: 'input',
    field: 'title',
    title: '公告标题',
    value: '',
  },
  {
    type: 'select',
    field: 'status',
    title: '公告状态',
    value: '',
    options: [
      { label: '全部', value: 0 },
      { label: '已发送', value: 1 },
      { label: '待发送', value: 2 },
    ],
  },
  {
    type: 'select',
    field: 'marquee_status',
    title: '绑定跑马灯',
    value: '',
    options: [
      { label: '全部', value: 0 },
      { label: '已绑定', value: 1 },
      { label: '未绑定', value: 2 },
    ],
    wrap: {
      labelCol: { span: 10 },
    },
  },
  {
    type: 'rangePicker',
    field: 'create_time',
    title: '创建时间',
    value: '',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'X',
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
    create_time: data.create_time ? data.create_time?.join(',') : undefined,
  }
}

defineExpose({
  resetForm,
})
</script>

<style lang="sass scoped">
</style>
