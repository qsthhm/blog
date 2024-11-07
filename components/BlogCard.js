import Link from 'next/link'
import { useState, useRef } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

export default function BlogCard({ post }) {
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const cardRef = useRef(null)
  const isInView = useIntersectionObserver(cardRef)

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    } catch (error) {
      console.error('Date formatting error:', error)
      return dateString
    }
  }

  return (
    <article 
      className="lex flex-col transition-all duration-100 rounded-md
      hover:bg-neutral-50 hover:shadow-[0_0_0_10px_#fafafa]
      dark:hover:bg-neutral-800/50 dark:hover:shadow-[0_0_0_10px_rgba(38,38,38,0.5)]"
      ref={cardRef}
    >
      <Link href={`/blog/${post.id}`} className="block group flex-1 flex flex-col">
        {/* 图片容器 */}
        <div className="relative aspect-thumbnail mb-4 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
          {/* 加载骨架屏 */}
          {isLoading && !imageError && (
            <div className="absolute inset-0">
              <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            </div>
          )}
          
          {/* 只在视口中加载图片 */}
          {isInView && (
            <img
              src={post.cover || '/img/default.webp'}
              alt={post.title || ''}
              className={`w-full h-full object-cover transition-all duration-300 ease-in-out
                ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
                group-hover:scale-105`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
                setImageError(true)
              }}
              loading="lazy"
            />
          )}
          
          {/* 图片加载错误显示的占位图 */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 dark:bg-neutral-700">
              <svg 
                className="w-8 h-8 text-neutral-400 dark:text-neutral-500" 
                fill="none" 
                strokeWidth="1.5" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
                />
              </svg>
            </div>
          )}
        </div>
        
        {/* 文章内容 */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-article-title font-medium mb-3 line-clamp-2 text-neutral-900 dark:text-neutral-100">
            {post.title || '无标题'}
          </h2>
          <div className="flex items-center justify-between mt-auto text-sm text-neutral-500 dark:text-neutral-500">
            <time dateTime={post.date} className="shrink-0">
              {formatDate(post.date)}
            </time>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 ml-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}