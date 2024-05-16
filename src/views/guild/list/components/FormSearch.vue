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
              >添加工会</AButton>
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
  guild_name: '',
  status: 0,
  reg_time: 0,
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
    type: 'input',
    field: 'guild_name',
    title: '工会名称',
    value: '',
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
    type: 'select',
    field: 'acct_status',
    title: '账号状态',
    value: '',
    options: Object.keys(ENUM.guild_status).map(key => ({ value: parseInt(key), label: ENUM.guild_status[key] })),
  },

  {
    type: 'input',
    field: 'au_id',
    title: '应用ID/用户ID',
    value: '',
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
