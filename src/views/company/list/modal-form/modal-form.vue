<!-- eslint-disable unused-imports/no-unused-imports -->
<template>
  <a-modal
    v-bind="modalProps"
    v-model:open="open"
    class="model_content__common"
    :title="isEdit ? editTitle : addTitle"
    :confirm-loading="loading"
    @ok="submitForm"
    @cancel="reset"
  >
    <form-create
      v-model:api="fApi"
      v-model="value"
      :option="formCreateOptions"
      :rule
    >
    </form-create>
  </a-modal>
</template>

<script lang="ts" setup>
const open = defineModel('open', { default: false })
const value = defineModel({ default: {} })
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
  addTitle: String,
  editTitle: String,
  getData: Function as PropType<(data: any) => Promise<void>>, // 提交时修改数据
  createRequest: Function as PropType<(data: any) => Promise<void>>,
  editRequest: Function as PropType<(data: any) => Promise<void>>,
  listRequest: Function as PropType<() => Promise<void>>,
})
const loading = ref(false)
const fApi = ref({})

const formCreateOptions = computed(() => {
  const propsFormCreateOptions = props?.option || {}
  return {
    ...propsFormCreateOptions,
    submitBtn: false,
    resetBtn: false,
  }
})

function submitForm() {
  fApi.value.submit((formData) => {
    const params = props.getData ? props.getData(formData) : formData
    loading.value = true
    try {
      if (!props.isEdit) {
        props?.createRequest && props?.createRequest(params).then(() => {
          open.value = false
          props?.listRequest && props?.listRequest()
        })
      } else {
        props?.editRequest && props?.editRequest(params).then(() => {
          open.value = false
          props?.listRequest && props?.listRequest()
        })
      }
      $message.success('操作成功')
      reset()
    } finally {
      loading.value = false
    }
  })
}

function reset() {
  fApi.value.resetFields()
}
</script>