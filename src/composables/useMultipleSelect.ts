import MultipleSelect from '@/components/Form/MultipleSelect/MultipleSelect.vue'

export default function useMultipleSelect(title='商户') {
  const merchRelRule = {
    type: 'MultipleSelect',
    field: 'merch_rel',
    title,
    value: '',
    options: [],
    props: {
    },
    effect: {
      fetch: {
        action: '/api/v1/merchant/summary',
        to: 'props.options',
        method: 'get',
        parse: res => [
          { value: '*', label: '所有商户' },
          ...res.items.map(item => ({ value: item.merch_id, label: item.merch_name })),
        ],
      },
    },
  }

  onBeforeMount(() => {
    formCreate.component('MultipleSelect', MultipleSelect)
  })

  return {
    merchRelRule,
  }
}
