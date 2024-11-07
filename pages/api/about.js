import { getPage } from './notion'

export default async function handler(req, res) {
  try {
    const data = await getPage(process.env.ABOUT_PAGE_ID)
    
    if (!data || !data.page || !data.blocks) {
      return res.status(404).json({ error: 'About page not found' })
    }

    const content = {
      title: data.page.properties?.标题?.title[0]?.plain_text || '',
      blocks: data.blocks.map(block => ({
        id: block.id,
        type: block.type,
        [block.type]: block[block.type]
      }))
    }

    res.status(200).json(content)
  } catch (error) {
    console.error('Error in API route:', error)
    res.status(500).json({ error: 'Failed to fetch about page' })
  }
}