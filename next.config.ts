// import type { NextConfig } from 'next';
// import createNextIntlPlugin from 'next-intl/plugin';

// const nextConfig: NextConfig = {
//   experimental: {
//     // ppr: true,
//     // Include `turbo` so next-intl adds aliases here instead of the
//     // newer `turbopack` key, which isn't recognized in our Next.js version.
//     turbo: {},
//   }
// };

// export default createNextIntlPlugin('./src/i18n/request.ts');

import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);