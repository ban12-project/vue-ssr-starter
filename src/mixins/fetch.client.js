import Vue from 'vue'
import { addLifecycleHook } from '@/util'

const isSsrHydration = vm =>
  vm.$vnode &&
  vm.$vnode.elm &&
  vm.$vnode.elm.dataset &&
  vm.$vnode.elm.dataset.fetchKey

function created() {
  if (!isSsrHydration(this)) return

  // Hydrate component
  this._hydrated = true
  this._fetchKey = this.$vnode.elm.dataset.fetchKey
  const data = window.__INITIAL_STATE__.fetch[this._fetchKey]

  // Merge data
  for (const key in data) {
    Vue.set(this.$data, key, data[key])
  }
}

function beforeMount() {
  if (!this._hydrated) {
    return this.$options.fetch.call(this)
  }
}

export default {
  beforeCreate() {
    if (typeof this.$options.fetch !== 'function') return

    addLifecycleHook(this, 'created', created)
    addLifecycleHook(this, 'beforeMount', beforeMount)
  },
}
