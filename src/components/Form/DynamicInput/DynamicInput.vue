<template>
  <a-form-item
    v-for="(domain, index) in domains"
    :key="domain.key"
    :label="label + ` ${index + 1}`"
    :name="[name, index, 'value']"
    :rules="{
      required: true,
      message: `请输入${label} ${index + 1}`,
      trigger: 'change',
    }"
  >
    <a-input
      v-model:value="domain.value"
      style="width: 60%; margin-right: 8px"
    />
    <MinusCircleOutlined
      v-if="domains.length > 1"
      class="dynamic-delete-button"
      @click="removeDomain(domain)"
    />
  </a-form-item>
  <a-form-item>
    <a-button
      type="dashed"
      @click="addDomain"
    >
      <PlusOutlined />
      添加{{ label }}
    </a-button>
  </a-form-item>
</template>
<script setup>
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
defineProps({
  label: {
    type: String,
    default: 'Domains',
  },
  name: {
    type: String,
    default: 'Domains',
  },
})
const domains = defineModel({
  default: () => [],
})
const removeDomain = item => {
  const index = domains.value.indexOf(item)
  if (index !== -1) {
    domains.value.splice(index, 1)
  }
}
const addDomain = () => {
  domains.value.push({
    value: '',
    key: Date.now(),
  })
}
</script>
<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
