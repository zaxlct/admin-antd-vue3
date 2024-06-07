<script setup>
import { getStatSummaryReq } from '@/api/stat'
import FormSearch from './components/FormSearch.vue'
const searchParams = ref({
  merch_id: '',
  merch_name: '',
  os_type: 0,
  time_range: [],
  data_type: 0,
})

const data = ref({
  rchg_data: null,
  user_data: null,
  cons_data: null,
  exch_data: null,
  wd_data: null,
  bal_data: null,
  client_data: null,
})

const { loading } = useRequest(() => getStatSummaryReq({
  ...searchParams.value,
}), {
  refreshDeps: true,
  // pollingInterval: 1000 * 60 * 5,
  pollingWhenHidden: false,
  onSuccess(res) {
    data.value = res
  },
})
</script>

<template>
  <FormSearch v-model="searchParams" />

  <a-spin :spinning="loading">

    <div class="flex">
      <a-card
        class="w575 mr25"
        title="充值数据"
      >
        <div
          class="card_container flex_box"
          v-if="data.rchg_data"
        >
          <section>
            <div class="flex_center">
              充值金额
              <template v-if="!searchParams.data_type">
                <span class="c333 ml10">{{ data.rchg_data.rchg_amount.pct_chg_yest }}%&nbsp;</span>
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </div>
            <div class="fz24 bold c333">¥{{ data.rchg_data.rchg_amount.count }}</div>
          </section>

          <section>
            <div class="flex_center">
              首充金额
              <template v-if="!searchParams.data_type">
                <span class="c333 ml10">{{ data.rchg_data.first_rchg_amount.pct_chg_yest }}%&nbsp;</span>
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </div>
            <div class="fz24 bold c333">¥{{ data.rchg_data.first_rchg_amount.pct_chg_yest }}</div>
          </section>

          <section class="item_list">
            <section class="c333 flex">
              <div class="w120 tl">
                <span class="c999">充值人数：</span>
                <span>{{ data.rchg_data.rchg_count.pct_chg_yest }}</span>
              </div>
              <template v-if="!searchParams.data_type">
                {{ data.rchg_data.rchg_count.count }}%&nbsp;
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </section>
            <section class="c333 flex mt10">
              <div class="w120 tl">
                <span class="c999">首冲人数：</span>
                <span>{{ data.rchg_data.first_rchg_count.pct_chg_yest }}</span>
              </div>
              <template v-if="!searchParams.data_type">
                {{ data.rchg_data.first_rchg_count.count }}%&nbsp;
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </section>
            <section class="c333 flex mt10">
              <div class="w120 tl">
                <span class="c999">二充人数：</span>
                <span>{{ data.rchg_data.second_rchg_count.pct_chg_yest }}</span>
              </div>
              <template v-if="!searchParams.data_type">
                {{ data.rchg_data.second_rchg_count.count }}%&nbsp;
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </section>
          </section>
        </div>
      </a-card>

      <a-card
        class="w575"
        title="用户数据"
      >
        <div
          class="card_container flex_center"
          v-if="data.user_data"
        >
          <section class="mr70">
            <div class="flex_center">
              全部用户
            </div>
            <div class="fz24 bold c333">{{ data.user_data.total }}</div>
          </section>

          <section class="item_list">
            <section class="c333 flex">
              <div class="w120 tl">
                <span class="c999">新增用户：</span>
                <span>{{ data.user_data.new.count }}</span>
              </div>
              <template v-if="!searchParams.data_type">
                {{ data.user_data.new.pct_chg_yest }}%&nbsp;
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </section>
            <section class="c333 flex mt10">
              <div class="w120 tl">
                <span class="c999">活跃用户：</span>
                <span>{{ data.user_data.active.count }}</span>
              </div>
              <template v-if="!searchParams.data_type">
                {{ data.user_data.active.pct_chg_yest }}%&nbsp;
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </section>
            <section class="c333 flex mt10">
              <div class="w120 tl">
                <span class="c999">在线用户：</span>
                <span>{{ data.user_data.online.count }}</span>
              </div>
              <template v-if="!searchParams.data_type">
                {{ data.user_data.online.pct_chg_yest }}%&nbsp;
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </section>

            <section class="c333 flex mt10">
              <div class="w120 tl">
                <span class="c999">绑定用户：</span>
                <span>{{ data.user_data.bind.count }}</span>
              </div>
              <template v-if="!searchParams.data_type">
                {{ data.user_data.bind.pct_chg_yest }}%&nbsp;
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </section>
          </section>
        </div>
      </a-card>
    </div>

    <div class="flex mt25">
      <a-card
        class="w575 mr25"
        title="消费数据"
      >
        <div
          class="card_container flex_box h102"
          style="background: #FFF7F0;"
          v-if="data.cons_data"
        >
          <section class="flex1">
            <div class="flex_center">
              消费钻石
              <template v-if="!searchParams.data_type">
                <span class="c333 ml10">{{ data.cons_data.cons_diamonds.pct_chg_yest }}%&nbsp;</span>
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </div>
            <div class="fz24 bold c333">{{ data.cons_data.cons_diamonds.count }}</div>
          </section>

          <div class="split_line"></div>

          <section class="flex1">
            <div class="flex_center">
              消费人数
              <template v-if="!searchParams.data_type">
                <span class="c333 ml10">{{ data.cons_data.cons_count.pct_chg_yest }}%&nbsp;</span>
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </div>
            <div class="fz24 bold c333">{{ data.cons_data.cons_count.count }}</div>
          </section>
        </div>
      </a-card>

      <a-card
        class="w575"
        title="兑换数据"
      >
        <div
          class="card_container flex_box h102"
          style="background: #FFFBE9;"
          v-if="data.exch_data"
        >
          <section class="flex1">
            <div class="flex_center">
              兑换钻石
              <template v-if="!searchParams.data_type">
                <span class="c333 ml10">{{ data.exch_data.exch_diamonds.pct_chg_yest }}%&nbsp;</span>
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </div>
            <div class="fz24 bold c333">{{ data.exch_data.exch_diamonds.count }}</div>
          </section>

          <div class="split_line"></div>

          <section class="flex1">
            <div class="flex_center">
              消耗金额
              <template v-if="!searchParams.data_type">
                <span class="c333 ml10">{{ data.exch_data.cons_amount.pct_chg_yest }}%&nbsp;</span>
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </div>
            <div class="fz24 bold c333">¥{{ data.exch_data.cons_amount.count }}</div>
          </section>

          <div class="split_line"></div>

          <section class="flex1">
            <div class="flex_center">
              兑换人数
              <template v-if="!searchParams.data_type">
                <span class="c333 ml10">{{ data.exch_data.exch_count.pct_chg_yest }}%&nbsp;</span>
                <IconFont
                  class="primary_color"
                  type="i-up-o"
                />
              </template>
            </div>
            <div class="fz24 bold c333">{{ data.exch_data.exch_count.count }}</div>
          </section>
        </div>
        <template #title></template>
      </a-card>
    </div>

    <a-card
      class="w1174 mt25"
      title="提现数据"
    >
      <div
        class="card_container flex_box h102"
        style="background: #F2FCF8;"
        v-if="data.wd_data"
      >
        <section class="flex1">
          <div class="flex_center">
            提现金额
            <template v-if="!searchParams.data_type">
              <span class="c333 ml10">{{ data.wd_data.wd_amount.pct_chg_yest }}%&nbsp;</span>
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </template>
          </div>
          <div class="fz24 bold c333">¥{{ data.wd_data.wd_amount.count }}</div>
        </section>

        <div class="split_line"></div>

        <section class="flex1">
          <div class="flex_center">
            提现人数
            <template v-if="!searchParams.data_type">
              <span class="c333 ml10">{{ data.wd_data.wd_trans.pct_chg_yest }}%&nbsp;</span>
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </template>
          </div>
          <div class="fz24 bold c333">{{ data.wd_data.wd_trans.count }}</div>
        </section>

        <div class="split_line"></div>

        <section class="flex1">
          <div class="flex_center">
            提现笔数
            <template v-if="!searchParams.data_type">
              <span class="c333 ml10">{{ data.wd_data.wd_trans.pct_chg_yest }}%&nbsp;</span>
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </template>
          </div>
          <div class="fz24 bold c333">{{ data.wd_data.wd_trans.count }}</div>
        </section>
      </div>
    </a-card>

    <a-card
      class="w1174 mt25"
      title="余额数据"
    >
      <div
        class="card_container flex_box h102"
        style="background: #F1F8FF;"
        v-if="data.bal_data"
      >
        <section class="flex1">
          <div class="flex_center">
            用户余额
            <template v-if="!searchParams.data_type">
              <span class="c333 ml10">{{ data.bal_data.user_bal.pct_chg_yest }}%&nbsp;</span>
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </template>
          </div>
          <div class="fz24 bold c333">{{ data.bal_data.user_bal.count }}</div>
        </section>

        <div class="split_line"></div>

        <section class="flex1">
          <div class="flex_center">
            用户余额人数
            <template v-if="!searchParams.data_type">
              <span class="c333 ml10">{{ data.bal_data.user_bal_count.pct_chg_yest }}%&nbsp;</span>
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </template>
          </div>
          <div class="fz24 bold c333">{{ data.bal_data.user_bal_count.count }}</div>
        </section>

        <div class="split_line"></div>

        <section class="flex1">
          <div class="flex_center">
            用户钻石余额
            <template v-if="!searchParams.data_type">
              <span class="c333 ml10">{{ data.bal_data.user_diamond_bal.pct_chg_yest }}%&nbsp;</span>
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </template>
          </div>
          <div class="fz24 bold c333">{{ data.bal_data.user_diamond_bal.count }}</div>
        </section>

        <div class="split_line"></div>

        <section class="flex1">
          <div class="flex_center">
            钻石余额人数
            <template v-if="!searchParams.data_type">
              <span class="c333 ml10">{{ data.bal_data.diamond_bal_count.pct_chg_yest }}%&nbsp;</span>
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </template>
          </div>
          <div class="fz24 bold c333">{{ data.bal_data.diamond_bal_count.count }}</div>
        </section>
      </div>
    </a-card>

    <a-card
      class="w1174 mt25"
      v-if="data.client_data"
    >
      <p class="flex fz16">
        <IconFont
          class="mr8"
          type="i-apple-fill"
        />
        <span>iOS总用户数&nbsp;</span>
        <span class="ml10 mr10 c999">|</span>
        {{ data.client_data.total.ios }}
      </p>

      <p class="flex fz16 mt10">
        <IconFont
          class="mr8"
          type="i-android"
        />
        <span>安卓总用户数</span>
        <span class="ml10 mr10 c999">|</span>
        {{ data.client_data.total.android }}
      </p>

      <div class="flex_box mt10">
        <section class="flex1 box mr16">
          <p class="fz16 mt10 title pb10">注册用户</p>
          <p class="flex_box">
            <span class="flex">
              <IconFont
                class="mr8 fz22"
                type="i-apple-fill"
              />
              <span class="fz24">
                {{ data.client_data.reg_user.ios.count }}
              </span>
            </span>
            <span
              class="flex"
              v-if="!searchParams.data_type"
            >{{ data.client_data.reg_user.ios.pct_chg_yest }}%&nbsp;
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </span>
          </p>

          <p class="flex_box">
            <span class="flex">
              <IconFont
                class="mr8 fz22"
                type="i-android"
              />
              <span class="fz24">
                {{ data.client_data.reg_user.android.count }}
              </span>
            </span>
            <span
              class="flex"
              v-if="!searchParams.data_type"
            >{{ data.client_data.reg_user.android.pct_chg_yest }}%&nbsp;
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </span>
          </p>
        </section>

        <section class="flex1 box mr16">
          <p class="fz16 mt10 title pb10">登录用户</p>
          <p class="flex_box">
            <span class="flex">
              <IconFont
                class="mr8 fz22"
                type="i-apple-fill"
              />
              <span class="fz24">
                {{ data.client_data.login_user.ios.count }}
              </span>
            </span>
            <span
              class="flex"
              v-if="!searchParams.data_type"
            >{{ data.client_data.login_user.ios.pct_chg_yest }}%&nbsp;
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </span>
          </p>

          <p class="flex_box">
            <span class="flex">
              <IconFont
                class="mr8 fz22"
                type="i-android"
              />
              <span class="fz24">
                {{ data.client_data.login_user.android.count }}
              </span>
            </span>
            <span
              class="flex"
              v-if="!searchParams.data_type"
            >{{ data.client_data.login_user.android.pct_chg_yest }}%&nbsp;
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </span>
          </p>
        </section>

        <section class="flex1 box mr16">
          <p class="fz16 mt10 title pb10">绑定用户</p>
          <p class="flex_box">
            <span class="flex">
              <IconFont
                class="mr8 fz22"
                type="i-apple-fill"
              />
              <span class="fz24">
                {{ data.client_data.bind_user.ios.count }}
              </span>
            </span>
            <span
              class="flex"
              v-if="!searchParams.data_type"
            >{{ data.client_data.bind_user.ios.pct_chg_yest }}%&nbsp;
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </span>
          </p>

          <p class="flex_box">
            <span class="flex">
              <IconFont
                class="mr8 fz22"
                type="i-android"
              />
              <span class="fz24">
                {{ data.client_data.bind_user.android.count }}
              </span>
            </span>
            <span
              class="flex"
              v-if="!searchParams.data_type"
            >{{ data.client_data.bind_user.android.pct_chg_yest }}%&nbsp;
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </span>
          </p>
        </section>

        <section class="flex1 box">
          <p class="fz16 mt10 title pb10">游客用户</p>
          <p class="flex_box">
            <span class="flex">
              <IconFont
                class="mr8 fz22"
                type="i-apple-fill"
              />
              <span class="fz24">
                {{ data.client_data.guest_user.ios.count }}
              </span>
            </span>
            <span
              class="flex"
              v-if="!searchParams.data_type"
            >{{ data.client_data.guest_user.ios.pct_chg_yest }}%&nbsp;
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </span>
          </p>

          <p class="flex_box">
            <span class="flex">
              <IconFont
                class="mr8 fz22"
                type="i-android"
              />
              <span class="fz24">
                {{ data.client_data.guest_user.android.count }}
              </span>
            </span>
            <span
              class="flex"
              v-if="!searchParams.data_type"
            >{{ data.client_data.guest_user.android.pct_chg_yest }}%&nbsp;
              <IconFont
                class="primary_color"
                type="i-up-o"
              />
            </span>
          </p>
        </section>
      </div>
    </a-card>
  </a-spin>
</template>

<script setup>
</script>

<style lang="sass" scoped>
.card_container
  padding: 0 24px
  height: 140px
  font-size: 12px
  background: #FFF4F5
  border-radius: 8px 8px 8px 8px
  text-align: center
  color: #999

  .split_line
    width: 1px
    height: 60px
    background: #E8E8E8

.box
  padding: 24px
  border-radius: 8px
  background: #F8F4FF
  font-size: 12px

  .title
    margin-bottom: 10px
    text-align: center
    border-bottom: 1px solid #ddd
    font-size: 16px
</style>
