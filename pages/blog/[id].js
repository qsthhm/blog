import { useEffect } from 'react'
import { usePost } from '../../lib/swr'
import Head from 'next/head'
import Link from 'next/link'
import { SITE_CONFIG } from '../../constants/site'
import NotionBlock from '../../components/NotionBlock'
import Toc from '../../components/Toc'
import NotFound from '../../components/NotFound'
import { getDatabase, getPage } from '../api/notion'

// 骨架屏组件
function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="py-8">
        <div className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-3/4 mb-4" />
        <div className="flex flex-wrap gap-3">
          <div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded w-24" />
          <div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded w-16" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-full" />
        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-5/6" />
        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-4/6" />
      </div>

      <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg" />

      <div className="space-y-4">
        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-full" />
        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-5/6" />
      </div>
    </div>
  )
}

export default function BlogPost({ id, initialData }) {
  const { post, isLoading, isError } = usePost(id, initialData)

  // 处理锚点跳转
  useEffect(() => {
    const handleHashScroll = () => {
      if (window.location.hash && !isLoading) {
        // 第一次滚动
        setTimeout(() => {
          const hash = decodeURIComponent(window.location.hash.slice(1));
          const element = document.getElementById(hash);
          if (element) {
            const offset = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({
              top: offset,
              behavior: 'smooth'
            });

            // 二次校正，处理图片加载后的位置变化
            setTimeout(() => {
              const finalOffset = element.getBoundingClientRect().top + window.scrollY - 100;
              if (Math.abs(finalOffset - offset) > 10) {
                window.scrollTo({
                  top: finalOffset,
                  behavior: 'smooth'
                });
              }
            }, 1000);
          }
        }, 1000);
      }
    };

    handleHashScroll();

    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [isLoading, post]);

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

  if (isError) return <NotFound />

  return (
    <>
      <Head>
        <title>{post?.title || '加载中...'} - {SITE_CONFIG.name}</title>
        <meta name="description" content={post?.description || ''} />
      </Head>

      <div className="mt-nav">
        <div className="max-w-content mx-auto">
          {isLoading ? (
            <ArticleSkeleton />
          ) : (
            <div className="relative">
              {/* 文章标题和元数据 */}
              <div className="py-8">
                <h1 className="text-page-title font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-neutral-500 dark:text-neutral-400">
                  <time dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-1.5 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 文章内容 */}
              <article className="prose prose-neutral dark:prose-invert max-w-none">
                <div className="js-toc-content">
                  {post.blocks?.map(block => (
                    <NotionBlock key={block.id} block={block} />
                  ))}
                </div>
              </article>

              {/* 返回按钮 */}
              <div className="mt-12">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  返回文章列表
                </Link>
              </div>

              {/* 目录组件 */}
              <Toc />
            </div>
          )}
        </div>
      </div>
    </>
  )
}


// getStaticPaths 和 getStaticProps 保持不变

export async function getStaticPaths() {
  try {
    const posts = await getDatabase(process.env.BLOG_DATABASE_ID)
    
    const paths = posts.map(post => ({
      params: { id: post.id }
    }))

    return {
      paths,
      fallback: 'blocking'
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    return {
      paths: [],
      fallback: 'blocking'
    }
  }
}

export async function getStaticProps({ params }) {
  try {
    const { page, blocks } = await getPage(params.id)

    if (!page || !blocks) {
      return { notFound: true }
    }

    const post = {
      title: page.properties?.标题?.title[0]?.plain_text || '',
      description: page.properties?.描述?.rich_text[0]?.plain_text || '',
      date: page.created_time,
      tags: page.properties?.标签?.multi_select?.map(tag => tag.name) || [],
      blocks: blocks.map(block => ({
        id: block.id,
        type: block.type,
        [block.type]: block[block.type]
      }))
    }

    return {
      props: {
        id: params.id,
        initialData: post
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return { notFound: true }
  }
}