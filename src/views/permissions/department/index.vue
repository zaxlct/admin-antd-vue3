<template>
  <div class="page_container">
    <FormSearch
      ref="formSearchRef"
      v-model="searchParams"
      @addItem="() => customTableRef.editItem()"
    />
    <CustomTable
      ref="customTableRef"
      :searchParams="searchParams"
      :resetSearch="() => formSearchRef.resetForm()"
    />
  </div>

</template>

<script setup lang="jsx">
import CustomTable from './components/CustomTable.vue'
import FormSearch from './components/FormSearch.vue'

const customTableRef = ref(null)
const formSearchRef = ref(null)
const searchParams = ref({})
</script>
