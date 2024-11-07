import { getDatabase } from './notion'

export default async function handler(req, res) {
  try {
    const projects = await getDatabase(process.env.PROJECTS_DATABASE_ID)
    
    const projectsData = projects?.map(project => ({
      id: project.id,
      title: project.properties?.['名称']?.title?.[0]?.plain_text || '',
      description: project.properties?.['描述']?.rich_text?.[0]?.plain_text || '',
      thumbnail: 
        project.properties?.['缩略图']?.files?.[0]?.file?.url || 
        project.properties?.['缩略图']?.files?.[0]?.external?.url || '',
      tags: project.properties?.['标签']?.multi_select?.map(tag => tag.name) || []
    })) || []

    res.status(200).json({ projects: projectsData })
  } catch (error) {
    console.error('Error in API route:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
}