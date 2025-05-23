// pages/docs.js
import { useEffect } from 'react';
import Head from 'next/head';

export default function Docs() {
    useEffect(() => {
        // Carrega o SwaggerUIBundle do CDN
        // eslint-disable-next-line no-undef
        SwaggerUIBundle({
            url: '/api/swagger',
            dom_id: '#swagger-ui',
            presets: [SwaggerUIBundle.presets.apis],
            layout: 'BaseLayout',
        });
    }, []);

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <title>API Docs</title>
                {/* CSS do Swagger UI */}
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css"
                />
                {/* JS do Swagger UI */}
                <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js" />
                <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-standalone-preset.js" />
            </Head>
            <div id="swagger-ui" style={{ height: '100vh' }} />
        </>
    );
}
