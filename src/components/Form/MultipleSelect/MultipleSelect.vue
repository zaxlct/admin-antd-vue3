<template>
  <a-select
    v-model:value="ids"
    :options="options"
    mode="multiple"
    @select="onSelected"
  />
</template>

<script setup>
defineProps({
  options: Array,
})
const ids = defineModel({ default: [] })

function onSelected(value) {
  nextTick(() => {
    // * 代表全部
    if (value === '*') {
      ids.value = ['*']
    } else {
      if (ids.value.includes('*')) {
        ids.value = ids.value.filter(id => id !== '*')
        ids.value.push(value)
      }
    }
  })
}
</script>
