import { getMerchantListReq } from '@/api/public'

/**
 *
 * @param {*} loading  ref(boolean)
 * @returns
 */
export default function(loading) {
  const { createDialog } = useDialog()

  // 展示商户列表
  async function openMerchantModal(guild_id) {
    const data = await getMerchantList(guild_id)
    createDialog({
      width: 500,
      footer: null,
      component: () =>
        <div v-if={data.items}>
          <div class="dialog_item_list" v-for={(item, index) in data.items} key={index}>
            {item.merch_name}
          </div>
        </div>
      ,
    })
  }

  async function getMerchantList(guild_id) {
    // 判断 loading 是否为 ref 变量
    if (isRef(loading)) {
      loading.value = true
    }
    try {
      const data = await getMerchantListReq({ guild_id })
      return data
    } catch(error) {
      throw new Error(error)
    } finally {
      if (isRef(loading)) {
        loading.value = false
      }
    }
  }

  const customRender = {
    title: '展示商户',
    dataIndex: 'merch_rel',
    customRender: ({ record }) =>
      <div>
        <p v-if={record.merch_rel?.is_all}>所有商户</p>
        <p v-else-if={record.merch_rel?.count}>
          <span v-if={record.merch_rel.count === 1}>
            {record.merch_rel?.sample_data?.merch_name}
          </span>
          <a-button
            v-else-if={record.merch_rel.count > 1}
            type="link"
            size="small"
            onClick={() => openMerchantModal(record.guild_id)}
          >
            {record.merch_rel?.count || 0}个商户
          </a-button>
        </p>
        <span v-else>--</span>
      </div>
  }

  return {
    customRender,
    getMerchantList,
  }
}
