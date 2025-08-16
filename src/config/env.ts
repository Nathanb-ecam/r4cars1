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
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'https://r4cars.ch',    
  },  
  company:{
    brand_name: process.env.NEXT_PUBLIC_BRANDNAME || 'R4Cars',        
    mail: process.env.NEXT_PUBLIC_MAIL || 'info@r4cars.ch',    
    phone: process.env.NEXT_PUBLIC_PHONE || "+41 78 341 49 05",    
    address: process.env.NEXT_PUBLIC_ADDRESS || "123 Rue de l'Exemple, Saillon, Suisse",    
    facebook: process.env.NEXT_PUBLIC_PHONE || "",        
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "https://www.instagram.com/r4cars.ch/?igsh=MTEwMWxudjBrOXprZw%3D%3D",                    
    twitter: process.env.NEXT_PUBLIC_TWITTER || "",        
    maps: process.env.NEXT_PUBLIC_MAPS || "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d20198.601754921146!2d3.2669696!3d50.741730499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sbe!4v1753348567388!5m2!1sfr!2sbe",        
  }
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