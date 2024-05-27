<!-- eslint-disable unused-imports/no-unused-imports -->
<template>
  <slot></slot>
  <a-spin :spinning="loading">
    <a-config-provider :locale="zhCN">
      <form-create
        v-model:api="fApi"
        v-model="value"
        :option="formCreateOptions"
        :rule
        @mounted="onFormMounted"
      >
      </form-create>
    </a-config-provider>
  </a-spin>

  <slot name="footer"></slot>
</template>

<script lang="ts" setup>
import { type Api } from '@form-create/ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import type { DialogExpose } from '@/composables/useDialog'

const value = defineModel()
const loading = ref(false)
const props = defineProps({
  rule: {
    type: Array,
    default: () => [],
  },
  option: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  getData: Function as PropType<(data: any) => Promise<void>>, // 提交时修改数据
  request: Function as PropType<(data: any) => Promise<void>>,
  eventBus: Object,
})
const emits = defineEmits(['cancel', 'confirm', 'loading'])

const fApi = ref({})

// 在组件挂载时通过 provide 将变量暴露出去
const expose = inject<(variables: { fApi: Api | null }) => void>('expose', () => { })
function onFormMounted(api) {
  expose({
    fApi: api
  })
}

const formCreateOptions = computed(() => {
  const propsFormCreateOptions = props?.option || {}
  return {
    ...propsFormCreateOptions,
    submitBtn: false,
    resetBtn: false,
  }
})

defineExpose<DialogExpose>({
  submit() {
    return new Promise((resolve, reject) => {
      fApi.value.submit(async formData => {
        console.log('formData', formData)
        const params = props.getData ? props.getData(formData) : formData
        emits('loading', true)
        try {
          props.request && await props.request(params)
          fApi.value.resetFields()
          resolve(true)
        } catch (error) {
          console.error('error', error)
          reject(error)
        } finally {
          emits('loading', false)
        }
      })
    })
  },
})

function fApiHandleCallBack(callback: any) {
  callback(fApi.value)
}

function switchLoading() {
  loading.value = !loading.value
}

onMounted(() => {
  if (props.eventBus?.on) {
    props.eventBus.on('fApiHandle', fApiHandleCallBack)
    props.eventBus.on('switchLoading', switchLoading)
  }
})

onUnmounted(() => {
  if (props.eventBus?.on) {
    props.eventBus.off('fApiHandle', fApiHandleCallBack)
    props.eventBus.off('switchLoading', switchLoading)
  }
})
</script>
