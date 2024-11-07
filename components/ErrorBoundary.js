import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SITE_CONFIG } from '../constants/site'

// 分离错误页面组件以使用 hooks
function ErrorPage({ onReset }) {
  const router = useRouter()

  const handleRefresh = () => {
    onReset() // 重置错误状态
    window.location.reload() // 刷新页面
  }

  const handleHomeClick = async () => {
    onReset() // 重置错误状态
    await router.push('/')
  }

  return (
    <>
      <Head>
        <title>出错了 - {SITE_CONFIG.name}</title>
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
            抱歉，出现了一些问题
          </h2>
          <p className="mb-8 text-neutral-500 dark:text-neutral-400">
            我们将尽快修复这个问题
          </p>
          <div className="space-x-4">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              刷新页面
            </button>
            <button
              onClick={handleHomeClick}
              className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage onReset={this.handleReset} />
    }

    return this.props.children
  }
}

export default ErrorBoundary