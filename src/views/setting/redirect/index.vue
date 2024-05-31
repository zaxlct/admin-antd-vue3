<template>
  <a-card title="跳转页面配置">
    <a-spin :spinning="spinning">
      <div style="width: 600px;">
        <form-create
          v-model:api="fApi"
          v-model="value"
          :rule="rule"
          :option="options"
        />
      </div>
    </a-spin>
  </a-card>
</template>

<script setup>
import { getSettingRedirectReq, saveSettingRedirectReq } from '@/api/setting'
const fApi = ref({})
const value = ref({
  group: []
})
const spinning = ref(false)

const options = {
  onSubmit: (formData) => {
    spinning.value = true
    saveSettingRedirectReq(formData.group).then(() => {
      console.log('保存成功')
    }).catch((error) => {
      console.log(error)
    }).finally(() => {
      spinning.value = false
    })
  }
}

onMounted(async () => {
  spinning.value = true
  try {
    value.value.group = await getSettingRedirectReq()
    console.log('value.value', value.value)
  } catch (error) {
    console.log(error)
  } finally {
    spinning.value = false
  }
})


const rule = ref([
  {
    type: 'group',
    field: 'group',
    title: '',
    wrap: {
      extra: '用于后台发送某些内容时可直接选择跳转的页面',
    },
    value: [],
    props: {
      rule: [
        { type: 'input', field: 'name', title: '页面名称', effect: { required: true }},
        { type: 'input', field: 'url', title: '跳转地址', effect: { required: true } },
      ]
    }
  },
])
</script>
