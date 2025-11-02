// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',          // مجلد إخراج service worker
  register: true,          // تسجيل تلقائي
  skipWaiting: true,       // لتحديث الكاش تلقائيًا
  disable: process.env.NODE_ENV === 'development', 
  fallbacks: {
    document: '/offline.html', // 👈 هذه الصفحة ستظهر عندما لا يوجد إنترنت
  },
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'cdn.pixabay.com',
      'image-cdn.essentiallysports.com',
      'i.dailymail.co.uk',
      'static.independent.co.uk',
      'www.google.com',
      'images.unsplash.com',
    ],
  },
});
