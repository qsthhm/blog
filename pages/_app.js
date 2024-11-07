import { useEffect, useState } from 'react'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import ErrorBoundary from '../components/ErrorBoundary'
import ThirdPartyScripts from '../components/ThirdPartyScripts'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import { SITE_CONFIG } from '../constants/site'
import { getParameters } from '../pages/api/notion'
import '../styles/globals.css'  // 确保这行存在

// SWR 配置
const swrConfig = {
  fetcher: async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
      const error = new Error('API request failed')
      error.status = res.status
      throw error
    }
    return res.json()
  },
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  shouldRetryOnError: true,
  dedupingInterval: 2000,
  errorRetryCount: 3,
  onError: (error, key) => {
    if (error.status === 404) {
      // 处理404错误
      console.error('API not found:', key)
    } else {
      // 处理其他错误
      console.error('API error:', error)
    }
  }
}

function MyApp({ Component, pageProps, footerCopyright }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 处理路由加载状态
  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  // 处理水合
  useEffect(() => {
    setMounted(true)
  }, [])

  // 获取当前页面的自定义标题
  const pageTitle = pageProps.title 
    ? `${pageProps.title} - ${SITE_CONFIG.name}`
    : SITE_CONFIG.name

  return (
    <ErrorBoundary>
      <SWRConfig value={swrConfig}>
        <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
          <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
            <Head>
              <title>{pageTitle}</title>
              <meta name="description" content={SITE_CONFIG.description} />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />
              
              {/* 预连接第三方域名 */}
              <link rel="preconnect" href="https://cloud.umami.is" />
            </Head>

            {/* 加载进度条 */}
            {isLoading && (
              <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 dark:bg-neutral-100 animate-pulse z-50" />
            )}

            {/* 导航区域 */}
            <Header />

            {/* 主内容区域 */}
            <main className="flex-grow">
              <div className="max-w-content mx-auto px-4 py-8">
                {mounted ? (
                  <Component {...pageProps} />
                ) : (
                  // 加载状态骨架屏
                  <div className="animate-pulse">
                    <div className="h-8 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-2/3 mb-8"></div>
                    <div className="space-y-4">
                      <div className="h-48 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                      <div className="h-48 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* 底部区域 */}
            <Footer copyright={footerCopyright} />

            {/* 返回顶部按钮 */}
            {mounted && <BackToTop />}

            {/* 第三方脚本 */}
            <ThirdPartyScripts />
          </div>
        </ThemeProvider>
      </SWRConfig>
    </ErrorBoundary>
  )
}

// 获取全局属性
MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {}

  try {
    // 如果页面有自己的 getInitialProps
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // 获取全局参数
    const parameters = await getParameters()
    const footerCopyright = parameters['全局底部'] || ''

    return { 
      pageProps,
      footerCopyright
    }
  } catch (error) {
    console.error('Error in _app.js:', error)
    // 返回基本的props，确保应用不会崩溃
    return { 
      pageProps,
      footerCopyright: ''
    }
  }
}

export default MyApp