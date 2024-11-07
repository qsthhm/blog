import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

// 添加路由匹配辅助函数
const isActiveRoute = (pathname, href) => {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(href);
};

export default function Header() {
  const router = useRouter()
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 处理页面加载
  useEffect(() => {
    setMounted(true)
  }, [])

  // 渲染骨架屏
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-content mx-auto px-4">
            <div className="h-nav flex items-center justify-between">
              {/* Logo 骨架 */}
              <div className="w-logo h-logo bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
              
              {/* 桌面端导航骨架 */}
              <div className="hidden md:flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-16 h-8 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" 
                  />
                ))}
              </div>

              {/* 移动端按钮骨架 */}
              <div className="flex items-center gap-2">
                <div className="md:hidden w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  // 获取当前主题
  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-content mx-auto px-4">
          <div className="h-nav flex items-center justify-between">
            <Link href="/" className="w-logo h-logo">
              <svg 
                width="64" 
                height="44" 
                viewBox="0 0 64 44" 
                className="text-neutral-900 dark:text-neutral-100"
              >
                <path d="M24 5H4V39H24V5Z" fill="currentColor" />
                <path 
                  d="M46 36C53.732 36 60 29.732 60 22C60 14.268 53.732 8 46 8C38.268 8 32 14.268 32 22C32 29.732 38.268 36 46 36Z" 
                  fill="currentColor" 
                />
              </svg>
            </Link>

            {/* 导航菜单 */}
            <nav className="hidden md:block">
              <ul className="flex space-x-4">
                {[
                  { href: '/', label: '首页' },
                  { href: '/blog', label: '博客' },
                  { href: '/projects', label: '项目' },
                  { href: '/about', label: '关于' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`px-3 py-2 rounded-lg transition-colors
                        ${isActiveRoute(router.pathname, href)
                          ? 'font-bold text-neutral-900 dark:text-neutral-100' 
                          : 'text-neutral-500 dark:text-neutral-400'}
                        hover:bg-neutral-100 dark:hover:bg-neutral-800`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 按钮组 */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                aria-label="切换菜单"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* 主题切换按钮 */}
              <button
                onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                aria-label="切换深色模式"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {currentTheme === 'light' ? (
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* 移动端菜单 */}
          {isMenuOpen && (
            <nav className="md:hidden py-4">
              <ul className="space-y-2">
                {[
                  { href: '/', label: '首页' },
                  { href: '/blog', label: '博客' },
                  { href: '/projects', label: '项目' },
                  { href: '/about', label: '关于' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2 rounded-lg transition-colors
                        ${isActiveRoute(router.pathname, href)
                          ? 'font-bold text-neutral-900 dark:text-neutral-100' 
                          : 'text-neutral-500 dark:text-neutral-400'}
                        hover:bg-neutral-100 dark:hover:bg-neutral-800`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}