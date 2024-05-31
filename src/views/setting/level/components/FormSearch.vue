<template>
  <a-card class="mb15">
    <div class="__table_form_search_component">
      <form-create
        v-model:api="fApi"
        v-model="data"
        :option
        :rule
      >
        <template #type-btns>
          <section
            class="flex mb15"
            style="width: 100%;"
          >
            <AButton
              @click="submitForm"
              type="primary"
              class="mr10"
            >查询</AButton>
            <AButton
              class="mr10"
              @click="resetForm"
            >重置</AButton>
            <div class="flex1 flex_end">
              <AButton
                class="mr20"
                type="primary"
                @click="openLevelConfig"
              >等级配置</AButton>
              <AButton
                type="primary"
                @click="emit('addItem')"
              >添加等级</AButton>
            </div>
          </section>
        </template>
      </form-create>
    </div>
  </a-card>
</template>

<script setup lang="jsx">
import { setLevelConfigReq, getLevelConfigReq } from '@/api/setting'

const params = defineModel()
const data = reactive({
  create_time: [],
})

const emit = defineEmits(['addItem', 'search'])
const fApi = ref({})
const option = {
  resetBtn: false,
  submitBtn: false,
  global: {
    '*': {
      col: {
        show: false,
      },
      wrap: {
        labelCol: { span: 8 },
      },
    },
  },
}

const rule = ref([
  {
    type: 'rangePicker',
    field: 'create_time',
    title: '创建时间',
    value: '',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'X',
    },
  },
  { type: 'btns' },
])

function resetForm() {
  fApi.value.resetFields()
  getData(data)
}

function submitForm() {
  fApi.value.submit(formData => {
    getData(formData)
  })
}

function getData(data) {
  params.value = {
    ...data,
    create_time: data.create_time ? data.create_time?.join(',') : undefined,
  }
}
const { createDialog } = useDialog()

const btnLoading = ref(false)
async function openLevelConfig() {
  const [err, data = {}] = await to(getLevelConfigReq())
  if (err) {
    console.log(err)
    btnLoading.value = false
    return
  }
  btnLoading.value = false
  const formValue = ref({
    speech_level: data.speech_level,
    effect_level: data.effect_level,
    sub: {
      recharge_amount: data.xp_conf.recharge.amount,
      recharge_points: data.xp_conf.recharge.points,
      diamonds_amount: data.xp_conf.diamonds.amount,
      diamonds_points: data.xp_conf.diamonds.points,
    },
  })

  const formModalProps = {
    request: setLevelConfigReq,
    getData(data) {
      return {
        effect_level: data.effect_level,
        speech_level: data.speech_level,
        xp_conf: {
          recharge: {
            amount: data.sub.recharge_amount,
            points: data.sub.recharge_points
          },
          diamonds: {
            amount: data.sub.diamonds_amount,
            points: data.sub.diamonds_points
          }
        },
      }
    },
    option: {
      global: {
        '*': {
          wrap: {
            labelCol: { span: 6 },
          },
        },
      },
    },
    rule: [
      {
        type: 'input-number',
        field: 'speech_level',
        title: '发言等级',
        value: '',
        props: {
          max: 100000,
          min: 0,
          step: 1,
          precision: 0,
        },
        effect: {
          required: true,
        }
      },
      {
        type: 'subForm',
        field: 'sub',
        title: '经验值机制',
        value: { recharge_amount: '', recharge_points: '', diamonds_amount: '', diamonds_points: '', },
        props: {
          rule: [
            {
              type: 'input-number',
              field: 'recharge_amount',
              class: 'label_colon',
              wrap: {
                extra: '充值金额',
              },
              value: '',
              props: {
                max: 100000,
                min: 0,
                step: 1,
                precision: 0,
              },
              effect: {
                required: true,
              },
              col: {
                span: 12
              }
            },
            {
              type: 'input-number',
              field: 'recharge_points',
              wrap: {
                extra: '经验值',
              },
              col: {
                span: 12
              },
              value: '',
              props: {
                max: 100000,
                min: 0,
                step: 1,
                precision: 0,
              },
              effect: {
                required: true,
              },
            },
            {
              type: 'input-number',
              field: 'diamonds_amount',
              wrap: {
                extra: '消费钻石',
              },
              value: '',
              props: {
                max: 100000,
                min: 0,
                step: 1,
                precision: 0,
              },
              effect: {
                required: true,
              },
              col: {
                span: 12
              }
            },
            {
              type: 'input-number',
              field: 'diamonds_points',
              wrap: {
                extra: '经验值',
              },
              col: {
                span: 12
              },
              value: '',
              props: {
                max: 100000,
                min: 0,
                step: 1,
                precision: 0,
              },
              effect: {
                required: true,
              },
            },
          ]
        }
      },

      {
        type: 'input-number',
        field: 'effect_level',
        title: '特效等级',
        value: '',
        props: {
          max: 100000,
          min: 0,
          step: 1,
          precision: 0,
        },
        wrap: {
          help: '设置后，根据当前设置的等级，对应等级及以上用户进入直播间时展示特效提醒',
        },
        effect: {
          required: true,
        },
      },
    ],
  }

  createDialog({
    title: '等级配置',
    width: 500,
    component:
      <ModalForm
        v-model={formValue.value}
        {...formModalProps}
      />
    ,
  })
}


defineExpose({
  resetForm,
})
</script>

<style lang="sass scoped">
</style>
