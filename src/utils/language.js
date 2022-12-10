import { i18n } from "../i18n";
import { useRouter } from "vue-router";
import { SUPPORT_LOCALES } from "@/utils/constants";

export function useLanguage() {
  const router = useRouter();
  const switchLanguage = async (inner = false) => {
    let defaultName;
    const to = router.resolve({});
    SUPPORT_LOCALES.forEach((locale) => {
      if (to.name.slice(0, locale.length) === locale) {
        defaultName = to.name.slice(locale.length + 1, to.name.length);
      }
    });
    if (!defaultName) return;

    if (!inner) {
      for (const lang in SUPPORT_LOCALES) {
        if (SUPPORT_LOCALES[lang] === i18n.global.locale.value) {
          let newLangId = parseInt(lang) + 1;
          if (newLangId >= SUPPORT_LOCALES.length) {
            newLangId = 0;
          }

          router.push({
            ...to,
            name: `${SUPPORT_LOCALES[newLangId]}_${defaultName}`,
          });
        }
      }
    } else {
      router.push({
        ...to,
        name: `${inner}_${defaultName}`,
      });
    }
  };

  const i18nRoute = (to, lang = null) => {
    lang =
      lang === null ? i18n.global.locale.value || i18n.global.locale : lang;
    return {
      ...to,
      name: `${lang}_${to.name}`,
    };
  };

  return { i18n, switchLanguage, SUPPORT_LOCALES, i18nRoute };
}
