/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  images: {    
    domains: ['localhost','172.20.144.1','placehold.co'],
    // domains: ['*'],

  },
};

module.exports = nextConfig; 