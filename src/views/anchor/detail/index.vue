<template>
  <a-card title="主播详情">
    <form-create
      v-model:api="fApi"
      v-model="value"
      :option="formCreateOptions"
      :rule
    >
    </form-create>
  </a-card>
</template>

<script setup lang="jsx">
import useAnchorRule from '@/views/anchor/list/hooks/useAnchorRule'

const anchorRule = useAnchorRule()
const fApi = ref(null)
const rule = ref([
  ...anchorRule,
])
const formCreateOptions = {
  submitBtn: false,
  resetBtn: false,
}

</script>
