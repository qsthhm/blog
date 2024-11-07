import useSWR from 'swr'

// 基础 fetcher 函数
const fetcher = async (url) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  return res.json()
}

// 博客文章列表
export function usePosts(page = 1, fallbackData) {
  const { data, error, isLoading } = useSWR(
    `/api/posts?page=${page}`,
    fetcher,
    {
      fallbackData,
      dedupingInterval: 1000 * 60 * 5, // 5分钟缓存
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  )

  return {
    posts: data?.posts || [],
    totalPages: data?.totalPages || 0,
    isLoading,
    isError: error
  }
}

// 单篇文章
export function usePost(id, fallbackData) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/posts/${id}` : null,
    fetcher,
    {
      fallbackData,
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  )

  return {
    post: data,
    isLoading,
    isError: error
  }
}

// 项目列表
export function useProjects(fallbackData) {
  const { data, error, isLoading } = useSWR(
    '/api/projects',
    fetcher,
    {
      fallbackData,
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  )

  return {
    projects: data?.projects || [],
    isLoading,
    isError: error
  }
}

// 关于页面
export function useAboutPage(fallbackData) {
  const { data, error, isLoading } = useSWR(
    '/api/about',
    fetcher,
    {
      fallbackData,
      dedupingInterval: 1000 * 60 * 5,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  )

  return {
    content: data,
    isLoading,
    isError: error
  }
}

// 预加载函数
export function preloadPosts() {
  const url = '/api/posts?page=1'
  // @ts-ignore
  if (!cache.has(url)) {
    // @ts-ignore
    mutate(url, fetcher(url))
  }
}