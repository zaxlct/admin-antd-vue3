<template>
  <div class="page_container">
    <a-button
      type="primary"
      @click="addCompany"
    >新增</a-button>
    <a-table
      :dataSource
      :columns="columns"
      :loading="tableLoading"
    />

    <ModalForm
      v-bind="formModalProps"
      v-model:open="formModalProps.open"
      v-model="formModalProps.value"
    />
  </div>
</template>

<script setup lang="jsx">
import request from '@/utils/request'
import ModalForm from './modal-form/modal-form.vue'

const tableLoading = ref(false)
const dataSource = ref([])
function getList() {
  tableLoading.value = true
  request.get('https://dev.ruzhi.com/api/company/list').then(res => {
    dataSource.value = res
    tableLoading.value = false
  }).catch(err => {
    console.log(err)
    tableLoading.value = false
  })
}

onMounted(async () => {
  getList()
})

const columns = [
  {
    title: 'ID',
    dataIndex: 'company_id',
    key: 'company_id',
  },
  {
    title: '企业名称',
    dataIndex: 'company_name',
    key: 'company_name',
  },
  {
    title: '会员数量',
    dataIndex: 'members_num',
    key: 'members_num',
  },
  {
    title: '更新日期',
    customRender: ({ record }) => {
      return <a-space>
        <a-popconfirm title='确定删除吗？' onConfirm={() => confirm(record.company_id)}>
          <a-button size='small' danger>删除</a-button>
        </a-popconfirm>
        <a-button size='small' type='primary' onClick={() => editCompany(record)}>修改</a-button>
      </a-space>
    },
  },
]


function addCompany() {
  formModalProps.isEdit = false
  formModalProps.open = true
}

async function editCompany(item) {
  formModalProps.isEdit = true
  tableLoading.value = true
  const data = await request.get('https://dev.ruzhi.com/api/company/get?company_id=' + item.company_id)
  tableLoading.value = false
  formModalProps.value = formModalProps.formatter(data)
  formModalProps.open = true
}

const formModalProps = reactive({
  open: false,
  isEdit: false,
  addTitle: '添加公司',
  editTitle: '修改公司',
  value: {
    company_id: undefined,
    company_type: 'COMPANY',
    company_name: '',
    company_industry: '',
    company_industry_dict_id: undefined,
    company_size_dict_id: undefined,
    company_founded_date: '',
    company_introduce: '',
    members_num: '',
  },
  createRequest: async (data) => {
    await request.post('https://dev.ruzhi.com/api/company/create', data)
  },
  editRequest: async (data) => {
    await request.post('https://dev.ruzhi.com/api/company/update', data)
  },
  listRequest: getList,
  getData(data) {
    const { company_introduce, company_name, company_type, company_id } = data
    return {
      company_id,
      company_introduce,
      company_name,
      company_type,
      members_num: 123
    }
  },

  formatter(data) {
    return {
      ...data,
      company_name: data.company_name + 'test'
    }
  },

  rule: [
    {
      type: 'input',
      field: 'company_id',
      hidden: true,
    },
    {
      type: 'radio',
      field: 'company_type',
      title: '企业类型',
      value: '',
      options: [
        { value: 'COMPANY', label: '公司' },
        { value: 'EDU', label: '院校' },
        { value: 'CERTIFICATE', label: '证书颁发机构' },
      ],
    },
    {
      type: 'input',
      field: 'company_name',
      title: '公司名称',
      value: '',
      validate: [{ type: 'string', required: true, message: '请输入公司名称' }]
    },
    {
      type: 'input',
      field: 'company_introduce',
      title: '公司简介',
      value: '',
      props: {
        type: 'textarea'
      }
    },
  ],
})

function confirm(company_id) {
  request.post('https://dev.ruzhi.com/api/company/delete', { company_id }).then(() => {
    getList()
    $message.success('删除成功')
  })
}
</script>