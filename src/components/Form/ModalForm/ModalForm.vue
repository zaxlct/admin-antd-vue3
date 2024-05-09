<!-- eslint-disable unused-imports/no-unused-imports -->
<template>
  <slot></slot>
  <slot name="test"></slot>
  <form-create
    v-model:api="fApi"
    v-model="value"
    :option="formCreateOptions"
    :rule
  >
  </form-create>
</template>

<script lang="ts" setup>
import type { DialogExpose } from '@/composables/useDialog'

const value = defineModel()
const props = defineProps({
  modalProps: {
    type: Object,
    default: () => ({
      width: 800,
    }),
  },
  rule: {
    type: Array,
    default: () => [],
  },
  option: {
    type: Object,
    default: () => ({}),
  },
  getData: Function as PropType<(data: any) => Promise<void>>, // 提交时修改数据
  request: Function as PropType<(data: any) => Promise<void>>,
})
const emits = defineEmits(['cancel', 'confirm', 'loading'])

const fApi = ref({})

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
</script>
