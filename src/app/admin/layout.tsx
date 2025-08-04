import '../globals.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>        
        <div className="min-h-screen flex flex-col">
          {/* <Header /> */}
          <div className="flex-grow">
            {children}
          </div>
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  );
} 