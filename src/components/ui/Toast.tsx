// components/Toast.tsx
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success';
  duration?: number; // in ms
  onClose: () => void;
}

export default function Toast({
  message,
  type = 'error',
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed bottom-5 right-5 z-50`}>
      <div
        className={`px-4 py-3 rounded shadow-lg text-white ${
          type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}
      >
        {message}
      </div>
    </div>
  );
}
