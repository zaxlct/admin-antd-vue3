<template>
  <div class="number_range">
    <a-input-number
      v-model:value="rangeValue[0]"
      :min="0"
      :max="9999"
      :step="1"
      :precision="0"
      @change="smallChange"
    />
    <span class="split">-</span>
    <a-input-number
      v-model:value="rangeValue[1]"
      :min="rangeValue[0] + 1"
      :max="999999999"
      :step="1"
      :precision="0"
      @change="bigChange"
    />
  </div>
</template>

<script setup>
const props = defineProps({
})

const rangeValue = defineModel({ default: [] })

function smallChange(val) {
  if (val > rangeValue.value[1]) {
    rangeValue.value[1] = val + 1
  }
}

function bigChange(val) {
  if (val < rangeValue.value[0]) {
    rangeValue.value[0] = val - 1
  }
}
</script>

<style lang="sass" scoped>
.number_range
  display: inline-flex
  align-items: center

  .split
    margin-left: 3px
    margin-right: 3px
    color: #999
    font-size: 14px
</style>
