import { ScrollView, View } from '@tarojs/components'
import { Empty, Skeleton } from '@nutui/nutui-react-taro'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import emptyImg from '@/assets/empty.png'
import './index.scss'
import Taro from '@tarojs/taro'

interface ScrollableListProps<T> {
  fetchData: (page: number, fetchParams?: Record<string, any>) => Promise<T[]>
  renderItem: (item: T) => JSX.Element
  emptyText?: string
  pageSize?: number
  autoLoad?: boolean
  className?: string
  fetchParams?: Record<string, any>
}

const ScrollableList = forwardRef(<T,>(props: ScrollableListProps<T>, ref) => {
  const {
    fetchData,
    renderItem,
    emptyText = '暂无数据',
    pageSize = 10,
    autoLoad = true,
    className = '',
    fetchParams
  } = props
  const [loading, setLoading] = useState(false)
  const [isSkeletonShow, setIsSkeletonShow] = useState(true)
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const handleFetch = async (isLoadMore = false, extraFetchParams?: Record<string, any>) => {
    if (loading || (isLoadMore && !hasMore)) return
    setLoading(true)
    try {
      const currentPage = isLoadMore ? page : 1
      const list = await fetchData(currentPage, {
        ...extraFetchParams
      })

      if (list.length < pageSize) {
        setHasMore(false)
      }
      setData(prev => isLoadMore ? [...prev, ...list] : list)
      setPage(isLoadMore ? currentPage + 1 : 2)
    } catch (error) {
      console.error('加载数据失败：', error)
    } finally {
      setLoading(false)
      setIsSkeletonShow(false)
    }
  }

  const onScrollToLower = () => {
    if (!hasMore || loading) return
    handleFetch(true, fetchParams)
  }

  const srollToTop = () => {
    Taro.createSelectorQuery()
    .select('#scrollview')
    .node()
    .exec((res) => {
      const scrollView = res[0].node;
      scrollView.scrollTo({
        top: 0,
      });
    })
  }

  useEffect(() => {
    if (autoLoad) {
      srollToTop()
      setPage(1)
      setData([])
      setHasMore(true)
      setIsSkeletonShow(true)
      handleFetch(false, fetchParams)
    }
  }, [fetchParams])

  const refresh = () => {
    setPage(1)
    setData([])
    setHasMore(true)
    setIsSkeletonShow(true)
    handleFetch(false, fetchParams)
  }

  useImperativeHandle(ref, () => ({
    refresh
  }))

  return (
    <ScrollView
      id="scrollview"
      enhanced
      scrollY
      className={`scrollable-list ${className}`}
      onScrollToLower={onScrollToLower}
    >
      <View className='scroll-view-content'>
        <Skeleton rows={10} title animated visible={!isSkeletonShow}>
          {data.length === 0 ? (
            <Empty description={emptyText} image={emptyImg} />
          ) : (
            <>
              {data.map(renderItem)}
              {loading && <View className="loading">加载中...</View>}
              {!hasMore && <View className="no-more">没有更多了</View>}
            </>
          )}
        </Skeleton>
      </View>
    </ScrollView>
  )
})

export default ScrollableList