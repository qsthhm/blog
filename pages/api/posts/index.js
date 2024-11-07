import { getDatabase } from '../notion' // 修改这里，因为notion.js在api目录下

export default async function handler(req, res) {
  try {
    const { page = 1 } = req.query
    const posts = await getDatabase(process.env.BLOG_DATABASE_ID)
    
    const POSTS_PER_PAGE = 10
    const totalPosts = posts.length
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
    
    const startIndex = (page - 1) * POSTS_PER_PAGE
    const endIndex = startIndex + POSTS_PER_PAGE
    
    const paginatedPosts = posts.slice(startIndex, endIndex).map(post => ({
      id: post.id,
      title: post.properties?.标题?.title[0]?.plain_text || '',
      cover: post.properties?.缩略图?.files[0]?.file?.url || '',
      date: post.created_time,
      tags: post.properties?.标签?.multi_select?.map(tag => tag.name) || []
    }))

    res.status(200).json({
      posts: paginatedPosts,
      totalPages
    })
  } catch (error) {
    console.error('Error in API route:', error)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
}