    // label 宽度不够时，使用这个代码
    option: {
      global: {
        '*': {
          wrap: {
            labelCol: { span: 6 },
          },
        },
      },
    },

  {
    title: '主播头像',
    dataIndex: 'avatar_url',
    customRender: ({ record }) =>
      <a-avatar src={record.avatar_url} size={40} />
  },


    customRender: ({ record }) =>
      <a-tag color={record.acct_status === 1 ? undefined : 'red'}>
        {ENUMS.anchor_acct_status[record.acct_status]}
      </a-tag>


  {
    type: 'a-input-search',
    field: 'anchor_id',
    title: '主播ID',
    value: '',
    validate: [
      {
        type: 'string',
        validator(rule, value) {
          if (value) {
            return Promise.resolve()
          } else {
            return Promise.reject()
          }
        },
        message: '请先点击搜索按钮，搜索主播'
      }
    ],
    options: [],
    props: {
      loading: false,
      enterButton: true,
    },
    effect: {
      loadData: {
        attr: 'labelOptions',
        to: 'options'
      },
    },
    on: {
      change(e) {
        formValue.value.anchor_id = e.target.value
      },
      search(value) {
        value = value.trim()
        eventBus.value.emit('fApiHandle', fApi => fApi.getRule('anchor_id').props.loading = true)
        getAnchorInfoReq({ anchor_id: value }).then(data => {
          if (data?.nickname) {
            formValue.value.nickname = data.nickname
            formValue.value.anchor_id = value
          } else {
            $message.error(`ID ${value} 未查到对应主播，请重新输入`)
            formValue.value.nickname = ''
          }
        }).finally(() => {
          eventBus.value.emit('fApiHandle', fApi => fApi.getRule('anchor_id').props.loading = false)
        })
      },
    },
  }
