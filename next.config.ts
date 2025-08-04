import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    // allowedDevOrigins: ['http://192.168.129.177:3000'],
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);


