import { ScrollView, View } from '@tarojs/components'
import { Empty, Skeleton } from '@nutui/nutui-react-taro'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import './index.scss'

interface ScrollableListProps<T> {
  fetchData: (page: number) => Promise<T[]>
  renderItem: (item: T) => JSX.Element
  emptyText?: string
  pageSize?: number
  autoLoad?: boolean
  className?: string
}

const ScrollableList = forwardRef(<T,>(props: ScrollableListProps<T>, ref) => {
  const {
    fetchData,
    renderItem,
    emptyText = '暂无数据',
    pageSize = 10,
    autoLoad = true,
    className = ''
  } = props

  const [loading, setLoading] = useState(false)
  const [isSkeletonShow, setIsSkeletonShow] = useState(true)
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const handleFetch = async (isLoadMore = false) => {
    if (loading || (isLoadMore && !hasMore)) return
    setLoading(true)
    try {
      const currentPage = isLoadMore ? page : 1
      const list = await fetchData(currentPage)

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
    handleFetch(true)
  }

  useEffect(() => {
    if (autoLoad) {
      handleFetch()
    }
  }, [])

  const refresh = () => {
    setData([])
    setPage(1)
    setHasMore(true)
    setIsSkeletonShow(true)
    handleFetch()
  }

  useImperativeHandle(ref, () => ({
    refresh
  }))

  return (
    <ScrollView
      scrollY
      className={`scrollable-list ${className}`}
      onScrollToLower={onScrollToLower}
    >
      <View className='scroll-view-content'>
        <Skeleton rows={10} title animated visible={!isSkeletonShow}>
          {data.length === 0 ? (
            <Empty description={emptyText} />
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