<template>
  <slot></slot>
  <slot name="test"></slot>
  <AForm
    :rules="rules"
    :model="formData"
    ref="formRef"
  >
    <AFormItem
      name="name"
      :label="label"
    >
      <AInput
        v-if="!textarea"
        v-model:value="formData.name"
      />
      <ATextarea
        v-else
        v-model:value="formData.name"
      />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import type { DialogExpose } from '@/composables/useDialog'
import type { FormInstance, FormProps } from 'ant-design-vue'

const { title = '', label, request, defaultValue } = defineProps<{
  title?: string
  label?: string
  defaultValue?: string
  textarea?: boolean
  request?: () => Promise<any>
}>()
const formData = reactive({
  name: defaultValue || '',
})
const rules: FormProps['rules'] = {
  name: [
    {
      required: true,
      message: '请输入' + label,
    },
  ],
}
const emits = defineEmits(['cancel', 'confirm', 'loading'])
const formRef = ref<FormInstance>()
defineExpose<DialogExpose>({
  async submit() {
    return formRef.value?.validate().then(async () => {
      emits('loading', true)
      try {
        if (request) {
          await request(formData.name)
        }
        formRef.value?.resetFields()
        return Promise.resolve(formData.name)
      } catch (error) {
        return Promise.resolve(false)
      } finally {
        emits('loading', false)
      }
    })
  },
})
</script>
