<template>
  <div class="page_container">
    <a-button
      type="primary"
      @click="addItem"
    >新增</a-button>
    <a-table
      :dataSource
      :columns="columns"
      :loading="loading"
    />
  </div>

</template>

<script setup lang="jsx">
import { getUserListReq } from '@/api/users'
const { loading } = useRequest(getItemList)

const dataSource = ref([])
function addItem() {
  console.log('add item')
}

function getItemList() {
  getUserListReq().then(res => {
    dataSource.value = res.items
  }).catch(err => {
    console.log(err)
  })
}

const columns = [
  {
    title: '商户信息',
    dataIndex: 'merchant',
    customRender: ({ record }) =>
      <div>
        <p>{record.merchant.name}</p>
        <p>应用名称：{record.merchant.app_name}</p>
        <p>APPID：{record.merchant.app_id}</p>
      </div>
  },
]
</script>
