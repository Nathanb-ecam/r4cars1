import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/es'); // Change '/es' to your preferred default locale
  return null;
} 