<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane
      v-for="item in tabs"
      :key="item.key"
      :tab="item.title"
    >
      <recweightComponent :recType="item.key" />
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="jsx">
import CustomTable from './components/CustomTable.vue'
import FormSearch from './components/FormSearch.vue'
const activeKey = ref(1)
const tabs = ref([
  {
    key: 1,
    title: '推荐页搜索',
  },
  {
    key: 2,
    title: '关注页搜索',
  },
  {
    key: 3,
    title: '房间推荐',
  },
])

const recweightComponent = defineComponent({
  props: {
    recType: {
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
          recType={props.recType}
          searchParams={searchParams.value}
          resetSearch={() => formSearchRef.value.resetForm()}
        />
      </div>
    )
  },
})
</script>
