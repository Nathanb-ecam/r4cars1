import './globals.css';
import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import { StripeProvider } from '@/components/StripeProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Labeuromed',
  description: 'Medical supplies and equipment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="text/javascript"
          src="https://api.goaffpro.com/loader.js?shop=dxgegkjjxn"
          async
        />
      </head>
      <body className={inter.className}>
        <StripeProvider>
          {children}
        </StripeProvider>
      </body>
    </html>
  );
}
