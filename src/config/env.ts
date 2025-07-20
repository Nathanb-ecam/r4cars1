export const env = {
  database: {
    url: process.env.MONGODB_URI || 'mongodb://username:password@localhost:27017/databaseName',    
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret-jwt-key',
  },
  brevo:{
    apiKey: process.env.BREVO_API_KEY || '',    
  },
  goaffpro: {
    accessToken: process.env.GOAFFPRO_API_KEY || '',
    publicToken: process.env.GOAFFPRO_PUBLIC_TOKEN || '',    
    apiUrl: process.env.GOAFFPRO_API_URL || 'https://api.goaffpro.com/v1',
    
    
    
  },
  mondial_relay:{     
     CLIENT_CODE: process.env.MONDIAL_RELAY_CLIENT_ID || 'BDTEST  ',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:000',
    env: process.env.NODE_ENV || 'development',
  },
} as const;

// Type for the environment configuration
export type EnvConfig = typeof env;

// Validate required environment variables
export function validateEnv() {
  const requiredVars = [
    'MONGODB_URI',
    'GOAFFPRO_API_KEY',
    'GOAFFPRO_PUBLIC_TOKEN',
    'NEXTAUTH_SECRET',
    'BREVO_API_KEY',
    
    'JWT_SECRET',
    'GOAFFPRO_API_KEY',    
    'GOAFFPRO_PUBLIC_TOKEN',    
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
} 