<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
const props = defineProps<{
  text: string
}>()

const { text } = toRefs(props)
const { copy, copied, isSupported } = useClipboard({ source: text, legacy: true })

function onCopy() {
  if (!isSupported.value) {
    $message.error('您的浏览器不支持自动复制功能，请手动复制')
    return
  }
  copy(text.value)
}

watch(copied, (newVal) => {
  if (newVal) {
    $message.success('复制成功')
  }
})
</script>

<template>
  <a-button
    @click="onCopy"
    type="link"
    size="small"
  >
    <span class="fz12">复制</span>
  </a-button>
</template>
