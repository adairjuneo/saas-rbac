import en from './en.json';
import ptBR from './pt-BR.json';

const locale = { en: 'en', ptBR: 'pt-BR' };

const getLocale = (localeString?: string) => {
  switch (localeString) {
    case locale.en:
      return en;
    case locale.ptBR:
      return ptBR;
    default:
      return en;
  }
};

export { en, getLocale, ptBR };
