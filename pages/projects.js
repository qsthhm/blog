import { useProjects } from '../lib/swr'
import Head from 'next/head'
import { SITE_CONFIG } from '../constants/site'
import { getDatabase, getParameters } from './api/notion'

// 项目卡片骨架屏
function ProjectSkeleton() {
  return (
    <div className="space-y-row-gap">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-row-reverse gap-6 py-8">
          <div className="relative aspect-square w-32 md:w-[152px] shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="flex-grow py-1 space-y-3">
            <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-2/3" />
            <div className="space-y-2">
              <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Projects({ initialData, description }) {
  const { projects, isLoading, isError } = useProjects(initialData)

  if (isError) {
    return <div>加载失败</div>
  }

  return (
    <>
      <Head>
        <title>项目 - {SITE_CONFIG.name}</title>
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
          <div className="space-y-0">
            {projects.map((project) => {
              const ProjectWrapper = project.link ? 
                ({ children }) => (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    {children}
                  </a>
                ) : 
                ({ children }) => <>{children}</>;

              return (
                <ProjectWrapper key={project.id}>
                  <article className="flex flex-row-reverse gap-6 py-8">
                    <div className="relative aspect-square w-32 md:w-[152px] shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={project.thumbnail || '/img/default.webp'}
                        alt={project.title}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        loading="lazy"
                        decoding="async"
                        onLoad={e => e.target.classList.add('opacity-100')}
                        style={{ opacity: 0 }}
                      />
                    </div>
                    <div className="flex-grow py-1 space-y-3">
                      <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
                        {project.title}
                      </h2>
                      <p className="text-base text-neutral-500 dark:text-neutral-400">
                        {project.description}
                      </p>
                      
                      {project.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-1.5 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </ProjectWrapper>
              );
            })}
          </div>
        )}
      </div>
    </>
  )
}

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
      link: project.properties?.['链接']?.url || ''
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