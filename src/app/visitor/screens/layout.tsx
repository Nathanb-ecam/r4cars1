'use client';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Gift } from "lucide-react";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [showBanner, setShowBanner] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay to trigger transition
    const enterTimeout = setTimeout(() => setIsVisible(true), 10);

    // Auto-hide after 3s
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setShowBanner(false), 300); // match transition duration
    }, 4000);

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300); // match transition duration
  };

  return (
    <div className="relative min-h-screen flex flex-col my-0 py-0">
      {showBanner && (
      <div 
        className={`
          fixed top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out z-50 
          rounded-lg py-2 px-4 md:px-10 bg-gray-50 font-bold flex flex-row justify-center items-center gap-2
          ${isVisible ? 'translate-y-4 opacity-100' : '-translate-y-full opacity-0'}
        `}
      >
        {/* <div className="w-[6px] bg-lime-500"></div> */}
        <Gift className="text-lime-500 h-10 w-10 " />
        <div className="text-gray-700 text-xs md:text-md font-medium py-2 md:mx-2">Free shipping for orders over 60€</div>
      </div>


      )}
      <Header />
      <div className="flex-grow min-h-[70vh] mt-[100px]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
