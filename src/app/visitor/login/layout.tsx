import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VisitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">      
      <div className="flex-grow min-h-[70vh]">
        {children}
      </div>      
    </div>
  );
} 