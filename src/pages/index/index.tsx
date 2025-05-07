import { View } from '@tarojs/components'
import './index.scss'
import { useAuth } from '@/hooks/useAuth'

function Home() {
  useAuth()

  return (
    <View className='home'>
      <div style={{ color: '#fff' }}>加载中...</div>
    </View>
  )
}

export default Home 