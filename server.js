/*
سيرفر بروكسي محسن للدخول على المواقع المحجوبة
Enhanced Proxy Server for accessing blocked websites
*/

const http = require('http');
const httpProxy = require('http-proxy-middleware');
const url = require('url');

// Create proxy server
const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const targetUrl = parsedUrl.query.url;

    // If no target URL, show usage instructions
    if (!targetUrl) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Proxy Server</title>
                <meta charset="utf-8">
            </head>
            <body style="font-family: Arial; padding: 20px;">
                <h1>🌐 Proxy Server</h1>
                <p>لاستخدام البروكسي، أضف المعامل url إلى الرابط:</p>
                <p>To use the proxy, add the url parameter to the link:</p>
                <code>http://localhost:8000/?url=https://www.youtube.com</code>
                <br><br>
                <form method="get">
                    <input type="url" name="url" placeholder="https://example.com" style="width: 300px; padding: 5px;">
                    <button type="submit">Go</button>
                </form>
            </body>
            </html>
        `);
        return;
    }

    // Validate URL
    try {
        new URL(targetUrl);
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid URL format' }));
        return;
    }

    console.log('🔄 Proxying request to:', targetUrl);

    // Create and execute proxy
    const proxy = httpProxy.createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        secure: true,
        followRedirects: true,
        timeout: 15000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate'
        },
        onError: (err, req, res) => {
            console.error('❌ Proxy Error:', err.message);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Proxy request failed: ' + err.message
                }));
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log('✅ Response received from:', targetUrl);
        }
    });

    proxy(req, res);
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`📡 Proxy Server running on http://localhost:${PORT}`);
    console.log(`📝 Usage: http://localhost:${PORT}/?url=https://www.youtube.com`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('❌ Server Error:', err.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down proxy server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});