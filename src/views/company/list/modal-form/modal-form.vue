<!-- eslint-disable unused-imports/no-unused-imports -->
<template>
<a-modal
  v-bind="modelProps"
  v-model:open="open"
  class="model_content__common"
  :title="inStateOne ? addTitle : editTitle"
  :confirm-loading="loading"
  @ok="submitForm"
>
  <form-create
    v-model:api="form.fApi"
    v-model="form.value"
    :option="formCreateOptions"
    :rule
  >
  </form-create>
</a-modal>
</template>

<script lang="ts" setup>
const open = defineModel('open', { default: false })
const props = defineProps({
  modelProps: Object,
  rule: Array, // form-create rule
  option: Object, // form-create option
  addTitle: String,
  editTitle: String,
  getData: Function as PropType<(data: any) => Promise<void>>, // 提交时修改数据
  setData: Function as PropType<(data: any) => Promise<void>>, // 编辑时修改数据
  createRequest: Function as PropType<(data: any) => Promise<void>>,
  editRequest: Function as PropType<(data: any) => Promise<void>>,
  listRequest: Function as PropType<() => Promise<void>>,
})
const inStateOne = ref(true) // 编辑: false；新增: true;
const loading = ref(false)
const form = reactive({
  fApi: {},
  value: {
    company_id: undefined,
    company_type: 'COMPANY',
    company_name: '',
    company_industry_dict_id: undefined,
    company_size_dict_id: undefined,
    company_location: '',
    company_founded_date: '',
    company_website: '',
    company_introduce: '',
    company_email: '',
    company_tags: '',
    company_industry: '',
  },
})

const formCreateOptions = computed(() => {
  const propsFormCreateOptions = props?.option || {}
  return {
    ...propsFormCreateOptions,
    submitBtn: false,
    resetBtn: false,
  }

})

function submitForm() {
  form.fApi.submit((formData) => {
    const params = props.getData ? props.getData(formData) : formData
    loading.value = true
    try {
      if (inStateOne.value) {
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

    } finally {
      loading.value = false
    }
  })
}

function reset() {
  form.fApi.resetFields()
}
</script>

<style scoped lang="sass">
.page_container

</style>
