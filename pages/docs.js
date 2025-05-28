// pages/docs.js
import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'

export default function Docs() {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    SwaggerUIBundle({
      url: '/swagger.json',        // <— JSON estático em public/swagger.json
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis],
      layout: 'BaseLayout',
    })
  }, [])

  return (
    <>
      <Head>
        <title>API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css"/>
      </Head>

      <Script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js" strategy="beforeInteractive"/>
      <Script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-standalone-preset.js" strategy="beforeInteractive"/>

      <div id="swagger-ui" style={{ height: '100vh' }}/>
    </>
  )
}
