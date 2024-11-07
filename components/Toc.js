import { useEffect, useState } from 'react';
import tocbot from 'tocbot';

export default function Toc() {
  const [isOpen, setIsOpen] = useState(false);

  // tocbot 配置
  const tocbotOptions = {
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

  // 初始化两个目录
  useEffect(() => {
    // 桌面端目录
    tocbot.init({
      ...tocbotOptions,
      tocSelector: '.js-toc',
    });

    // 移动端目录
    tocbot.init({
      ...tocbotOptions,
      tocSelector: '.js-toc-mobile',
    });

    return () => tocbot.destroy();
  }, []);

  // 打开移动端面板时重新初始化移动端目录
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

      {/* 移动端目录组件 */}
      <div className="toc-wrapper xl:hidden">
        {/* 移动端目录按钮 */}
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-8 p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:shadow-lg text-neutral-600 dark:text-neutral-400 transition-all duration-300"
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

        {/* 隐藏的导航元素用于检测目录是否为空 */}
        <nav className="js-toc-mobile hidden"></nav>

        {/* 移动端目录面板 */}
        {isOpen && (
          <div className="fixed inset-0 z-[100]">
            <div 
              className="absolute inset-0 bg-black bg-opacity-25 dark:bg-opacity-50 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute bottom-0 inset-x-0 min-h-[320px] max-h-[80vh] bg-white dark:bg-neutral-900 rounded-t-2xl shadow-xl">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                  目录
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
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
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 65px)' }}>
                <nav className="js-toc-mobile text-base"></nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}