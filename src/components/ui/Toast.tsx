// components/Toast.tsx
import { ReactNode, useEffect } from 'react';

interface ToastProps {
  title?: string;
  message: string;
  type?: 'error' | 'success';
  duration?: number; // in ms
  onClose: () => void;
}

export default function Toast({
  title = "Something went wrong !",
  message,
  type = 'error',
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50`}>
      <div
        className={`px-4 py-3 rounded shadow-lg text-white ${
          type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}
      >
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
