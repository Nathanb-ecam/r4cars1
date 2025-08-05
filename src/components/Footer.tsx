import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { IconLabel } from './ui/IconLabel';

function SectionLine({ title, content }: { title: string; content: string }) {
  return (
    <div className="my-4">
      <p className='text-gray-500 font-lighter text-sm'>
        {title}
      </p>
      <p className="text-gray-400 text-md font-light">
        {content}
      </p>
    </div>
  )

}

export default function Footer() {
  const t = useTranslations('Footer');
  const c = useTranslations('CompanyInfo');

  return (
    // bg-gray-900
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
            <div className='flex flex-col gap-4'>
              <IconLabel className="text-sm sm:text-md text-gray-400" icon={<MdPhone className="text-gray-500 " />} text={c('phone')} />
              <IconLabel className="text-sm sm:text-md text-gray-400" icon={<MdLocationOn className="text-gray-500 " />} text={c('address')} />
              <IconLabel className="text-sm sm:text-md text-gray-400" icon={<MdEmail className="text-gray-500 " />} text={c('email')} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-gray-400 text-sm sm:text-md hover:text-white">
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 text-sm sm:text-md hover:text-white">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 text-sm sm:text-md hover:text-white">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          
          <div className='flex gap-6 justify-center md:justify-start'>         
            <IconLabel className="text-gray-400" icon={<Link href={c('facebook')}><FaFacebook className="text-3xl text-gray-500 hover:cursor-pointer" /></Link>}  />
            <IconLabel className="text-gray-400" icon={<Link href={c('instagram')}><FaInstagram className="text-3xl text-gray-500 hover:cursor-pointer" /></Link>} />
            <IconLabel className="text-gray-400" icon={<Link href={c('twitter')}><FaTwitter className="text-3xl text-gray-500 hover:cursor-pointer" /></Link>} />          
          </div>
          {/* <div>
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
          </div> */}
        </div>
        <div className="text-md mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} r4cars. {t('allRights')}.</p>
        </div>
      </div>
    </footer>
  );
} 