import { View } from '@tarojs/components'
import './index.scss'
import { useAuth } from '@/hooks/useAuth'

function Home() {
  useAuth()

  return (
    <View className='home'>
    </View>
  )
}

export default Home 