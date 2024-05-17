<template>
  <recweightComponent></recweightComponent>
</template>

<script setup lang="jsx">
import CustomTable from './components/CustomTable.vue'
import FormSearch from './components/FormSearch.vue'

const recweightComponent = defineComponent({
  setup() {
    const customTableRef = ref(null)
    const formSearchRef = ref(null)
    const searchParams = ref({})

    return () => (
      <div class="page_container">
        <FormSearch
          ref={el => formSearchRef.value = el}
          v-model={searchParams.value}
          v-on={
            {
              addItem: () => customTableRef.value.editItem(),
            }
          }
        />
        <CustomTable
          ref={el => customTableRef.value = el}
          searchParams={searchParams.value}
          v-on={
            {
              resetSearch: () => formSearchRef.value.resetForm(),
            }
          }
        />
      </div>
    )
  },
})
</script>
