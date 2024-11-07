import BlogCard from './BlogCard'

export default function BlogList({ posts = [] }) {
  return (
    <div className="grid md:grid-cols-2 gap-x-article-gap gap-y-row-gap">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}