<template lang="pug">
a-cascader.select(
  v-bind="$attrs"
  v-model:value="value"
  :fieldNames
  :options="options"
  placeholder="请选择所属行业"
  allowClear
  @change="onChange"
)
</template>

<script lang="ts" setup name="IndustrySelect">
import request from '@/utils/request'

const props = defineProps<{
  modelValue?: string
  label?: string
}>()
const emits = defineEmits(['update:modelValue', 'update:label'])
const value = ref<number[]>([])
const fieldNames = {
  value: 'dict_id',
  label: 'dict_label',
}

watch(
  () => props.modelValue,
  val => {
    if (val?.split && !value.value?.length) {
      value.value = val.split(',').map(item => Number(item))
    } else if (!val && value.value?.length) {
      value.value = []
    }
  },
  {
    immediate: true,
  }
)

function onChange(list: number[]) {
  if (list?.length) {
    emits('update:modelValue', list.join(','))
    const firstLevel = options.value.find(item => item.dict_id === list[0])
    const secondLevel = firstLevel?.children?.find(item => item.dict_id === list[1])
    emits('update:label', `${firstLevel?.dict_label} ${secondLevel?.dict_label}`)
  } else {
    emits('update:modelValue', null)
    emits('update:label', null)
  }
}

const options = ref([])
onMounted(async () => {
  options.value = await request.get('https://dev.ruzhi.com/api/common/getIndustriesByType?dict_type=INDUSTRY_DATA')
})
</script>

<style scoped lang="sass">
.visible_select
  margin-right: 18px
  width: 160px

  :deep(.el-input__wrapper)
    height: 30px
    border-radius: 30px

  :deep(.el-input__inner)
    padding-left: 8px
    color: #666

.visible_select__icon
  margin-right: 10px
  margin-bottom: 2px
</style>
