import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    // bg-gray-900
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
            <p className='text-gray-500 font-lighter text-xs'>
              Localizacion
            </p>
            <p className="text-gray-400 text-sm font-light">                
                CL CERVANTES 14 CEUTA (CEUTA)
              {/* Your trusted provider of high-quality medical products and equipment.
              We are committed to delivering excellence in healthcare solutions. */}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/visitor/screens/home" className="text-gray-400 hover:text-white">
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link href="/visitor/screens/cart" className="text-gray-400 hover:text-white">
                  {t('cart')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white">
                  {t('cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-xs md:text-md mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Labeuromed. {t('allRights')}.</p>
        </div>
      </div>
    </footer>
  );
} 