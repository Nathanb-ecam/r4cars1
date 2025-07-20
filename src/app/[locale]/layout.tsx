// import '../globals.css';
// import type { Metadata } from 'next';
// import { NextIntlClientProvider } from 'next-intl';
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {};

// export default async function RootLayout({ children, params }: {
//   children: React.ReactNode;
//   params: { locale: string };
// }) {
//   const { locale } = await params;
//   return (
//     <html lang={locale}>
//       <head />
//       <body className={inter.className}>
//         <NextIntlClientProvider locale={locale}>
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }


import './globals.css';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
 
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}