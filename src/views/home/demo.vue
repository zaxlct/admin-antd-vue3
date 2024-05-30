<template>
  <div>
    <a-form
      ref="formRef"
      name="dynamic_form_item"
      :model="dynamicValidateForm"
      v-bind="formItemLayoutWithOutLabel"
    >
      <DynamicInput
        v-model="dynamicValidateForm.official_website_url"
        name="official_website_url"
        label="地址配置"
      />
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button
          type="primary"
          html-type="submit"
          @click="submitForm"
        >Submit</a-button>
        <a-button
          style="margin-left: 10px"
          @click="resetForm"
        >Reset</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
const formRef = ref()
const dynamicValidateForm = reactive({
  official_website_url: [''],
})
const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log('values', dynamicValidateForm.official_website_url)
    })
    .catch(error => {
      console.log('error', error)
    })
}
const resetForm = () => {
  formRef.value.resetFields()
}
</script>
