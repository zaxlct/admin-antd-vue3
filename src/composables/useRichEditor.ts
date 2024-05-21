import RichEditor from '@/components/Form/RichEditor/RichEditor.vue'

export default function (title = '公告内容' ,field = 'content') {
  const richEditorRule = {
    type: 'RichEditor',
    field,
    title,
    value: [],
    effect: {
      required: true,
    },
  }

  onBeforeMount(() => {
    formCreate.component('RichEditor', RichEditor)
  })

  return {
    richEditorRule,
  }
}
