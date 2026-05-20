import { View, Text } from '@tarojs/components'

/** 店端设备为未绑定态时提示：微信 openid 绑定须车主自行完成，巡检照常 */
export function UnboundNoticeBanner() {
  return (
    <View className='section unbound-notice-banner'>
      <View className='warn'>
        <Text>
          当前设备在系统中为「未绑定」状态。微信端用户绑定须车主自行完成，工程师可继续完成下方版本、里程、碰撞等检测项。
        </Text>
      </View>
    </View>
  )
}
