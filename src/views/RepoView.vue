<template>
  <dl
    class="px-2 md:px-10 grid gap-5 grid-cols-5 md:grid-cols-10 auto-rows-auto"
  >
    <dt class="col-span-2 text-gray-500 text-xl mr-1 text-right">name</dt>
    <dd class="col-span-3 text-xl text-left text-blue-500">
      {{ repo.name }}
    </dd>

    <dt class="col-span-2 text-gray-500 text-xl mr-1 text-right">
      description
    </dt>
    <dd class="col-span-3 text-xl text-left">{{ repo.description }}</dd>

    <dt class="col-span-2 text-gray-500 text-xl mr-1 text-right">forks</dt>
    <dd class="col-span-3 text-9xl text-left">{{ repo.forks }}</dd>

    <dt class="col-span-2 text-gray-500 text-xl mr-1 text-right">star</dt>
    <dd class="col-span-3 text-9xl text-left">
      {{ repo.stargazers_count }}
    </dd>
  </dl>
</template>

<script>
import { getRepo } from '@/api'

export default {
  name: 'RepoView',

  data() {
    return {
      repo: {},
    }
  },

  async fetch(repo) {
    this.repo = await getRepo({ repo: repo || this.$route.params.repo })
  },

  beforeRouteUpdate(to, from, next) {
    this.$fetch(to.params.repo)
    next()
  },
}
</script>
