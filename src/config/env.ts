export const env = {
  database: {
    url: process.env.MONGODB_URI || 'mongodb://username:password@localhost:27017/databaseName',    
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret-jwt-key',
  },
  brevo:{
    apiKey: process.env.BREVO_API_KEY || 'your-brevo-api-key',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'production',
  },
} as const;

// Type for the environment configuration
export type EnvConfig = typeof env;

// Validate required environment variables
export function validateEnv() {
  const requiredVars = [
    'MONGODB_URI',    
    'NEXTAUTH_SECRET',        
    'JWT_SECRET', 
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
} 