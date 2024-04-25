<template>
  <el-dialog
    v-bind="dialogProps"
    v-model="visible"
    class="dialog_content__common"
    :title="inStateOne ? addTitle : editTitle"
  >
    <component
      :is="formComponent"
      ref="FormRefs"
      :in-state-one="inStateOne"
      :list-request="listRequest"
      :visible="visible"
      v-bind="formProps"
      @close="resetForm"
    />
    <div class="publish_btn">
      <!-- <el-button @click="resetForm">
        {{ cancelText }}
      </el-button> -->
      <el-button
        class="button"
        type="primary"
        :loading="loading"
        @click="submitForm"
      >
        {{ confirmText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup name="FormDialog">
import { cloneDeep } from 'lodash-es'
import type { FormInstance } from 'element-plus'

const props = defineProps({
  autoResetForm: {
    type: Boolean,
    default: true,
  },
  formComponent: Object as PropType<ComponentPublicInstance>,
  dialogProps: Object,
  formProps: Object,
  addTitle: String,
  editTitle: String,
  confirmText: {
    type: String,
    default: '确认',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  initData: {
    // 新建时，某些表单项字段的默认值
    type: Object,
    default: () => ({}),
  },
  createRequest: Function as PropType<(data: any) => Promise<void>>,
  editRequest: Function as PropType<(data: any) => Promise<void>>,
  listRequest: Function as PropType<() => Promise<void>>,
})
const emits = defineEmits(['confirm', 'error'])

defineExpose({
  open,
})
const loading = ref(false)

const visible = ref(false)
const inStateOne = ref(true) // 编辑: false；新增: true;
const data = ref<any>(null)

// 打开弹框
function open<T>(_data?: T) {
  if (_data) {
    inStateOne.value = false
    data.value = { ..._data }
  } else {
    inStateOne.value = true
  }
  // 触发下面的 watch
  // 或者不用 watch ，直接在这里执行 watch 里的逻辑也可
  visible.value = true
}

/**
 * @desc 格式化参数，提交 post 之前，去掉空格
 * @param obj
 */
// function formatterParams(obj: any) {
//   if (!obj) {
//     return {}
//   }
//   for (const key in obj) {
//     if (typeof obj[key] === 'string' && obj[key]) {
//       obj[key] = obj[key].trim()
//     }
//   }
//   return obj
// }

const FormRefs = ref<any>()
const submitForm = async () => {
  const form = FormRefs.value.formRef as FormInstance
  await form.validate()
  // const params = formatterParams(FormRefs.value._getData ? FormRefs.value._getData() : FormRefs.value.data)
  const params = FormRefs.value._getData ? FormRefs.value._getData() : FormRefs.value.data
  loading.value = true
  try {
    let res: any = {}
    if (inStateOne.value && props.createRequest) {
      res = await props.createRequest(params)
    } else if (!inStateOne.value && props.editRequest) {
      res = await props.editRequest(params)
    }
    if (props.listRequest) {
      // 新增或修改成功后，更新列表页
      await props.listRequest()
    }
    loading.value = false
    emits('confirm', {
      ...params,
      ...res,
      _inStateOne: inStateOne.value, // 告诉父组件是新增还是编辑
    })
    visible.value = false

    if (!props.autoResetForm) {
      // 如果设置的是不自动清空表单，那么提交接口后必须要清空了
      resetForm(true)
    }
  } catch (error) {
    console.error(error)
    loading.value = false
    emits('error', error)
  }
}

const resetForm = (mustRest = false) => {
  if (props.autoResetForm || mustRest) {
    const form = FormRefs.value.formRef as FormInstance
    form.clearValidate()
    form.resetFields()
    defaultData.value = null
  } else {
    // 保留之前的值
    defaultData.value = cloneDeep(FormRefs.value.data)
  }
  visible.value = false
}

const defaultData: any = ref(null)
watch(visible, async val => {
  await nextTick()
  // form.vue 初始化的值（比如每次打开弹框 input 默认为1）需要单独存起来，不然就会被覆盖或清空了
  if (!defaultData.value) {
    defaultData.value = cloneDeep(FormRefs.value.data)
  }
  if (val) {
    // defaultData，dialog打开的时候对form进行初始化，初始值来自 formComponent的data
    // 如果是新建逻辑，则用defaultData字段去初始化form
    // 否则使用传入的data字段进行初始化
    const _defaultData = {
      ...defaultData.value,
      ...props.initData,
    }
    const targetData = cloneDeep(inStateOne.value ? _defaultData : data.value)
    if (FormRefs.value._setData) {
      FormRefs.value._setData(targetData)
    } else {
      // 子组件未声明 _setData，这里暴力地直接去修改了子组件的 data（reactive）
      Object.assign(FormRefs.value.data, targetData)
    }
  } else {
    // dialog关闭的时候把form的validate清除
    // TODO，dialog 关闭时要不要把表单里的数据也清空？这样避免了图片闪烁的问题
    resetForm()
  }
})
</script>
