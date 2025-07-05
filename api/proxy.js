import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer();

export default function handler(req, res) {
    // فقط GET و HEAD للطلبات البسيطة (أو زود حسب الحاجة)
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    // إعدادات البروكسي
    proxy.web(req, res, {
        target: 'https://www.youtube.com/', // غيرها لأي موقع تريده
        changeOrigin: true,
        secure: false,
    }, (err) => {
        res.statusCode = 500;
        res.end('Proxy error: ' + err.message);
    });
}

// إعدادات Vercel لـ API Route
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    }
};