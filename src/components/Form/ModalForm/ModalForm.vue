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
      >
      </form-create>
    </a-config-provider>
  </a-spin>

  <slot name="footer"></slot>
</template>

<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import type { DialogExpose } from '@/composables/useDialog'

const value = defineModel()
const fApi = defineModel('fApi')

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
const emits = defineEmits(['cancel', 'confirm', 'loading', 'update:modelValue', 'update:fApi'])

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
