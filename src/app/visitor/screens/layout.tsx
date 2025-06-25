'use client';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
      // className="
      // transition-all duration-300 ease-in-out 
      // fixed top-4 left-1/2 transform -translate-x-1/2 py-2 px-10 rounded-xl bg-lime-500/90 text-gray-200 flex items-center justify-between gap-10 z-50
      // "
        className={`
          fixed top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out z-50 
          rounded-lg py-2 px-10 bg-lime-500/90  text-gray-200
          ${
            isVisible ? 'translate-y-4 opacity-100' : '-translate-y-full opacity-0'
          }`}
      >
        <span className="text-center text-sm font-medium py-2 mx-2">Free shipping for orders over 60€</span>
        {/* <button
          className="text-white"
          onClick={() => setShowBanner(false)}
        >
          &times;
        </button> */}
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
