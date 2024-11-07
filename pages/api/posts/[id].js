import { getPage } from '../notion' // 修改这里，因为notion.js在api目录下

export default async function handler(req, res) {
  try {
    const { id } = req.query
    const { page, blocks } = await getPage(id)
    
    if (!page || !blocks) {
      return res.status(404).json({ error: 'Post not found' })
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

    res.status(200).json(post)
  } catch (error) {
    console.error('Error in API route:', error)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
}