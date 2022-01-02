import { addLifecycleHook, createGetCounter } from '@/util'

/**
 * https://github.com/nuxt/nuxt.js/blob/2ec62617ced873fef97c73a6d7aa1271911ccfd5/packages/vue-app/template/mixins/fetch.server.js
 */
export default {
  created() {
    if (typeof this.$options.fetch !== 'function') return

    const serverPrefetch = async () => {
      Object.assign(this.$ssrContext, {
        fetchCounters: this.$ssrContext.fetchCounters || {},
        fetchState: this.$ssrContext.fetchState || {},
      })

      try {
        await this.$options.fetch.call(this)
      } catch (err) {
        console.error('Error in fetch():' + err)
      }

      const defaultKey = this.$options._scopeId || this.$options.name || ''
      const getCounter = createGetCounter(
        this.$ssrContext.fetchCounters,
        defaultKey,
      )
      const key =
        'string' === typeof this.$options.fetchKey
          ? this.$options.fetchKey
          : defaultKey
      this._fetchKey = key
        ? key + ':' + getCounter(key)
        : String(getCounter(key))

      // Add data-fetch-key on parent element of Component
      const attrs = (this.$vnode.data.attrs = this.$vnode.data.attrs || {})
      attrs['data-fetch-key'] = this._fetchKey

      this.$ssrContext.fetchState[this._fetchKey] = this._data
    }

    addLifecycleHook(this, 'serverPrefetch', serverPrefetch)
  },
}
