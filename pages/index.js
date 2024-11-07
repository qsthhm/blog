import { getParameters } from './api/notion';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../constants/site';

// 骨架屏组件
function HomeSkeleton() {
  return (
    <div className="mt-nav">
      <div className="py-8">
        <div className="h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-48 mb-3 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-full animate-pulse" />
          <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-4/5 animate-pulse" />
          <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-3/4 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function Home({ intro = '' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Head>
          <title>{SITE_CONFIG.name}</title>
        </Head>
        <HomeSkeleton />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{SITE_CONFIG.name}</title>
        <meta name="description" content={intro || SITE_CONFIG.description} />
      </Head>

      <div className="mt-nav">
        <div className="py-8">
          <h1 className="text-page-title font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
            且言
          </h1>
          {intro ? (
            <div 
              className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: intro.replace(/\n/g, '<br />') }}
            />
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400">
              {SITE_CONFIG.description}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const parameters = await getParameters();

    return {
      props: {
        intro: parameters['首页说明'] || '',
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        intro: '',
      }
    };
  }
}