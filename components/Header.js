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
              <svg width="460" height="248" viewBox="0 0 460 248" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M159.61 23.5996C169.84 20.1097 180.84 17.3903 191.67 19.4902C199.9 20.9702 207 26.8103 210.6 34.2803C213.29 40.2003 214.87 46.7005 214.56 53.2305C214.11 66.3603 211.47 79.2805 210.04 92.3203C207.56 108.87 205.8 125.53 203.12 142.06C200.95 155.56 200.66 169.741 194.58 182.271C190.72 190.5 184.85 197.92 177.04 202.72C193.79 201.39 210.52 199.8 227.28 198.71C226.12 206.81 225 214.92 223.85 223.03C153.58 230.19 83.3198 237.49 13 244.22C14.9 234.75 15.9796 225.15 17.3496 215.6C29.6198 214.68 54.1306 212.683 54.1699 212.68C54.2013 212.449 70.4446 92.8896 78.9902 33.1299C89.2702 32.3299 99.5404 31.5798 109.82 30.8398C107.97 42.7098 106.49 54.6302 104.64 66.4902C117.94 47.0302 137.39 31.6096 159.61 23.5996ZM174.53 130.53C162.76 135.3 151.31 140.83 140.04 146.67C122.59 155.88 105.38 165.79 89.5195 177.51C87.8395 188.4 86.3799 199.32 84.8799 210.24C95.4299 209.06 106.04 208.68 116.61 207.78C132.48 206.45 148.341 204.86 164.23 203.82C167.95 179.43 171.36 154.99 174.53 130.53ZM138.82 102.9C134.38 101.55 129.83 103.42 125.51 104.41C116.36 107.08 107.06 109.5 98.1699 112.91C96.3499 125.83 94.8202 138.8 92.9902 151.72C104.37 140.38 116.56 129.89 128.09 118.69C131.74 115.04 135.8 111.76 139.05 107.72C140.28 106.4 140.83 103.771 138.82 102.9ZM175.05 39.8096C167.98 34.4599 158.39 34.7898 150.11 36.4697C133.59 40.5797 119.25 51.1699 108.32 63.9697C106.75 66.2197 104.29 68.2104 104.04 71.1104C103.5 75.7802 102.75 80.43 102.1 85.0898C119.64 83.1298 137.16 80.9304 154.7 78.9404C157.65 78.8304 160.89 77.6402 163.68 79C167.6 82.23 168.25 89.4598 164.18 92.8398C148.91 107.58 132.99 121.62 117.62 136.25C115.18 138.57 112.27 141.23 112.75 144.95C115.33 146.12 118.03 145.06 120.45 144.03C138.37 136.34 156.95 130.33 175.53 124.46C177.28 112.73 178.62 100.93 180.5 89.21C181.9 78.22 184.29 67.17 183.04 56.04C182.4 49.95 180.17 43.5596 175.05 39.8096Z" fill="#333333"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M348.62 150.54C367.69 143.43 388.05 138.68 408.5 139.9C417.84 140.79 428.389 142.3 434.899 149.81C449.563 166.922 425.444 191.032 412.53 200.05C389.38 216.26 360.62 224.2 332.45 222.7C316.931 221.492 298.909 217.458 293.11 201.13C291.64 211.49 290.23 221.86 288.66 232.21C278.47 232.9 268.29 233.87 258.13 234.87C261.88 206.93 266.02 179.03 269.87 151.1C280.09 150.41 290.27 149.27 300.5 148.61C299.1 158.54 297.71 168.48 296.3 178.41C312.34 166.75 330.13 157.62 348.62 150.54ZM418.39 144.61C405.18 140.36 390.95 141.9 377.58 144.58C388.67 143.95 400.57 143.53 410.59 149.1C415.58 151.64 419.43 156.49 420.16 162.11C421.23 169.8 418.269 177.4 414.27 183.83C405.87 197.03 392.809 206.71 378.729 213.16C394.129 208.42 408.43 199.86 419.62 188.25C427 180.18 433.25 169.47 431.57 158.14C430.48 151.36 424.64 146.58 418.39 144.61ZM369.97 165.45C361.55 162.26 352.3 162.85 343.56 164.15C326.74 167.06 310.82 173.79 295.97 182.05C295.22 185.79 294.84 189.59 294.35 193.37C295.85 196.68 297.27 200.16 299.91 202.76C305.45 208.66 313.86 210.48 321.6 211.33C337.02 212.31 353.08 208.36 365.54 199.03C372.59 193.6 379.03 185.47 378.29 176.07C378.06 171.21 374.44 167.08 369.97 165.45Z" fill="#333333"/>
<path d="M412.119 74.1699C411.389 78.7199 410.59 83.2601 409.92 87.8301C388.37 93.1501 366.92 98.8401 345.46 104.54C332.64 108.15 319.66 111.28 306.97 115.35C340.37 112.96 373.75 110.2 407.14 107.61C406.51 112.75 405.68 117.86 405 122.99C360.624 128.395 316.033 132.383 271.56 136.92C272.26 131.28 273.13 125.66 273.84 120.02C307.65 111.58 341.2 102.11 374.92 93.3096C342.15 96.5996 309.549 101.54 276.729 104.33C277.719 98.2401 278.51 92.1295 278.93 85.9795C323.339 82.2495 367.729 78.1799 412.119 74.1699Z" fill="#333333"/>
<path d="M444.431 38.0996C443.521 45.2696 442.78 52.4801 441.36 59.5801C376.27 65.7601 311.18 72.25 246.07 78.29C247.24 70.01 248.481 61.7397 249.471 53.4297C314.441 48.0997 379.451 43.2596 444.431 38.0996Z" fill="#333333"/>
<path d="M402.54 3C392.59 14.6098 379.34 22.8996 365.721 29.5596C350.421 36.9796 333.91 41.5304 317.19 44.3604C326.01 38.9804 334.09 31.8196 339 22.5996C341.31 18.3496 342.42 13.6099 343.44 8.91992C363.14 6.88994 382.86 5.18998 402.54 3Z" fill="#333333"/>
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