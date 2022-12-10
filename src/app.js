import { createSSRApp, createApp } from 'vue';
import App from './App.vue'
import createRouter from './router'
import createStore from './store'
import { i18n } from './i18n'

const isSSR = typeof window === 'undefined';

export default function buildApp() {
    const app = (isSSR ? createSSRApp(App) : createApp(App));

    const i18nRoute = (to) => {
      return {
        ...to,
        name: `${i18n.global.locale.value || i18n.global.locale}_${to.name}`,
      }
    }
    app.config.globalProperties.$i18nRoute = i18nRoute

    app.config.globalProperties.$scrollToTop = (behavior = 'auto') => window?.scrollTo({ top: 0, behavior });

    const router = createRouter();
    const store = createStore();

    app.use(i18n)
    app.use(store)
    app.use(router)

    return { app, router, store };
}
