import { Client } from "@notionhq/client"

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function getDatabase(databaseId) {
  try {
    // 根据数据库 ID 使用不同的查询配置
    const queryOptions = {
      database_id: databaseId,
    }

    // 只有博客数据库需要排序
    if (databaseId === process.env.BLOG_DATABASE_ID) {
      queryOptions.sorts = [
        {
          property: "创建日期",
          direction: "descending",
        },
      ]
    }

    const response = await notion.databases.query(queryOptions)
    
    if (!response || !response.results) {
      throw new Error('Invalid response from Notion API');
    }
    return response.results
  } catch (error) {
    console.error('Error fetching database:', error)
    return []
  }
}

export async function getPage(pageId) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    
    // 获取所有块内容
    let allBlocks = [];
    let hasMore = true;
    let startCursor = undefined;
    
    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
        start_cursor: startCursor,
      });

      const { results, next_cursor, has_more } = response;
      allBlocks = [...allBlocks, ...results];
      
      hasMore = has_more;
      startCursor = next_cursor;
    }

    // 递归获取嵌套块的内容（如果需要）
    const blocksWithChildren = await Promise.all(
      allBlocks.map(async (block) => {
        if (block.has_children) {
          const children = await getBlockChildren(block.id);
          return { ...block, children };
        }
        return block;
      })
    );
    
    if (!page || !blocksWithChildren) {
      throw new Error('Invalid response from Notion API');
    }

    return { page, blocks: blocksWithChildren }
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

// 辅助函数：获取块的子内容
async function getBlockChildren(blockId) {
  try {
    let allBlocks = [];
    let hasMore = true;
    let startCursor = undefined;
    
    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: startCursor,
      });

      const { results, next_cursor, has_more } = response;
      allBlocks = [...allBlocks, ...results];
      
      hasMore = has_more;
      startCursor = next_cursor;
    }

    return allBlocks;
  } catch (error) {
    console.error('Error fetching block children:', error);
    return [];
  }
}

export async function getParameters() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.PARAMETER_DATABASE_ID,
    })
    
    if (!response || !response.results) {
      throw new Error('Invalid response from Notion API');
    }

    const parameters = {}
    response.results.forEach(item => {
      const name = item.properties['名称']?.title[0]?.plain_text
      const content = item.properties['内容']?.rich_text[0]?.plain_text
      if (name) parameters[name] = content
    })
    return parameters
  } catch (error) {
    console.error('Error fetching parameters:', error)
    return {}
  }
}