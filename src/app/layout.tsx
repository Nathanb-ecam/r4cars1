import './globals.css';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
 
export default async function RootLayout({
  children
}: {
  children: React.ReactNode;  
}) {
  return (
    <>{children}</>    
  );
}