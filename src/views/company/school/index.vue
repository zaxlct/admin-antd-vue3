<template>
  <div class="page_container">
    <FormSearch
      @addItem="addItem"
      @hieraEdit="hieraEdit"
      @search="search"
    />
    <CustomTable
      ref="customTableRef"
    />
  </div>

</template>

<script setup lang="jsx">
import CustomTable from './components/CustomTable.vue'
import FormSearch from './components/FormSearch.vue'

const customTableRef = ref(null)

function addItem() {
  customTableRef.value.editUser()
}
function hieraEdit() {
  customTableRef.value.hieraEdit()
}
function search(data) {
  customTableRef.value.search(data)
}
</script>
