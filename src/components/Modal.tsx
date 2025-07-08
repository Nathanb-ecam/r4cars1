import Image from 'next/image';
import React, { useState } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onPrimaryClicked: () => void;
  primaryText:string;  
  onSecondaryClicked?: () => void;
  secondaryText?: string;
  secondaryVisible?:boolean;
  title: string;
  sentence: string;  
  imageUrl?:string;
  onClose: ()=> void;
}

export default function Modal({
  isOpen,
  onPrimaryClicked,
  primaryText,  
  onSecondaryClicked,
  secondaryText,
  secondaryVisible = false,
  onClose,
  title,
  imageUrl,
  sentence
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const [imgSrc,setImgSrc] = useState( (imageUrl && imageUrl?.length > 0)  ? imageUrl :'/images/g5-no-bg.png')
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      { imageUrl && <div className='flex justify-center bg-gray-50'>
          <div className="relative h-24 w-24 md:h-60 md:w-60 flex-shrink-0">
            <Image
                //   src={product.imageUrl || '/images/g5-no-bg.png'}
                  src={imgSrc}
                  alt={"product-image"}                  
                  fill
                  onError={() => setImgSrc("/images/g5-no-bg.png")}
                  className="object-contain"
                />
         </div>
        </div>
        }

        <div className="mt-2">
          <p className="text-sm text-center text-gray-500">
            {sentence}
          </p>
        </div>
        <div className='mt-10 flex w-full flex-col items-center'>

          <div className="flex justify-end space-x-3 w-full hover:cursor-pointer">
            <button
              type="button"
              onClick={onPrimaryClicked}
              className="w-full px-6 py-2 text-sm font-medium text-white bg-lime-500 border border-transparent rounded-md focus:ring-lime-500"
            >
              {primaryText}
            </button>
          </div>

            {secondaryVisible && <div className="flex justify-end space-x-3 w-full hover:cursor-pointer">
            <button
              type="button"
              onClick={onSecondaryClicked}
              className="w-full px-6 py-2 text-sm font-medium text-lime-500 border border-transparent rounded-md"
            >
              {secondaryText}
            </button>
          </div>}

        </div>
      </div>
    </div>
  );
} 