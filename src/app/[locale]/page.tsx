import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/visitor/login');
  return null;
} 