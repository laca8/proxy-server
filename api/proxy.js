// api/proxy.js
import httpProxy from 'http-proxy-middleware';

export default function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Get target URL from query parameter
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({
            error: 'Missing target URL. Use: /api/proxy?url=https://example.com'
        });
    }

    try {
        // Validate URL
        new URL(targetUrl);
    } catch (error) {
        return res.status(400).json({
            error: 'Invalid URL format'
        });
    }

    // Create proxy middleware
    const proxy = httpProxy.createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        secure: true,
        followRedirects: true,
        timeout: 10000,
        proxyTimeout: 10000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        onError: (err, req, res) => {
            console.error('Proxy Error:', err.message);
            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Proxy request failed: ' + err.message
                });
            }
        }
    });

    // Execute proxy
    proxy(req, res);
}

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};