import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {/* 404文字 */}
      <div className="relative">
        <h1 className="text-[12rem] font-bold text-neutral-100 dark:text-neutral-800 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-48 h-48 text-neutral-200 dark:text-neutral-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={0.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* 错误信息 */}
      <div className="text-center -mt-8">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          页面不存在
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          抱歉，您访问的页面未找到
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 rounded-lg text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <svg 
            className="mr-2 w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          返回首页
        </Link>
      </div>
    </div>
  );
}