import { useEffect, useState } from 'react';
import tocbot from 'tocbot';

export default function Toc() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);  // 添加mounted状态
  const [hasToc, setHasToc] = useState(false);   // 保留hasToc状态

  // tocbot 配置
  const tocbotOptions = {
    tocSelector: '.js-toc',
    contentSelector: '.js-toc-content',
    headingSelector: 'h1, h2, h3',
    hasInnerContainers: true,
    headingsOffset: 100,
    scrollSmoothOffset: -100,
    collapseDepth: 6,
    activeLinkClass: 'is-active-link',
    listClass: 'toc-list',
    isCollapsedClass: 'is-collapsed',  
    collapsibleClass: 'is-collapsible',
    listItemClass: 'toc-list-item',
    throttleTimeout: 150,
    disableTocScrollSync: true,
  };

  // 初始化 tocbot
  useEffect(() => {
    setMounted(true);
    
    tocbot.init(tocbotOptions);

    // 延迟检查目录内容
    const timer = setTimeout(() => {
      const tocElement = document.querySelector('.js-toc');
      setHasToc(tocElement && tocElement.children.length > 0);
    }, 1000); // 给一定的延迟等待内容加载

    return () => {
      tocbot.destroy();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      tocbot.init({
        ...tocbotOptions,
        tocSelector: '.js-toc-mobile',
        onClick: function(e) {
          setIsOpen(false);
        },
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* 桌面端目录 */}
      <div className="toc-wrapper hidden xl:block fixed top-24 left-[calc(50%+340px+32px)] w-64">
        <div className="p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-lg border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-base font-medium mb-3 text-neutral-900 dark:text-neutral-100">
            目录
          </h2>
          <nav className="js-toc overflow-y-auto max-h-[480px] text-[15px]"></nav>
        </div>
      </div>

      {/* 移动端目录按钮 - 只在有目录内容时显示 */}
      {hasToc && (
        <button 
          onClick={() => setIsOpen(true)}
          className="toc-wrapper xl:hidden fixed bottom-20 right-8 p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:shadow-lg text-neutral-600 dark:text-neutral-400 transition-all duration-300"
          aria-label="打开目录"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </button>
      )}

      {/* 移动端目录面板 */}
      {isOpen && (
        <div className="toc-wrapper xl:hidden fixed inset-0 z-[100]">
          {/* ... 其他代码保持不变 */}
        </div>
      )}
    </>
  );
}