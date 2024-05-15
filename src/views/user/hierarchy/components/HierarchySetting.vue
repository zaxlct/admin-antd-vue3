<template>
  <a-card title="层级设置">
    <a-form
      :model="formState"
      @finish="onFinish"
    >
      <a-form-item
        label="层级条件"
        class="align_self_start"
      >

        <a-form-item-rest>
          <section class="form_item_container">
            <a-checkbox
              style="width: 110px;"
              v-model:checked="recharge.enable"
            >充值类型</a-checkbox>
            <span class="split_line">|</span>
            <a-radio-group
              v-model:value="recharge.recharged"
              name="radioGroup"
            >
              <a-radio :value="true">充值过</a-radio>
              <a-radio :value="false">自定义充值金额范围</a-radio>
            </a-radio-group>
            <number-range v-model="recharge.recharge_range" />
          </section>

          <section class="form_item_container">
            <a-checkbox
              style="width: 110px;"
              v-model:checked="noble.enable"
            >贵族类型</a-checkbox>
            <span class="split_line">|</span>
            <a-radio-group
              v-model:value="noble.noble_status"
              name="radioGroup"
            >
              <a-radio :value="1">
                开通过贵族
              </a-radio>
              <a-radio :value="2">当前为贵族</a-radio>
            </a-radio-group>

            <span class="split_line">|</span>
            <a-select
              style="width: 120px;"
              v-model:value="noble.noble_lv"
              :options="nobleList"
            />
          </section>

          <section class="form_item_container">
            <a-checkbox
              style="width: 110px;"
              v-model:checked="os.enable"
            >系统类型</a-checkbox>
            <span class="split_line">|</span>
            <a-checkbox-group
              v-model:value="os.os_type"
              :options="[
                { label: 'iOS', value: 1 },
                { label: 'Android', value: 2 },
              ]"
            />
          </section>

          <section class="form_item_container">
            <a-checkbox
              style="width: 110px;"
              v-model:checked="lv.enable"
            >等级类型</a-checkbox>
            <span class="split_line">|</span>
            <a-radio-group
              v-model:value="lv.user_all_lv"
              name="radioGroup"
            >
              <a-radio :value="true">全部等级</a-radio>
              <a-radio :value="false">自定义等级范围</a-radio>
            </a-radio-group>
            <number-range v-model="lv.user_lv_range" />
          </section>

          <section class="form_item_container">
            <a-checkbox
              style="width: 110px;"
              v-model:checked="withdrawn.enable"
            >提现类型</a-checkbox>
            <span class="split_line">|</span>
            <a-radio-group
              v-model:value="withdrawn.withdrawn"
              name="radioGroup"
            >
              <a-radio :value="true">提现过</a-radio>
              <a-radio :value="false">自定义提现金额</a-radio>
            </a-radio-group>
            <number-range v-model="withdrawn.withdrawn_range" />
          </section>

          <section class="form_item_container">
            <a-checkbox
              style="width: 110px;"
              v-model:checked="user.enable"
            >用户类型</a-checkbox>
            <span class="split_line">|</span>
            <a-checkbox-group
              v-model:value="user.user_type"
              :options="Object.keys($enums.user_type).map((key) => ({
                label: $enums.user_type[key],
                value: key,
              }))"
            />
          </section>

          <section class="form_item_container">
            <a-checkbox
              style="width: 110px;"
              v-model:checked="lang.enable"
            >多语言类型</a-checkbox>
            <span class="split_line">|</span>
            <a-checkbox-group
              v-model:value="lang.lang"
              :options="Object.keys($enums.lang_type).map((key) => ({
                label: $enums.lang_type[key],
                value: key,
              }))"
            />
          </section>

          <section class="form_item_container">
            <a-checkbox
              style="width: 110px;"
              v-model:checked="vanity.enable"
            >其他类型</a-checkbox>
            <span class="split_line">|</span>
            <a-checkbox v-model:checked="vanity.bought_vanity_number">购买过靓号</a-checkbox>
            <a-checkbox v-model:checked="vanity.is_vanity_user">当前为靓号用户</a-checkbox>
          </section>
        </a-form-item-rest>

        <div
          class="error_msg"
          v-if="showErrorMsg"
        >
          请请至少选择一个层级条件
        </div>
      </a-form-item>

      <a-form-item label="层级用户">
        <a-button
          @click="openUserList"
        >{{ userListData.total }} ｜ 查看</a-button>
      </a-form-item>

      <a-form-item
        name="name"
        label="层级名称"
        :rules="[{ required: true, message: '请输入层级名称，最多10个字', max: 10 }]"
      >
        <a-input
          v-model:value="formState.name"
          style="width: 180px;"
        ></a-input>
      </a-form-item>

      <div class="flex_center">
        <a-button
          html-type="submit"
          style="width: 200px;"
          size="large"
          type="primary"
        >保存</a-button>
      </div>
    </a-form>
  </a-card>
</template>

<script setup lang="jsx">
import { createHierarchyReq } from '@/api/hierarchy'
defineProps({
  userListData: {
    type: Object,
    default: () => ({
      items: [],
      total: 0,
      loading: false,
    }),
  },
  nobleList: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['openUserList', 'onAddHierarchy'])

const formState = reactive({
  name: '',
})

const form = reactive({
  recharge: {
    enable: false,
    recharged: true,
    recharge_range: [0, 0],
  },
  noble: {
    enable: false,
    noble_status: 1,
    noble_lv: 0, // 0 为全部贵族
  },
  os: {
    enable: false,
    os_type: [],
  },
  lv: {
    enable: false,
    user_all_lv: true,
    user_lv_range: [0, 0],
  },
  withdrawn: {
    enable: false,
    withdrawn: true,
    withdrawn_range: [0, 0],
  },
  user: {
    enable: false,
    user_type: [],
  },
  lang: {
    enable: false,
    lang: [],
  },
  vanity: {
    enable: false,
    bought_vanity_number: false,
    is_vanity_user: false,
  }
})

const {
  recharge,
  noble,
  os,
  lv,
  withdrawn,
  user,
  lang,
  vanity,
} = toRefs(form)


async function openUserList() {
  const params = getData()
  emit('openUserList', params)
}

const showErrorMsg = ref(false)
let timer = ref(null)
// get or post
function getData() {
  const params = {}

  if (recharge.value.enable) {
    params.recharged = recharge.value.recharged
    params.recharge_range = recharge.value.recharge_range
  }

  if (noble.value.enable) {
    params.noble_status = noble.value.noble_status
    params.noble_lv = noble.value.noble_lv
  }

  if (os.value.enable) {
    params.os_type = os.value.os_type
  }

  if (lv.value.enable) {
    params.user_all_lv = lv.value.user_all_lv
    params.user_lv_range = lv.value.user_lv_range
  }

  if (withdrawn.value.enable) {
    params.withdrawn = withdrawn.value.withdrawn
    params.withdrawn_range = withdrawn.value.withdrawn_range
  }

  if (user.value.enable) {
    params.user_type = user.value.user_type
  }

  if (lang.value.enable) {
    params.lang = lang.value.lang
  }

  if (vanity.value.enable) {
    params.bought_vanity_number = vanity.value.bought_vanity_number
    params.is_vanity_user = vanity.value.is_vanity_user
  }
  if (Object.keys(params).length === 0) {
    showErrorMsg.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      showErrorMsg.value = false
    }, 2000)
    throw new Error('请至少选择一个层级条件')
  }
  return params
}

const submitLoading = ref(false)
const onFinish = () => {
  const conds = getData()
  submitLoading.value = true
  createHierarchyReq({
    name: formState.name,
    conds,
  }).then(() => {
    emit('onAddHierarchy')
  }).finally(() => {
    submitLoading.value = false
  })
}

</script>

<style lang="sass" scoped>
.form_item_container
  display: flex
  align-items: center
  margin-bottom: 15px
  padding: 10px
  background: #f5f5f5

  .split_line
    margin: 0 20px
    color: #999
    font-size: 14px
</style>
