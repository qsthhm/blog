import Script from 'next/script'

export default function ThirdPartyScripts() {
  return (
    <>
      {/* Analytics */}
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="059e37d6-007f-4f30-ae8b-c97ee9a85ee1"
        strategy="lazyOnload"
      />
    
    </>
  )
}