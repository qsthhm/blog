import { useProjects } from '../lib/swr'
import Head from 'next/head'
import { useState, useCallback } from 'react'
import { SITE_CONFIG } from '../constants/site'
import { getDatabase, getParameters } from './api/notion'

// 项目卡片骨架屏
function ProjectSkeleton() {
 return (
   <div className="space-y-6">
     {[1, 2, 3].map((i) => (
       <div key={i} className="flex flex-row-reverse gap-6 py-4">
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

function MobileConfirmDialog({ url, onClose }) {
 return (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
     <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
       <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
         <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
           确认跳转
         </h3>
         <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
           是否前往 {url}
         </p>
       </div>
       <div className="p-4 flex justify-end space-x-2">
         <button
           onClick={onClose}
           className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
         >
           取消
         </button>
         <button
           onClick={() => {
             window.open(url, '_blank');
             onClose();
           }}
           className="px-4 py-2 text-sm text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
         >
           确定前往
         </button>
       </div>
     </div>
   </div>
 );
}

export default function Projects({ initialData, description }) {
 const { projects, isLoading, isError } = useProjects(initialData)
 const [confirmUrl, setConfirmUrl] = useState(null)
 const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

 const handleProjectClick = useCallback((e, url) => {
   if (isMobile) {
     e.preventDefault()
     setConfirmUrl(url)
   }
 }, [isMobile])

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
         <div className="space-y-6">
           {projects.map((project) => {
             const ProjectWrapper = project.link ? 
               ({ children }) => (
                 <a 
                   href={project.link} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   onClick={(e) => handleProjectClick(e, project.link)}
                   className="group block hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors relative"
                 >
                   {children}
                   <div className="hidden md:group-hover:flex items-center absolute top-4 right-4 text-sm text-neutral-500 dark:text-neutral-400">
                     <svg
                       className="w-4 h-4 mr-1"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor"
                     >
                       <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         strokeWidth={2}
                         d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                       />
                     </svg>
                     打开 {project.link}
                   </div>
                 </a>
               ) : 
               ({ children }) => <>{children}</>;

             return (
               <ProjectWrapper key={project.id}>
                 <article className="flex flex-row-reverse gap-6 py-4">
                   <div className="relative aspect-square w-32 md:w-[152px] shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                     <img
                       src={project.thumbnail || '/img/default.webp'}
                       alt={project.title}
                       className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
                       loading="lazy"
                       decoding="async"
                       onLoad={e => e.target.classList.remove('opacity-0')}
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

     {confirmUrl && (
       <MobileConfirmDialog
         url={confirmUrl}
         onClose={() => setConfirmUrl(null)}
       />
     )}
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