import { usePosts } from '../../lib/swr'
import Head from 'next/head'
import Link from 'next/link'
import BlogList from '../../components/BlogList'
import { SITE_CONFIG } from '../../constants/site'
import { getDatabase, getParameters } from '../api/notion'

export const POSTS_PER_PAGE = 2

export default function Blog({ initialData, description }) {
  const { posts, totalPages, isLoading, isError } = usePosts(1, initialData)
  const hasNextPage = totalPages > 1

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-neutral-500 dark:text-neutral-400">
        获取数据失败，请稍后重试
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>博客 - {SITE_CONFIG.name}</title>
        <meta name="description" content={description || '分享我的想法和经验'} />
      </Head>

      <div className="mt-nav space-y-row-gap">
        <div className="py-8">
          <h1 className="text-page-title font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
            博客
          </h1>
          <p className="text-neutral-500 dark:text-neutral-500">
            {description || '分享我的想法和经验'}
          </p>
        </div>

        {posts.length > 0 ? (
          <>
            <BlogList posts={posts} />
            
            {hasNextPage && (
              <div className="h-[68px] flex justify-center items-center">
                <Link
                  href="/blog/page/2"
                  className="inline-flex items-center px-4 py-2 rounded-lg 
                    text-neutral-500 dark:text-neutral-400 
                    hover:bg-neutral-100 dark:hover:bg-neutral-800 
                    transition-colors"
                >
                  查看更多文章
                  <svg 
                    className="ml-2 w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[50vh] text-neutral-500 dark:text-neutral-400">
            暂无文章
          </div>
        )}
      </div>
    </>
  )
}

// getStaticProps 保持不变...

export async function getStaticProps() {
  try {
    const [allPosts, parameters] = await Promise.all([
      getDatabase(process.env.BLOG_DATABASE_ID),
      getParameters()
    ])

    const totalPosts = allPosts.length
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

    const posts = allPosts
      .slice(0, POSTS_PER_PAGE)
      .map(post => ({
        id: post.id,
        title: post.properties?.标题?.title[0]?.plain_text || '',
        cover: post.properties?.缩略图?.files[0]?.file?.url || '',
        date: post.created_time,
        tags: post.properties?.标签?.multi_select?.map(tag => tag.name) || []
      }))

    // 提供初始数据给 SWR
    return {
      props: {
        initialData: {
          posts,
          totalPages,
        },
        description: parameters['博客页说明'] || '',
      },
      revalidate: 60 // ISR: 每分钟重新生成页面
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      props: {
        initialData: {
          posts: [],
          totalPages: 0,
        },
        description: '',
      },
      revalidate: 60
    }
  }
}