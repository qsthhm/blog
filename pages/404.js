import NotFound from '../components/NotFound';
import { SITE_CONFIG } from '../constants/site';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>页面不存在 - {SITE_CONFIG.name}</title>
      </Head>
      <div className="mt-nav">
        <NotFound />
      </div>
    </>
  );
}