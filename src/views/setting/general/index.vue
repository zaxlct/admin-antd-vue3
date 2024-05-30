<template>
  <a-card title="直播间付费设置">
    <a-form
      class="form_container"
      :model="live_room_payment_config"
    >
      <a-form-item
        label="付费弹幕"
        name="paid_barrage"
        extra="开启后，当前消息需要付费发送，且仅有主播可见"
      >
        <a-checkbox v-model:checked="live_room_payment_config.paid_barrage" />
      </a-form-item>
      <a-form-item
        label="所需钻石"
        name="required_diamonds"
      >
        <a-input-number
          v-model:value="live_room_payment_config.required_diamonds"
          :min="0"
          :max="999999999"
          :step="1"
          :precision="0"
        />
      </a-form-item>
    </a-form>
  </a-card>

  <a-card
    class="mt20"
    title="点赞配置"
  >
    <a-form
      style="width: 100%"
      class="form_container"
      layout="inline"
      :model="like_config"
    >
      <a-form-item
        label="每位用户"
        name="hour"
      >
        <a-input-number
          :min="0"
          :max="999999999"
          :step="1"
          :precision="0"
          v-model:value="like_config.hour"
        />
      </a-form-item>

      <a-form-item
        label="小时内最多可点赞"
        name="max_likes_per_hour"
        extra="超过当前设定时，点赞无效，无法增加魅力值"
      >
        <a-input-number
          :min="0"
          :max="999999999"
          :step="1"
          :precision="0"
          v-model:value="like_config.max_likes_per_hour"
        />
      </a-form-item>
    </a-form>
  </a-card>

  <a-card
    class="mt20"
    title="魅力值配置"
  >
    <a-form
      style="width: 100%"
      class="form_container"
      layout="inline"
      :model="charm_config"
    >
      <div class="title">
        钻石与魅力值比例配置
      </div>
      <a-form-item
        name="diamond_to_charm_ratio.diamond_value"
        extra="请输入钻石数"
      >
        <a-input-number
          :min="0"
          :max="999999999"
          :step="1"
          :precision="0"
          v-model:value="charm_config.diamond_to_charm_ratio.diamond_value"
        />
      </a-form-item>
      <span class="bold mr12">:</span>
      <a-form-item
        name="diamond_to_charm_ratio.charm_value"
        extra="请输入魅力值"
      >
        <a-input-number
          :min="0"
          :max="999999"
          :step="1"
          :precision="0"
          v-model:value="charm_config.diamond_to_charm_ratio.charm_value"
        />
      </a-form-item>

      <div class="title mt20">
        点赞数与魅力值比例配置
      </div>
      <a-form-item
        name="likes_to_charm_ratio.like_value"
        extra="请输入点赞数"
      >
        <a-input-number
          :min="0"
          :max="999999999"
          :step="1"
          :precision="0"
          v-model:value="charm_config.likes_to_charm_ratio.like_value"
        />
      </a-form-item>
      <span class="bold mr12">:</span>
      <a-form-item
        :model="like_config"
        extra="请输入魅力值"
      >
        <a-input-number
          :min="0"
          :max="999999"
          :step="1"
          :precision="0"
          v-model:value="charm_config.likes_to_charm_ratio.charm_value"
        />
      </a-form-item>
    </a-form>
  </a-card>

  <a-card
    class="mt20"
    title="粉丝团配置"
  >
    <a-form
      style="width: 500px"
      class="form_container"
      layout="inline"
      :model="fanclub_config"
    >
      <a-form-item
        name="begin.name"
        label="初级粉丝团"
        :rules="[{ required: true, message: '请输入粉丝团名称' }]"
      >
        <a-input
          v-model:value="fanclub_config.begin.name"
          placeholder="请输入粉丝团名称"
        />
      </a-form-item>
      <span class="bold mr12">:</span>
      <a-form-item
        name="begin.diamond"
        extra="加入粉丝团所需钻石"
      >
        <a-input-number
          :min="0"
          :max="999999"
          :step="1"
          :precision="0"
          v-model:value="fanclub_config.begin.diamond"
        />
      </a-form-item>

      <a-form-item
        name="inter.name"
        label="中级粉丝团"
        :rules="[{ required: true, message: '请输入粉丝团名称' }]"
      >
        <a-input
          v-model:value="fanclub_config.inter.name"
          placeholder="请输入粉丝团名称"
        />
      </a-form-item>
      <span class="bold mr12">:</span>
      <a-form-item
        name="inter.diamond"
        extra="加入粉丝团所需钻石"
      >
        <a-input-number
          :min="0"
          :max="999999"
          :step="1"
          :precision="0"
          v-model:value="fanclub_config.inter.diamond"
        />
      </a-form-item>

      <a-form-item
        name="adv.name"
        label="高级粉丝团"
        :rules="[{ required: true, message: '请输入粉丝团名称' }]"
      >
        <a-input
          v-model:value="fanclub_config.adv.name"
          placeholder="请输入粉丝团名称"
        />
      </a-form-item>
      <span class="bold mr12">:</span>
      <a-form-item
        name="adv.diamond"
        extra="加入粉丝团所需钻石"
      >
        <a-input-number
          :min="0"
          :max="999999"
          :step="1"
          :precision="0"
          v-model:value="fanclub_config.adv.diamond"
        />
      </a-form-item>
    </a-form>
  </a-card>

  <a-card
    class="mt20"
    title="注册设置"
  >
    <a-form
      class="form_container"
      layout="inline"
      :model="register_config"
      :labelCol="{ style: { width: '100px' } }"
    >
      <a-form-item
        label="绑定方式"
        extra="选中后，用户端注册后可绑定当前账号"
      >
        <a-checkbox v-model:checked="register_config.use_phone">手机号</a-checkbox>
        <a-checkbox v-model:checked="register_config.use_email">邮箱</a-checkbox>
      </a-form-item>

      <a-form-item
        label="注册邀请码"
        name="use_inv_code"
        extra="选中后，用户需要输入邀请码才能注册"
      >
        <a-checkbox v-model:checked="register_config.use_inv_code" />
      </a-form-item>

      <a-form-item
        label="账号登录"
        name="allow_visitor_login"
        extra="选中后，自动配置游客账号"
      >
        <a-checkbox v-model:checked="register_config.allow_visitor_login" />
      </a-form-item>

      <a-form-item
        label="同IP注册"
        name="allow_same_ip"
        extra="选中后，表示一个IP可注册多个账号"
      >
        <a-checkbox v-model:checked="register_config.allow_same_ip" />
      </a-form-item>

      <a-form-item
        label="同设备注册"
        name="allow_same_device"
        extra="选中后，表示一个设备可注册多个账号"
      >
        <a-checkbox v-model:checked="register_config.allow_same_device" />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
import { watchDebounced } from '@vueuse/core'

const live_room_payment_config = reactive({
  paid_barrage: 1,
  required_diamonds: 0
})

const like_config = reactive({
  hour: 1,
  max_likes_per_hour: 0
})

const charm_config = reactive({
  diamond_to_charm_ratio: {
    diamond_value: 100,
    charm_value: 1
  },
  likes_to_charm_ratio: {
    like_value: 100,
    charm_value: 1
  }
})

const fanclub_config = reactive({
  begin: {
    name: '',
    diamond: 0
  },
  inter: {
    name: '',
    diamond: 0
  },
  adv: {
    name: '',
    diamond: 0
  }
})

const register_config = reactive({
  use_phone: false,
  use_email: false,
  use_inv_code: false,
  allow_visitor_login: false,
  allow_same_ip: false,
  allow_same_device: false
})

watchDebounced(fanclub_config, () => {
}, { debounce: 1000 })
</script>
<style lang="sass" scoped>
.form_container
  width: 400px

  .title
    margin-bottom: 10px
    width: 100%
    font-size: 14px
</style>
