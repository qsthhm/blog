import { usePosts } from '../../../lib/swr'
import Head from 'next/head'
import Link from 'next/link'
import BlogList from '../../../components/BlogList'
import { SITE_CONFIG } from '../../../constants/site'
import { getDatabase, getParameters } from '../../api/notion'
import { POSTS_PER_PAGE } from '../index'

export default function BlogPage({ page, initialData, description }) {
  // 注意这里，确保 page 是数字类型
  const pageNumber = parseInt(page, 10)
  const { posts, totalPages, isLoading, isError } = usePosts(pageNumber, initialData)

  // 如果页码无效，显示错误信息
  if (pageNumber < 1 || (totalPages && pageNumber > totalPages)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-neutral-500 dark:text-neutral-400">
        页面不存在
      </div>
    )
  }

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
        <title>博客 - 第 {pageNumber} 页 - {SITE_CONFIG.name}</title>
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

        {isLoading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <BlogList posts={posts} />
            
            <div className="h-[68px] flex justify-center items-center">
              <nav className="flex items-center gap-1">
                <Link
                  href={pageNumber === 2 ? '/blog' : `/blog/page/${pageNumber - 1}`}
                  className="px-4 py-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  上一页
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <Link
                    key={num}
                    href={num === 1 ? '/blog' : `/blog/page/${num}`}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      num === pageNumber
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {num}
                  </Link>
                ))}

                {pageNumber < totalPages && (
                  <Link
                    href={`/blog/page/${pageNumber + 1}`}
                    className="px-4 py-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    下一页
                  </Link>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export async function getStaticPaths() {
  try {
    const posts = await getDatabase(process.env.BLOG_DATABASE_ID)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    
    const paths = Array.from(
      { length: Math.max(0, totalPages - 1) }, 
      (_, i) => ({
        params: { page: String(i + 2) }
      })
    )

    return { paths, fallback: 'blocking' }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    return { paths: [], fallback: 'blocking' }
  }
}

export async function getStaticProps({ params }) {
  try {
    const page = parseInt(params.page, 10)
    const [posts, parameters] = await Promise.all([
      getDatabase(process.env.BLOG_DATABASE_ID),
      getParameters()
    ])

    const totalPosts = posts.length
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

    if (page < 1 || page > totalPages) {
      return { notFound: true }
    }

    const startIndex = (page - 1) * POSTS_PER_PAGE
    const endIndex = startIndex + POSTS_PER_PAGE
    
    const pageData = posts.slice(startIndex, endIndex).map(post => ({
      id: post.id,
      title: post.properties?.标题?.title[0]?.plain_text || '',
      cover: post.properties?.缩略图?.files[0]?.file?.url || '',
      date: post.created_time,
      tags: post.properties?.标签?.multi_select?.map(tag => tag.name) || []
    }))

    return {
      props: {
        page,
        initialData: {
          posts: pageData,
          totalPages,
        },
        description: parameters['博客页说明'] || '',
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return { notFound: true }
  }
}