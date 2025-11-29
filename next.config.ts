/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'example.com',        // remote rasm hosting
      'localhost',          // agar local backenddan rasm kelayotgan bo‘lsa
      '127.0.0.1',          // ba’zida localhost o‘rnida ishlatiladi
    ],
  },
};

module.exports = nextConfig;
