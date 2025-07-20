import './globals.css';

export const metadata = {
  robots: 'noindex, nofollow',
};
 
export default async function LocaleLayout({
  children
}: {
  children: React.ReactNode;  
}) {

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}