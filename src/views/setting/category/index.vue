<template>
  <a-tabs
    v-model:activeKey="activeKey"
  >
    <a-tab-pane
      v-for="item in tabs"
      :key="item.key"
      :tab="item.title"
      :disabled="item.key === 2 && !parentId"
    >
      <CategoryComponent :type="item.key" />
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="jsx">
import CustomTable from './components/CustomTable.vue'
import FormSearch from './components/FormSearch.vue'
const route = useRoute()
const parentId = computed(() => route.query.parentId)
const activeKey = ref(1)
const tabs = ref([
  {
    key: 1,
    title: '一级分类',
  },
  {
    key: 2,
    title: '二级分类',
  },
])

const CategoryComponent = defineComponent({
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
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
          isParent={props.type === 1}
          searchParams={searchParams.value}
          v-on={
            {
              resetSearch: () => formSearchRef.value.resetForm(),
              changeTab: val => activeKey.value = val,
            }
          }
        />
      </div>
    )
  },
})
</script>
