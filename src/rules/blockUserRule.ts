import dayjs from 'dayjs'

export default [
  {
    type: 'radio',
    field: 'block_type',
    title: '拉黑类型',
    value: '',
    options: Object.keys(ENUM.block_type).map(key => ({ label: ENUM.block_type[key], value: parseInt(key) })),
    effect: {
      required: true
    }
  },
  {
    type: 'radio',
    field: 'ageing_type',
    title: '拉黑时效',
    value: '',
    options: Object.keys(ENUM.ageing_type).map(key => ({ label: ENUM.ageing_type[key], value: parseInt(key) })),
    effect: {
      required: true
    },
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
            effect: {
              required: true
            },
            props: {
              showTime: { defaultValue: dayjs('00:00:00', 'HH:mm:ss') },
              disabledDate: (current) => {
                return current && current < dayjs().endOf('day')
              },
              format: 'YYYY-MM-DD HH:mm:ss',
              valueFormat: 'X',
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
    effect: {
      required: true
    },
  },
]
