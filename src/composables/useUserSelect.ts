import UserSelect from '@/components/Form/UserSelect/UserSelect.vue'

export default function () {
  const userRelRule = {
    type: 'UserSelect',
    field: 'target_user_list',
    title: '选择用户',
    value: [],
    effect: {
      required: true,
    },
  }

  onBeforeMount(() => {
    formCreate.component('UserSelect', UserSelect)
  })

  return {
    userRelRule,
  }
}
