export const env = {
  database: {
    url: process.env.MONGODB_URI || 'mongodb://mongo-makassar:mongo-makassar-password@localhost:27017/labeuromed?authSource=admin',    
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret-jwt-key',
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  goaffpro: {
    apiKey: process.env.GOAFFPRO_API_KEY || '',
    affiliateId: process.env.GOAFFPRO_AFFILIATE_ID || '',
    apiUrl: process.env.GOAFFPRO_API_URL || 'https://api.goaffpro.com/v1',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },
} as const;

// Type for the environment configuration
export type EnvConfig = typeof env;

// Validate required environment variables
export function validateEnv() {
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'GOAFFPRO_API_KEY',
    'GOAFFPRO_AFFILIATE_ID',
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
} 