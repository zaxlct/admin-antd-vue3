<template>
<a-table
  :scroll="{ x: 1500, y: 300 }"
  :dataSource
  :columns="columns"
  :loading="loading"
/>
</template>

<script setup lang="jsx">
import dayjs from 'dayjs'
import { getUserListReq, getUserLogListReq, getUserFunclubListReq, setUserRemarkReq, setBlackReq } from '@/api/users'

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
          <a-button
            v-else
            type="link"
            size="small"
            onClick={() => openFunclubModal(record.user_id)}
          >
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
        <a-menu onClick={e => handleMenuClick(record, e)}>
          <a-menu-item key="1">
            禁言
          </a-menu-item>
          <a-menu-item key="拉黑" disabled={record.in_blacklist}>
            { record.in_blacklist ? '已拉黑' : '拉黑' }
          </a-menu-item>
          <a-menu-item key="3">
            标签
          </a-menu-item>
          <a-menu-item key="备注">
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

function handleMenuClick(userItem, { key }) {
  if (key === '备注') {
    editRemark(userItem)
  } else if (key === '拉黑') {
    blockUser(userItem)
  } else if (key === '禁言') {
    console.log('禁言')
  } else if (key === '标签') {
    console.log('标签')
  }
}

async function blockUser(userItem) {
  const formValue = ref({
    user_id: userItem.user_id,
    block_type: '',
    ageing_type: '',
    end_time: '',
    reason: '',
  })

  const formModalProps = {
    request: setBlackReq,
    getData(data) {
      const { user_id, ...params } = data
      return {
        ...params,
        user_ids: [user_id],
      }
    },

    rule: [
      {
        type: 'input',
        field: 'user_id',
        value: userItem.user_id,
        hidden: true,
      },
      {
        type: 'radio',
        field: 'block_type',
        title: '拉黑类型',
        value: '',
        options: Object.keys(ENUM.block_type).map(key => ({ label: ENUM.block_type[key], value: parseInt(key) })),
        validate: [{ type: 'number', required: true, message: '请选择拉黑类型' }]
      },
      {
        type: 'radio',
        field: 'ageing_type',
        title: '拉黑时效',
        value: '',
        options: Object.keys(ENUM.ageing_type).map(key => ({ label: ENUM.ageing_type[key], value: parseInt(key) })),
        validate: [{ type: 'number', required: true, message: '请选择拉黑时效' }],
        control: [
          {
            handle: val => val === 3,
            append: 'ageing_type',
            rule: [
              {
                type: 'datePicker',
                field: 'end_time',
                title: '拉黑时间',
                value: '',
                validate: [{ type: 'date', required: true, message: '请选择自定义拉黑时间' }],
                props: {
                  placeholder: '请选择时间',
                  showTime: { defaultValue: dayjs('00:00:00', 'HH:mm:ss') },
                  disabledDate: (current) => {
                    return current && current < dayjs().endOf('day')
                  },
                  format: 'YYYY-MM-DD HH:mm:ss',
                }
              }
            ]
          }
        ]
      },
      {
        type: 'input',
        field: 'reason',
        title: '理由',
        value: '',
        props: {
          type: 'textarea'
        },
        validate: [{ type: 'string', required: true, message: '请输入拉黑理由' }]
      },
    ],
  }

  createDialog({
    title: '拉黑',
    width: 500,
    component:
      <ModalForm
        v-model={formValue.value}
        {...formModalProps}
      />,
    onConfirm(status) {
      if (status) {
        const current = dataSource.value.find(item => item.user_id === userItem.user_id)
        if (current) {
          current.in_blacklist = true
        }
      }
    },
  })
}

// 修改备注
async function editRemark(userItem) {
  const request = remark => setUserRemarkReq(userItem.user_id, { remark })
  createDialog({
    width: 500,
    title: '备注',
    component: <Prompt defaultValue={userItem.remark} label="备注" textarea request={request} />,
    onConfirm(value) {
      if (value) {
        const current = dataSource.value.find(item => item.user_id === userItem.user_id)
        if (current) {
          current.remark = value
        }
      }
    },
  })
}

/**
 * 查看设备日志
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
    width: 500,
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
  })
}

// 查看粉丝团
async function openFunclubModal(user_id) {
  loading.value = true
  const [err, data] = await to(getUserFunclubListReq(user_id, { limit: 100, page: 1 }))
  if (err) {
    console.log(err)
    loading.value = false
    return
  }
  loading.value = false
  createDialog({
    width: 500,
    footer: null,
    component: () =>
      <div>
        <div v-for={(item, index) in data} key={index}>
          {item.label} | {item.lv_name}
        </div>
      </div>
    ,
  })
}
</script>
