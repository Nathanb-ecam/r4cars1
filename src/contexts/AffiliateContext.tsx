'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AffiliateContextType {
  affiliateCode: string | null;
  setAffiliateCode: (code: string | null) => void;
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

export function AffiliateProvider({ children }: { children: ReactNode }) {
  const [affiliateCode, setAffiliateCodeState] = useState<string | null>(null);

  useEffect(() => {
    // Load affiliate code from cookie on mount
    const savedCode = Cookies.get('affiliateCode');
    if (savedCode) {
      setAffiliateCodeState(savedCode);
    }
  }, []);

  const setAffiliateCode = (code: string | null) => {
    setAffiliateCodeState(code);
    if (code) {
      Cookies.set('affiliateCode', code, { expires: 365 }); // Store for 1 year
    } else {
      Cookies.remove('affiliateCode');
    }
  };

  return (
    <AffiliateContext.Provider value={{ affiliateCode, setAffiliateCode }}>
      {children}
    </AffiliateContext.Provider>
  );
}

export function useAffiliate() {
  const context = useContext(AffiliateContext);
  if (context === undefined) {
    throw new Error('useAffiliate must be used within an AffiliateProvider');
  }
  return context;
} 