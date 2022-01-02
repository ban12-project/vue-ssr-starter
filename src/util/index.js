export function createGetCounter(counterObject, defaultKey = '') {
  return function getCounter(id = defaultKey) {
    if (counterObject[id] === undefined) {
      counterObject[id] = 0
    }
    return counterObject[id]++
  }
}

export function addLifecycleHook(vm, hook, fn) {
  if (!vm.$options[hook]) {
    vm.$options[hook] = []
  }
  if (!vm.$options[hook].includes(fn)) {
    vm.$options[hook].push(fn)
  }
}
