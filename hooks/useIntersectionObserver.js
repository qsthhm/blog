import { useState, useEffect } from 'react'

export function useIntersectionObserver(ref, options = {}) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    // 检查参数和环境
    if (!ref?.current || typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsInView(true)
      return
    }

    try {
      const observer = new IntersectionObserver(([entry]) => {
        setIsInView(entry.isIntersecting)
        if (entry.isIntersecting) {
          observer.unobserve(entry.target)
        }
      }, {
        rootMargin: '200% 0px', // 提前2屏开始加载
        threshold: 0.1,
        ...options
      })

      observer.observe(ref.current)

      return () => {
        observer.disconnect()
      }
    } catch (error) {
      console.error('IntersectionObserver error:', error)
      setIsInView(true)
    }
  }, [ref, options])

  return isInView
}