import LegalTemplate from "@/components/legal/LegalTemplate";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  
  const t = useTranslations('PrivacyPolicy');
  const privacyTitle = t.raw('title')
  const privacySections = t.raw('sections')
  return (
    <LegalTemplate title={privacyTitle} lastUpdated={t('lastUpdated')} sections={privacySections}/>
  );
} 