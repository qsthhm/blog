# 个人博客

基于 Next.js 的个人博客系统。代码均由Claude实现。

## 技术栈:
- Next.js 作为 React 框架
- Notion API 作为内容管理系统
- Tailwind CSS 做样式管理
- SWR 处理数据获取
- next-themes 实现深色模式


## 主要功能:
- 响应式设计
- 深色模式切换
- 文章目录(Tocbot)
- 图片懒加载和放大功能
- 分页功能


## 页面路由结构
- 首页 (pages/index.js)
- 博客列表 (pages/blog/index.js)
- 博客文章页 (pages/blog/[id].js)
- 博客分页 (pages/blog/page/[page].js)
- 项目展示 (pages/projects.js)
- 关于页面 (pages/about.js)


## Notion API 集成:
- notion.js 处理与Notion的数据交互
- 使用@notionhq/client库访问Notion API
- 实现了获取数据库内容(getDatabase)和页面内容(getPage)的功能


## 数据获取与缓存:
- 使用SWR进行数据请求和缓存管理
- lib/swr.js中封装了各种数据hooks
- 实现了数据预加载和缓存更新策略


## 性能优化:
- NotionBlock 组件灵活处理各种 Notion 内容块
- 使用 ErrorBoundary 处理全局错误
- 使用 ISR(增量静态再生成)
- 图片懒加载
- 组件骨架屏
- SWR 数据缓存
- Intersection Observer 实现滚动加载