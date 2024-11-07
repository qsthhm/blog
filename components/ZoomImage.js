import { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function ZoomImage({ src, alt }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0">
          <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-lg" />
        </div>
      )}
      
      <Zoom 
        zoomMargin={40}
        closeText="关闭"
        TransitionProps={{
          timeout: {
            enter: 300,
            exit: 0
          }
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full rounded-lg"
          onLoad={() => setIsLoading(false)}
          loading="lazy"
        />
      </Zoom>
    </div>
  )
}