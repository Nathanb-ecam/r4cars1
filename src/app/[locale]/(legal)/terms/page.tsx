import LegalTemplate from "@/components/legal/LegalTemplate";
import { useTranslations } from "next-intl";

export default function TermsOfService() {
    const t = useTranslations('TermsOfService');
    const termsTitle = t.raw('title')
    const termsSections = t.raw('sections')
    return (
      <LegalTemplate title={termsTitle} lastUpdated={t('lastUpdated')} sections={termsSections}></LegalTemplate>
    );
} 