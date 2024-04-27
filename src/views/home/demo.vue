<template>
  <div>
    <p>formData: {{ value }}</p>
    <form-create
      :rule="rule"
      v-model:api="fApi"
      :option="options"
      v-model="value"
    >
      <template #type-btns>
        <ACol
          :push="3"
          style="margin-bottom: 20px"
        >
          <AButton @click="changeValue">修改 field1</AButton>
          <AButton
            @click="changeForm"
            style="margin-left: 20px"
          >
            修改表单
          </AButton>
        </ACol>
      </template>
    </form-create>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fApi: {},
      value: { field1: '111', field2: '222', date: '2023-10-23' },
      options: {
        onSubmit: formData => {
          alert(JSON.stringify(formData))
        },
        resetBtn: true,
      },
      rule: [
        { type: 'input', field: 'field1', title: 'field1', value: '' },
        { type: 'input', field: 'field2', title: 'field2', value: '' },
        { type: 'datePicker', field: 'date', title: 'date', value: '' },
        { type: 'btns' },
      ],
    }
  },
  methods: {
    changeValue() {
      this.value.field1 += '-a'
    },
    changeForm() {
      this.value = { field1: '666', field2: '666', date: '2023-09-23' }
    },
  },
}
</script>
