import { useProjects } from '../lib/swr'
import Head from 'next/head'
import { useState } from 'react'
import { SITE_CONFIG } from '../constants/site'
import { getDatabase, getParameters } from './api/notion'

// 项目卡片组件
function ProjectCard({ project }) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  return (
    <article className="group">
      <div className="flex flex-col md:flex-row-reverse gap-6 py-8">
        {/* 项目图片 */}
        <div className="relative aspect-video md:aspect-square w-full md:w-[200px] shrink-0">
          <div className="w-full h-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
            {imageLoading && !imageError && (
              <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-700" />
            )}
            <img
              src={project.thumbnail || '/img/default.webp'}
              alt={project.title}
              className={`w-full h-full object-cover transition duration-300 
                ${imageLoading ? 'opacity-0' : 'opacity-100'}
                ${project.link ? 'group-hover:scale-105' : ''}`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false)
                setImageError(true)
              }}
              loading="lazy"
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 项目信息 */}
        <div className="flex-grow space-y-4">
          <div>
            {project.link ? (
              <a 
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
              >
                <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                  {project.title}
                  <svg
                    className="inline-block w-4 h-4 ml-1 -mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </h2>
              </a>
            ) : (
              <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
                {project.title}
              </h2>
            )}
            <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
              {project.description}
            </p>
          </div>

          {/* 项目标签 */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

// 骨架屏组件优化
function ProjectSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col md:flex-row-reverse gap-6 py-8">
          <div className="relative aspect-video md:aspect-square w-full md:w-[200px] shrink-0">
            <div className="w-full h-full rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          </div>
          <div className="flex-grow space-y-4">
            <div className="space-y-2">
              <div className="h-7 bg-neutral-100 dark:bg-neutral-800 rounded-md w-2/3 animate-pulse" />
              <div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded-md w-full animate-pulse" />
              <div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded-md w-4/5 animate-pulse" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-7 w-16 bg-neutral-100 dark:bg-neutral-800 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 主页面组件
export default function Projects({ initialData, description }) {
  const { projects, isLoading, isError } = useProjects(initialData)

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
        <title>项目 - {SITE_CONFIG.name}</title>
        <meta name="description" content={description || '这里展示了我的一些个人项目'} />
      </Head>

      <div className="mt-nav">
        <div className="py-8">
          <h1 className="text-page-title font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
            项目
          </h1>
          <p className="text-neutral-500 dark:text-neutral-500">
            {description || '这里展示了我的一些个人项目'}
          </p>
        </div>

        {isLoading ? (
          <ProjectSkeleton />
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// 修改 getStaticProps 以支持项目链接
export async function getStaticProps() {
  try {
    const [projects, parameters] = await Promise.all([
      getDatabase(process.env.PROJECTS_DATABASE_ID),
      getParameters()
    ])

    const projectsData = projects?.map(project => ({
      id: project.id,
      title: project.properties?.['名称']?.title?.[0]?.plain_text || '',
      description: project.properties?.['描述']?.rich_text?.[0]?.plain_text || '',
      thumbnail: 
        project.properties?.['缩略图']?.files?.[0]?.file?.url || 
        project.properties?.['缩略图']?.files?.[0]?.external?.url || '',
      tags: project.properties?.['标签']?.multi_select?.map(tag => tag.name) || [],
      link: project.properties?.['链接']?.url || '' // 添加链接支持
    })) || []

    return {
      props: {
        initialData: { projects: projectsData },
        description: parameters['项目页说明'] || '',
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      props: {
        initialData: { projects: [] },
        description: '',
      }
    }
  }
}