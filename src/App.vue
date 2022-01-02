<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>

    <h1 class="text-9xl font-bold capitalize">repos</h1>

    <ul class="mt-10 mb-20 border-b border-solid border-gray-300">
      <li v-for="repo in repos" :key="repo.id" class="my-5">
        <router-link
          class="text-green-500 hover:underline"
          :to="`/repo/${repo.name}`"
        >
          <h3 class="text-xl font-semibold">
            {{ repo.name }}
          </h3>
          <p>{{ repo.description }}</p>
        </router-link>
      </li>
    </ul>

    <router-view />
  </div>
</template>

<script>
import { getAllRepos } from '@/api'

export default {
  name: 'App',

  data() {
    return {
      repos: [],
    }
  },

  async fetch() {
    this.repos = await getAllRepos()
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
