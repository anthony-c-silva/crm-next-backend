// pages/docs.js
import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'

export default function Docs() {
  useEffect(() => {
    // Depois que os scripts foram carregados, inicializa o Swagger UI
    // 'SwaggerUIBundle' já estará disponível no global scope
    // eslint-disable-next-line no-undef
    SwaggerUIBundle({
      url: 'https://crm-next-backend-1nib.vercel.app/api/swagger',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis],
      layout: 'BaseLayout',
    })
  }, [])

  return (
    <>
      <Head>
        <title>API Docs</title>
        <meta charSet="UTF-8" />
        {/* CSS do Swagger UI */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css"
        />
      </Head>

      {/* Carrega o bundle JS e o standalone preset ANTES de renderizar o componente */}
      <Script
        src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-standalone-preset.js"
        strategy="beforeInteractive"
      />

      {/* Container onde o Swagger UI vai ser montado */}
      <div id="swagger-ui" style={{ height: '100vh' }} />
    </>
  )
}
