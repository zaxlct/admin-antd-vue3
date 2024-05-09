<template>
<a-table
  :scroll="{ x: 1500, y: 300 }"
  :dataSource
  :columns="columns"
  :loading="loading"
/>
</template>

<script setup lang="jsx">
import { getUserListReq, getUserLogListReq } from '@/api/users'

const { loading } = useRequest(getItemList)
const { createDialog } = useDialog()
const dataSource = ref([])

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
  {
    title: '用户信息',
    dataIndex: 'user_id',
    customRender: ({ record }) =>
      <div>
        <p>
          {record.nickname}
          <Clipboard text={record.nickname} />
        </p>

        <p>ID：{record.user_id}
          <Clipboard text={record.user_id} />
        </p>
        <p>
          等级：{record.user_lv}
          <a-tag color="green" v-if={record.online_status === 1}>在线</a-tag>
          <a-tag color="red" v-else>离线</a-tag>
        </p>
      </div>
  },
  {
    title: '层级信息',
    dataIndex: 'hierarchy',
    customRender: ({ record }) =>
      <>
        <p v-for={(item, index) in record.hierarchy} key={index}>{item.label}</p>
      </>
  },
  {
    title: '设备信息',
    dataIndex: 'deivces',
    customRender: ({ record }) =>
      <div>
        <p>
          设备：{record.deivces.os_type === 1 ? 'iOS' : 'Android'}
          <a-button type="link" size="small" onClick={() => openDeviceLogModal('device', record.user_id)}>({record.deivces.dev_log_count})</a-button>
        </p>
        <p>
          IP：{record.deivces.login_ip}
          <a-button type="link" size="small" onClick={() => openDeviceLogModal('ip', record.user_id)}>({record.deivces.ip_log_count})</a-button>
        </p>
      </div>
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    customRender: ({ record }) =>
      <div>
        <p>手机号：{record.phone}</p>
        <p>邮箱：{record.email}</p>
      </div>
  },
  {
    title: '钱包信息',
    dataIndex: 'wallet',
    customRender: ({ record }) =>
      <div>
        <p>余额：{record.wallet.balance}</p>
        <p>钻石：{record.wallet.diamond}</p>
        <p>充值：{record.wallet.recharge}</p>
        <p>提现：{record.wallet.withdrawal}</p>
      </div>
  },
  {
    title: '权益信息',
    dataIndex: 'noble_title',
    customRender: ({ record }) =>
      <div>
        <p v-if={record.is_noble}>
          { record.noble_title }：
        </p>
        <p>
          粉丝团：
          <span v-if={record.fanclub?.length === 1}>
            {record.fanclub[0].label}
          </span>
          <a-button v-else type="link" size="small">
            {record.fanclub?.length}个粉丝团
          </a-button>
        </p>
      </div>
  },
  {
    title: '注册事件/最近登录',
    dataIndex: 'register_time',
    customRender: ({ record }) =>
      <div>
        <p>注册时间：{record.register_time}</p>
        <p>最近登录：{record.last_login_time}</p>
      </div>
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '操作',
    fixed: 'right',
    width: 120,
    dataIndex: 'action',
    customRender: ({ record }) =>
      <a-dropdown-button size="small" onClick={handleButtonClick}>
      编辑
      <template v-slot:overlay>
        <a-menu onClick={handleMenuClick}>
          <a-menu-item key="1">
            禁言
          </a-menu-item>
          <a-menu-item key="2">
            拉黑
          </a-menu-item>
          <a-menu-item key="3">
            标签
          </a-menu-item>
          <a-menu-item key="4">
            备注
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  },
]

function handleButtonClick() {
  console.log('click dropdown button')
}

function handleMenuClick(e) {
  console.log('click dropdown menu', e)
}


/**
 * type: device | ip
 */
async function openDeviceLogModal(type, user_id) {
  loading.value = true
  const [err, data] = await to(getUserLogListReq(user_id, { limit: 100, page: 1 }))
  if (err) {
    console.log(err)
    loading.value = false
    return
  }
  loading.value = false
  createDialog({
    width: '500px',
    footer: null,
    component: () =>
      <div>
        <div v-for={(item, index) in data} key={index}>
          <span v-if={type === 'device'}>
            {ENUM.log_type[item.log_type]}设备：{item.dev_model} | {item.log_time}
          </span>
          <span v-else>
            {ENUM.log_type[item.log_type]}IP：{item.ip || '--'}
          </span>
        </div>
      </div>
    ,
    // ...支持AModal的所有配置
    onConfirm(data) {
      // 可以拿到内部数据，在表单类弹窗中很有用
      console.log('拿到组件内部数据：', data)
    },
  })
}
</script>
