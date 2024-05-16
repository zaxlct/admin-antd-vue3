export default {
  type: 'select',
  field: 'merch_id',
  title: '商户',
  value: '',
  options: [],
  effect: {
    fetch: {
      action: '/api/v1/merchant/summary',
      to: 'options',
      method: 'get',
      parse: res => [
        { value: 0, label: '所有商户' },
        ...res.items.map(item => ({ value: item.merch_id, label: item.merch_name })),
      ],
    },
  },
}
