import { createNavigation } from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['de','fr'],   
  defaultLocale: 'fr',
    
});


// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
// export const locales = ['en', 'fr', 'es'] as const;
// export type Locale = typeof locales[number];

export type Locale = (typeof routing.locales)[number];


export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);