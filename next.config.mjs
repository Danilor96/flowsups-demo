/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/public/creditApp/start/:id',
        destination: '/api/public/creditApp/start/:id',
      },
      {
        source: '/api/public/creditApp/references/:id',
        destination: '/api/public/creditApp/references/:id',
      },
      {
        source: '/api/public/creditApp/address/:id',
        destination: '/api/public/creditApp/address/:id',
      },
      {
        source: '/api/public/creditApp/employmentStatus/:id',
        destination: '/api/public/creditApp/employmentStatus/:id',
      },
    ];
  },
};

export default nextConfig;
