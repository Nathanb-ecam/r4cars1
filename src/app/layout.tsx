import './globals.css';

export const metadata = {
  robots: 'noindex,nofollow'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
      
  );
}