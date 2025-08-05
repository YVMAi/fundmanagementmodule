
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '@/i18n/config';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === i18n.language
  ) || supportedLanguages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const isRTL = currentLanguage.dir === 'rtl';

  return {
    currentLanguage,
    changeLanguage,
    isRTL,
    supportedLanguages,
  };
};
