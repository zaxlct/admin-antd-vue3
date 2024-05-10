<template>
  <div class="page_container">
    <FormSearch
      v-model="searchParams"
      @addItem="addItem"
      @hieraEdit="hieraEdit"
    />
    <CustomTable
      ref="customTableRef"
      :searchParams
    />
  </div>

</template>

<script setup lang="jsx">
import CustomTable from './components/CustomTable.vue'
import FormSearch from './components/FormSearch.vue'

const searchParams = reactive({
  plat_type: 0,
  app_type: 0,
  acct_status: 0,
  is_bind: 0,
  os_type: 0,
  mu_name: '',
  au_id: '',
  phone: '',
  ip: '',
  email: '',
  hiera: '',
  is_online: '',
  reg_time: 0,
})

const customTableRef = ref(null)

function addItem() {
  customTableRef.value.editUser()
}
function hieraEdit() {
  customTableRef.value.hieraEdit()
}
</script>
