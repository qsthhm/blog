import { useAboutPage } from '../lib/swr'
import Head from 'next/head'
import NotionBlock from '../components/NotionBlock'
import { SITE_CONFIG } from '../constants/site'
import { getPage, getParameters } from './api/notion'

function AboutSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-neutral-100 dark:bg-neutral-800 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export default function About({ initialData, description }) {
  const { content, isLoading, isError } = useAboutPage(initialData)

  if (isError) {
    return <div>加载失败</div>
  }

  return (
    <>
      <Head>
        <title>关于 - {SITE_CONFIG.name}</title>
      </Head>

      <div className="mt-nav">
        <div className="py-8">
          <h1 className="text-page-title font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
            关于
          </h1>
          <p className="text-neutral-500 dark:text-neutral-500">
            {description}
          </p>
        </div>

        {isLoading ? (
          <AboutSkeleton />
        ) : (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content?.blocks?.map(block => (
              <NotionBlock key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const [pageData, parameters] = await Promise.all([
      getPage(process.env.ABOUT_PAGE_ID),
      getParameters()
    ])
    
    if (!pageData) {
      return { notFound: true }
    }

    return {
      props: {
        initialData: pageData,
        description: parameters['关于页说明'] || '',
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return { notFound: true }
  }
}