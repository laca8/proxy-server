/*
عبارة عن سيرفر بروكسي تقدر من خلاله الدخول علي المواقع المحجوبة من غير ماتتعرف هويتك حاجة شبه الفيب ان

*/



const http = require('http')
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer({})
// سيرفر البروكسي يستقبل الطلب من المستخدم
const server = http.createServer((req, res) => {
    console.log('طلب جديد إلى:', req.url);

    // البروكسي يعيد توجيه الطلب إلى Google
    proxy.web(req, res, {
        target: 'https://www.youtube.com/',
        changeOrigin: true,
        secure: false // ⚠️ هذا يتجاوز التحقق من SSL certificate
    });
});


// تشغيل السيرفر على بورت 8000
server.listen(8000, () => {
    console.log('📡 Proxy Server يعمل على http://localhost:8000');
});