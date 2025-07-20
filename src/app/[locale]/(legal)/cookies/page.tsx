import LegalTemplate from "@/components/legal/LegalTemplate";
import { useTranslations } from "next-intl";


export const dynamic = 'force-dynamic';


export default function CookiePolicy() {  
  const t = useTranslations('CookiePolicy');  
  const cookiesTitle = t.raw('title')
  const cookiesSections = t.raw('sections');

return (
  <LegalTemplate title={cookiesTitle} lastUpdated={t('lastUpdated')} sections={cookiesSections} />
);
  
} 