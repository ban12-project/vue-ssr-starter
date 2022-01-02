<template>
  <dl class="px-10 grid grid-cols-6 grid-rows-2">
    <dt class="text-gray-500 text-xl mr-1 text-right">name</dt>
    <dd class="col-span-2 text-xl text-left text-blue-500">
      {{ repo.name || '-' }}
    </dd>

    <dt class="text-gray-500 text-xl mr-1 text-right">description</dt>
    <dd class="col-span-2 text-xl text-left">{{ repo.description || '-' }}</dd>

    <dt class="text-gray-500 text-xl mr-1 text-right">forks</dt>
    <dd class="col-span-2 text-9xl text-left">{{ repo.forks || '-' }}</dd>

    <dt class="text-gray-500 text-xl mr-1 text-right">star</dt>
    <dd class="col-span-2 text-9xl text-left">
      {{ repo.stargazers_count || '-' }}
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

  async fetch() {
    this.repo = await getRepo({ repo: this.$route.params.repo })
  },
}
</script>
