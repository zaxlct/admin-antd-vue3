<template>
  <div class="page_container">
    <FormSearch
      v-model="searchParams"
      @addItem="addItem"
      @hieraEdit="hieraEdit"
    />
    <CustomTable
      ref="customTableRef"
      :searchParams="searchParams"
    />
  </div>

</template>

<script setup lang="jsx">
import CustomTable from './components/CustomTable.vue'
import FormSearch from './components/FormSearch.vue'

const customTableRef = ref(null)
const searchParams = ref({})

function addItem() {
  customTableRef.value.editItem()
}
function hieraEdit() {
  customTableRef.value.hieraEdit()
}

</script>
