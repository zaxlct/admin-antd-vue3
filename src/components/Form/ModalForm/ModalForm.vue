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
  isEdit: Boolean,
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
  createRequest: Function as PropType<(data: any) => Promise<void>>,
  editRequest: Function as PropType<(data: any) => Promise<void>>,
  listRequest: Function as PropType<() => Promise<void>>,
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
        const params = props.getData ? props.getData(formData) : formData
        emits('loading', true)
        try {
          if (!props.isEdit) {
            props.createRequest && await props.createRequest(params)
            props.listRequest && props.listRequest()
          } else {
            props.editRequest && await props.editRequest(params)
            props.listRequest && props.listRequest()
          }
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
