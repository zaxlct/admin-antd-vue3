<template>
  <h1>compnay -school</h1>
</template>

<script setup>
import request from '@/utils/request'

onMounted(() => {
  request.get('/api/v1/users').then(res => {
    console.log(res)
  })
})
</script>
