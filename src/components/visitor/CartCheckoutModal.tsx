import { useState, useEffect } from 'react';
import MondialRelayWidget, { Address } from '../mondial-relay/RelayWidget';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import { useRouter } from '@/i18n/routing';

interface CustomerPersonalInfo {
  first_name: string;
  last_name: string;
  email: string;
  shipping_address: string;
}

interface PersonalInfo{
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    shipping_address: string,
}

interface CartCheckoutModalProps {
  onClose: () => void;
  onSubmit: (formData: CustomerPersonalInfo) => Promise<void>;
  isProcessing: boolean;
  subtotal: number;
  shippingCost: number;
  total: number;
  setAffiliateId: (affiliate_id : string) => void;
  onModalError: (errorMessage: string) => void;
}

export default function CartCheckoutModal({
  onClose,
  onSubmit,
  isProcessing,
  subtotal,
  shippingCost,
  total,  
  setAffiliateId,
  onModalError
}: CartCheckoutModalProps) {
  
  const t = useTranslations('Checkout');
  const router = useRouter()
  const pathname = usePathname();
  const countryLocale = (pathname.split('/')[1] != "en") ? pathname.split('/')[1] : 'fr';  
  const [step, setStep] = useState(1);
  const [personalInfoData, setPersonalInfoData] = useState<PersonalInfo | null>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    shipping_address:''
  });  
  


  useEffect(() => {
    const checkMondialRelaySelection = setInterval(() => {
      const pointCodeInput = document.getElementById('Target_Widget') as HTMLInputElement;
      const fullAddressDiv = document.getElementById('SelectedParcelAddress') as HTMLElement;

      if (pointCodeInput?.value && fullAddressDiv?.innerText) {
        const fullAddress = `${pointCodeInput.value} - ${fullAddressDiv.innerText}`;
        setPersonalInfoData(prev => prev ? { ...prev, shipping_address: fullAddress } : prev);
      }
    }, 1000);

    return () => clearInterval(checkMondialRelaySelection);
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();    
    const affiliate_id = Cookies.get('affiliate_id');
    if(!affiliate_id) {onModalError("Affiliate id was not found");onClose();return;}
    setAffiliateId(affiliate_id)    
    
    
    if(personalInfoData === null) {console.error("Personal Info data is empty!");return};     
    
    if (step === 1){      

      setStep(2);
    } else if(step === 2 ){      
      // Validate all required fields
      if (!personalInfoData.first_name || !personalInfoData.last_name || !personalInfoData.email || !personalInfoData.shipping_address) {
        alert('Please fill in all required fields and select a Mondial Relay point');
        return;
      }           
      setStep(3);
    }
    // else {            
      // await onSubmit(personalInfoData);
    // }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md md:max-w-screen-lg mx-auto max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('title')}</h2>
          <button
            onClick={() =>{
              onClose(); 
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-8">
          <div className="flex justify-between mb-2">
            <div className={`text-sm ${step >= 1 ? 'text-lime-500 font-medium' : 'text-gray-500'} flex flex-col justify-center items-center gap-2 `}>
              <h2 className={`${step >= 1 ? 'bg-lime-500 text-white' : 'bg-gray-50'} h-8 w-8 flex justify-center items-center gap-5 rounded-full`}>1</h2>
              <p className='text-xs md:text-md'>{t('summary')}</p>
            </div>
            <div className={`text-sm ${step >= 2 ? 'text-lime-500 font-medium' : 'text-gray-500'} flex flex-col justify-center items-center gap-2 `}>
              <h2 className={`${step >= 2 ? 'bg-lime-500 text-white' : 'bg-gray-50'} h-8 w-8 flex justify-center items-center gap-5 rounded-full`}>2</h2>
              <p className='text-xs md:text-md'>{t('personalInfo')}</p>
            </div>
            <div className={`text-sm ${step >= 3 ? 'text-lime-500 font-medium' : 'text-gray-500'} flex flex-col justify-center items-center gap-2 `}>
              <h2 className={`${step >= 3 ? 'bg-lime-500 text-white' : 'bg-gray-50'} h-8 w-8 flex justify-center items-center gap-5 rounded-full`}>3</h2>
              <p className='text-xs md:text-md'>{t('payment')}</p>
            </div>  
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-lime-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step-1) * 50}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          { step === 1 && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md md:text-lg font-medium mb-2">{t('orderSummary')}</h3>
                  <div className="flex justify-between mb-2">
                    <span className='text-sm md:text-md'>{t('subtotal')}:</span>
                    <span className="text-sm md:text-md font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className='text-sm md:text-md'>{t('shipping')}:</span>
                    <span className="text-sm md:text-md font-medium">€{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex font-bold justify-between mb-2 mt-4 pt-4 border-t">
                    <span>{t('totalAmount')}:</span>
                    <span className="font-bold">€{total.toFixed(2)}</span>
                  </div>
                  {/* <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Shipping Address:</strong> {personalInfoData?.shipping_address}
                    </p>
                  </div> */}
                </div>
                <div className='text-end'>         
                  <button
                    type="submit"
                    // type="button"
                    // onClick={() => setStep(2)}
                    className="px-6 py-2 text-sm font-medium text-white bg-lime-500 rounded-md hover:bg-lime-600"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}
          
          
          {step === 2 && (
                  <div className="space-y-4">
                  <div className="flex gap-2 md:gap-5 flex-col md:flex-row">
                    <div className='flex-1'>
                      <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                        {t('firstname')}
                      </label>
                      <input
                        type="text"
                        id="firstname"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={personalInfoData?.first_name}
                        onChange={(e) => setPersonalInfoData(prev => prev ? { ...prev, first_name: e.target.value } : prev)}
                      />
                    </div>
                    <div className='flex-1'>
                      <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                        {t('lastname')}
                      </label>
                      <input
                        type="text"
                        id="lastname"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={personalInfoData?.last_name}
                        onChange={(e) => setPersonalInfoData(prev => prev ? { ...prev, last_name: e.target.value }: prev)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={personalInfoData?.email}
                      onChange={(e) => setPersonalInfoData(prev => prev ? { ...prev, email: e.target.value } : prev )}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      {t('phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={personalInfoData?.phone}
                      onChange={(e) => setPersonalInfoData(prev => prev ? { ...prev, phone: e.target.value } : prev )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('selectRelay')}
                    </label>
                    <div className="border rounded-md md:p-2">
                      <MondialRelayWidget
                        initialCountry={countryLocale.toUpperCase()}
                        onAddressSelected={(mondialRelayId,address : Address) => {
                          // const address = `${parcel.Nom} - ${parcel.Adresse1}, ${parcel.CodePostal} ${parcel.Ville}`;
                          const fullAddress = `${address.Street}, ${address.CP} ${address.City}`;
                          setPersonalInfoData(prev =>
                            prev ? { ...prev, shipping_address: fullAddress } : prev
                          );
                        }} 
                       />
                    </div>
                    {personalInfoData?.shipping_address && (
                      <p className="mt-2 text-sm text-gray-600">
                        {t('selectedPoint')}: <span className='font-semibold'>{personalInfoData?.shipping_address}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <p className="mb-2 text-xs md:text-sm text-gray-600">
                      {t('securePayment')}
                    </p>

                    <div className="flex gap-2 justify-end sm:ml-auto">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        {t('back')}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 text-sm font-medium text-white bg-lime-500 rounded-md hover:bg-lime-600"
                      >
                        {t('next')}
                      </button>
                    </div>
                  </div>



                </div>
          )}
    
          {step === 3 && (
                    <>
                    <div>
                      <h2 className='text-lg font-bold tracking-tight'>
                          Paiement BBVA
                      </h2>
                      <p>{total}</p>
                      <p>Virement</p>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          {t('back')}
                        </button>
                        <button
                          // type="submit"
                          type='button'
                          onClick={async ()=> {
                            if(personalInfoData === null) {console.error("Personal Info data is empty!");return};     
                            await onSubmit(personalInfoData)
                          }}
                          disabled={isProcessing}
                          className="px-4 py-2 text-sm font-medium text-white bg-lime-500 rounded-md hover:bg-lime-600 disabled:opacity-50"
                        >
                          {t('payNow')}
                        </button>                   
                  </div>
                    </>
          )}
        </form>
      </div>
    </div>
  );
} 