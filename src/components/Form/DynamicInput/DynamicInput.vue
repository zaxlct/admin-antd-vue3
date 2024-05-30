<template>
  <a-form-item
    class="mb15"
    v-for="(domain, index) in domains"
    :key="index"
    :label="label + ` ${index + 1}`"
    :name="[name, index]"
    :rules="{
      required: true,
      message: `请输入${label} ${index + 1}`,
      trigger: 'change',
    }"
  >
    <div class="flex_box">
      <a-input
        class="mr10"
        v-model:value="domains[index]"
      />
      <MinusCircleOutlined
        v-if="domains.length > 1"
        class="dynamic-delete-button"
        @click="removeDomain(index)"
      />
    </div>
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
    default: 'domains',
  },
  name: {
    type: String,
    default: 'domains',
  },
})
const domains = defineModel({
  default: () => [],
})
const removeDomain = index => {
  domains.value.splice(index, 1)
}
const addDomain = () => {
  domains.value.push('')
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
