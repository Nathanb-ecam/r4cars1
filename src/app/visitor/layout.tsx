'use client';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";

export default function Layout({ children }) {
  // const [showBanner, setShowBanner] = useState(true);
  const showBanner = false;

  return (
    <div className="relative min-h-screen flex flex-col my-0 py-0">
      {showBanner && (
        <div className="absolute w-full bg-gray-900 text-white flex items-center justify-center z-50">
          <span className="text-center text-xs font-medium py-2">Free shipping for orders over 60€</span>
          <button
            className="absolute right-4 text-white text-lg font-bold"
            // onClick={() => setShowBanner(false)}
          >
            &times;
          </button>
        </div>
      )}
      <Header />
      <div className="flex-grow min-h-[70vh]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
