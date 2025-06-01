/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // images: {    
  //   domains: ['localhost','placehold.co'],
  //   // domains: ['*'],

  // },
};

module.exports = nextConfig; 