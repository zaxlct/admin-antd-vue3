<template>
  <div class="page_container">
    <a-button
      type="primary"
      @click="addItem"
    >新增</a-button>
    <FormSearch />
    <CustomTable />
  </div>

</template>

<script setup lang="jsx">
import CustomTable from './components/CustomTable.vue'
import FormSearch from './components/FormSearch.vue'

function addItem() {
  console.log('add item')
}
</script>
