export default function Footer({ copyright }) {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="mt-auto py-8">
      <div className="max-w-content mx-auto px-4">
        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          {copyright ? (
            <p>{copyright}</p>
          ) : (
            <p>© {currentYear} 且言. All rights reserved.</p>
          )}
        </div>
      </div>
    </footer>
  )
}