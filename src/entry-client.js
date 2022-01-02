import Vue from 'vue'
import fetchMixin from './mixins/fetch.client'
import { createApp } from './app'

Vue.mixin(fetchMixin)

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  // We initialize the store state with the data injected from the server
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  // this assumes App.vue template root element has `id="app"`
  app.$mount('#app')
})
