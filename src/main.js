import buildApp from './app';
// import registerServiceWorker from './registerServiceWorker';

const { app, router, store } = buildApp();

const storeInitialState = window.INITIAL_DATA;
if (storeInitialState) {
    store.replaceState(storeInitialState);
}

router.isReady()
    .then(() => {
        // app.use(registerServiceWorker)
        app.mount('#app', true);
    });
