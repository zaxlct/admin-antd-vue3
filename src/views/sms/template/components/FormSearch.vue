<template>
  <a-card class="mb15">
    <div class="__table_form_search_component">
      <div class="inset_wrap">
        <span>跑马灯状态：</span>
        <a-switch
          v-model:checked="isOpen"
          @change="changeOpenStatus"
          :loading="loading"
          :checkedValue="1"
          :unCheckedValue="2"
          checked-children="开"
          un-checked-children="关"
        />
      </div>
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
              >添加跑马灯</AButton>
            </div>
          </section>
        </template>
      </form-create>
    </div>
  </a-card>
</template>

<script setup>
import { getMarqueeStatusReq, setMarqueeStatusReq } from '@/api/marquee'

const params = defineModel()
const data = reactive({
  status: 0,
  position: 0,
  create_time: [],
})
const isOpen = ref(true)

const loading = ref(false)
onMounted(async () => {
  loading.value = true
  const { status } = await getMarqueeStatusReq().catch(() => loading.value = false)
  isOpen.value = status
  loading.value = false
})

function changeOpenStatus(status) {
  loading.value = true
  setMarqueeStatusReq({ status }).then(() => {
    loading.value = false
  }).catch(() => loading.value = false)
}

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
    field: 'position',
    title: '跑马灯位置',
    value: '',
    options: Object.keys(ENUM.marquee_position).map(key => ({ value: parseInt(key), label: ENUM.marquee_position[key] })),
    wrap: {
      labelCol: { span: 9 },
    },
  },
  {
    type: 'select',
    field: 'status',
    title: '状态',
    value: '',
    options: [
      { label: '全部', value: 0 },
      { label: '进行中', value: 1 },
      { label: '已失效', value: 2 },
    ],
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
