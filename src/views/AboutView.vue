<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'

const apiUrl = import.meta.env.VITE_API_URL
const fetcher = async () =>
  await fetch(`${apiUrl}`).then(response => response.json())

const { isPending, isError, isFetching, data, error, refetch } = useQuery({
  queryKey: ['posts'],
  queryFn: fetcher,
})
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button @click="refetch">Refetch</Button>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <div v-else-if="data">{{ data }}</div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
