import { createNavigation } from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es','fr'],
 
  // Used when no locale matches
  defaultLocale: 'en',

  // pathnames: {
  //   '/visitor/screens/home': {
  //     en: '/home-testing',
  //     fr: '/accueil-test',
  //     es: '/inicio-prueba'
  //   },
  //   '/visitor/login': {
  //     en: '/login',
  //     fr: '/connexion',
  //     es: '/connecion'
  //   },
  // }
    
});


// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
// export const locales = ['en', 'fr', 'es'] as const;
// export type Locale = typeof locales[number];

export type Locale = (typeof routing.locales)[number];


export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);