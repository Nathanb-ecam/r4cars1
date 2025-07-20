import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header></Header>
      <div className="flex-grow mt-[100px]">
        {children}
      </div>
      <Footer />
    </div>
  );
} 