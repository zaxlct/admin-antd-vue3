import { getGuildListReq } from '@/api/public'

export default function (ps_ratio_disabled = false) {
  const {
    merchRelRule
  } = useMultipleSelect('展示商户')

  let guildList = []
  getGuildListReq().then(res => {
    guildList = res.items
    formCreate.setData('labelOptions', res.items.map(item => ({ value: item.guild_id, label: item.guild_name })))
  })

  return [
    {
      type: 'upload',
      field: 'avatar_url',
      title: '主播头像',
      props: {
        listType: "picture-card",
        action: 'https://jsonplaceholder.typicode.com/posts/',
        onSuccess(file) {
          file.url = file.response.url || 'http://form-create.com/logo.png'
        },
      },
      value: []
    },
    {
      type: 'input',
      field: 'nickname',
      title: '用户昵称',
      value: '',
      validate: [{ type: 'string', max: 10, required: true, message: '用户昵称最多10个字' }],
    },
    {
      type: 'input',
      field: 'phone',
      title: '手机号',
      value: '',
      validate: [{ type: 'string', message: '请输入正确的手机号', required: true }],
      props: {
        type: 'tel',
      },
    },
    {
      type: 'input',
      field: 'email',
      title: '邮箱',
      value: '',
      validate: [{ type: 'email', message: '请输入正确的邮箱' }],
      props: {
        type: 'email'
      },
    },
    {
      type: 'select',
      field: 'guild_id',
      title: '所属公会',
      value: '',
      options: [],
      props: {
        allowClear: true,
      },
      effect: {
        loadData: {
          attr: 'labelOptions',
          to: 'options'
        },
      },
      update(val, rule, api) {
        if (val) {
          // 选择公会后，默认跟随公会分成比例
          api.getRule('ps_ratio').value = guildList.find(item => item.guild_id === val)?.ps_ratio ?? null
          api.getRule('ps_ratio').props.disabled = true
        } else {
          api.getRule('ps_ratio').props.disabled = ps_ratio_disabled || false
        }
      },
    },
    {
      type: 'input-number',
      field: 'ps_ratio',
      title: '分成比例',
      value: '',
      props: {
        formatter: value => `${value}%`,
        max: 100,
        min: 0,
        step: 1,
        precision: 0,
        disabled: ps_ratio_disabled,
      },
      wrap: {
        help: '选择公会后，默认跟随公会分成比例',
      },
    },
    {
      type: 'input-number',
      field: 'hourly_rate',
      title: '主播时薪',
      value: '',
      props: {
        min: 0,
        step: 1,
        precision: 0,
      },
      wrap: {
        help: '仅做直播时长薪资计算，和分成无关',
      },
    },
    {
      type: 'input-number',
      field: 'hourly_rate_ulimit',
      title: '时薪上限',
      value: '',
      props: {
        step: 1,
        precision: 0,
      },
      wrap: {
        help: '按小时计算，直播每日可活动时薪的小时上限',
      },
    },
    {
      type: 'input',
      field: 'password',
      title: '登录密码',
      value: '',
      validate: [{ type: 'pattern', required: true, pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,16}$', message: '请输入 8~16位数字和字母组合密码' }],
      props: {
        type: 'password',
        placeholder: '请输入 8~16 位数字和字母组合密码',
      },
    },
    merchRelRule,
  ]
}
