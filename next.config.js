/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['localhost','placehold.co'],
    domains: ['*'],

  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

module.exports = nextConfig; 