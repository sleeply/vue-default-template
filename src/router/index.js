import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import {
  getBrowserLocale,
  DEFAULT_LOCALE,
  i18n,
  loadLocaleMessages,
  setI18nLanguage
} from '../i18n'
import { SUPPORT_LOCALES } from '@/utils/constants'

const routes = []

const childRoutes = [
  {
    path: '',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
]

const routeNames = [];

const checkIfArrayIsUnique = (myArray) => {
  return myArray.length === new Set(myArray).size;
};

const recursiveChildren = (locale, children) => {
  if (!children || children.length === 0) {
    return;
  }
  const recChildren = [];
  children.forEach((child) => {
    routeNames.push(child.name);
    recChildren.push({
      ...child,
      name: `${locale}_${child.name}`,
      children: recursiveChildren(locale, child.children),
    });
  });
  return recChildren;
};

SUPPORT_LOCALES.forEach((locale) => {
  routes.unshift({
    path: `/${locale === DEFAULT_LOCALE ? "" : locale}`,
    component: {
      template: "<router-view></router-view>",
    },
    children: recursiveChildren(locale, childRoutes),
  });
});

// routes.push({
//   path: "/:catchAll(.*)",
//   name: "404",
//   component: () => import("@/views/404.vue"),
// });

if (checkIfArrayIsUnique(routeNames))
  throw new Error("Route names must be unique");

const isServer = typeof window === "undefined";
const history = isServer ? createMemoryHistory() : createWebHistory();

const beforeEach = async (to, from, next) => {
  if (!isServer) {
    window?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  let paramsLocale;
  SUPPORT_LOCALES.forEach((locale) => {
    const regex = new RegExp(
      `/${locale}/${locale.length + 1 === to.path.length ? `|/${locale}` : ""}`
    );
    let m;
    if ((m = regex.exec(to.path)) !== null) {
      paramsLocale = m[0].slice(1, locale.length + 1);
    }
  });

  paramsLocale = paramsLocale === undefined ? DEFAULT_LOCALE : paramsLocale;

  const newLocale = getBrowserLocale();

  // use locale if paramsLocale is not in SUPPORT_LOCALES

  if (!SUPPORT_LOCALES.includes(paramsLocale)) {
    return next({ name: `${newLocale}_Home` });
  }

  // load locale messages
  if (!i18n.global.availableLocales.includes(paramsLocale)) {
    await loadLocaleMessages(i18n, paramsLocale);
  }
  // set i18n language
  setI18nLanguage(i18n, paramsLocale);

  return next();
};

export default function () {
  const router = createRouter({
    history,
    routes,
    scrollBehavior() {
      return {
        x: 0,
        y: 0,
      };
    },
  });

  router.beforeEach(beforeEach);
  return router;
}
