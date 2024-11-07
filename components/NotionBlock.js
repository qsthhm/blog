import { useState, useRef } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import ZoomImage from './ZoomImage'

function TextBlock({ text }) {
  if (!text) return null;
  
  return text.map((value, i) => {
    // 处理链接
    const isLink = !!value.href;
    const content = (
      <span key={i} className={`
        ${value.annotations.bold ? 'font-semibold text-neutral-900 dark:text-neutral-100' : ''}
        ${value.annotations.italic ? 'italic' : ''}
        ${value.annotations.strikethrough ? 'line-through' : ''}
        ${value.annotations.underline ? 'underline' : ''}
        ${value.annotations.code ? 'px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 font-mono text-sm rounded' : ''}
      `}>
        {value.plain_text}
      </span>
    );

    // 如果是链接，则包装在 a 标签中
    if (isLink) {
      return (
        <a 
          key={i}
          href={value.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {content}
        </a>
      );
    }

    return content;
  });
}

function NotionImage({ url, caption }) {
  const imageRef = useRef(null)
  const isInView = useIntersectionObserver(imageRef, {
    rootMargin: '200% 0px' // 提前2屏加载图片
  })

  return (
    <figure className="my-8" ref={imageRef}>
      {isInView && (
        <ZoomImage src={url} alt={caption || ""} />
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function NotionBlock({ block }) {
  if (!block) return null;
  
  const { type, id } = block;

  const generateHeadingId = (text) => {
    if (!text || !text[0]?.plain_text) return '';
    return text[0].plain_text;
  };

  const renderHeading = (level) => {
    const HeadingTag = `h${level}`;
    const headingText = block[`heading_${level}`].rich_text;
    const headingId = generateHeadingId(headingText);
    
    return (
      <HeadingTag 
        id={headingId}
        className="scroll-mt-24 heading heading-${level} font-bold mb-4 mt-6 group relative"
      >
        <a 
          href={`#${encodeURIComponent(headingId)}`}
          className="
            text-neutral-900 dark:text-neutral-100 
            no-underline 
            hover:no-underline
            after:content-['#']
            after:absolute 
            after:opacity-0
            after:ml-2
            after:text-neutral-400
            dark:after:text-neutral-500
            group-hover:after:opacity-100
            after:transition-opacity
            after:duration-200
          "
        >
          <TextBlock text={headingText} />
        </a>
      </HeadingTag>
    );
  };

  switch (type) {
    case 'paragraph':
      return (
        <p className="mb-4 text-lg leading-paragraph text-neutral-800 dark:text-neutral-300">
          <TextBlock text={block[type].rich_text} />
        </p>
      );
      
    case 'heading_1':
      return renderHeading(1);

    case 'heading_2':
      return renderHeading(2);

    case 'heading_3':
      return renderHeading(3);

    case 'bulleted_list_item':
      return (
        <ul className="list-disc pl-6 mb-4 text-lg text-neutral-800 dark:text-neutral-300">
          <li>
            <TextBlock text={block[type].rich_text} />
          </li>
        </ul>
      );

    case 'numbered_list_item':
      return (
        <ol className="list-decimal pl-6 mb-4 text-lg text-neutral-800 dark:text-neutral-300">
          <li>
            <TextBlock text={block[type].rich_text} />
          </li>
        </ol>
      );

    case 'code':
      return (
        <pre className="my-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-x-auto whitespace-pre-wrap break-all">
          <code className="text-base font-mono text-neutral-800 dark:text-neutral-200">
            <TextBlock text={block[type].rich_text} />
          </code>
        </pre>
      );

    case 'image':
      const imageUrl = block.image.file?.url || block.image.external?.url;
      const caption = block.image.caption?.[0]?.plain_text;
      return imageUrl ? (
        <NotionImage url={imageUrl} caption={caption} />
      ) : null;

    case 'quote':
      return (
        <blockquote className="pl-4 border-l-4 border-neutral-200 dark:border-neutral-700 my-6 text-lg italic text-neutral-800 dark:text-neutral-300">
          <TextBlock text={block[type].rich_text} />
        </blockquote>
      );

    case 'divider':
      return <hr className="my-10 border-neutral-200 dark:border-neutral-800" />;

    default:
      return null;
  }
}