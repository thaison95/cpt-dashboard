<script setup lang="ts">
import { Button } from '@/components/ui/button'

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { ChevronLeft } from 'lucide-vue-next'

import { posts } from '@/clonee/data'
import { computed, ref } from 'vue'
import CloneePost from '@/components/CloneePost.vue'

const state = ref('LIST')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedPost = ref<any>(null)

const title = computed(() => {
  return state.value === 'LIST'
    ? 'Danh sách'
    : `${selectedPost.value?.id}. ${selectedPost.value?.title}`
})
</script>

<template>
  <Card class="border-none rounded-none h-svh">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <!-- <CardTitle>zz</CardTitle> -->
    </CardHeader>
    <CardContent class="pb-32">
      <div v-if="state === 'LIST'" class="grid gap-4">
        <div
          v-for="post in posts"
          :key="post.id"
          class="flex items-center space-x-4 rounded-md border p-4"
          @click="(selectedPost = post), (state = 'DETAIL')"
        >
          <div class="flex-1 space-y-1">
            <p class="text-sm font-medium leading-none">
              {{ post.id }}. {{ post.title }}
            </p>
          </div>
        </div>
      </div>
      <div v-else-if="state === 'DETAIL'">
        <CloneePost :post="selectedPost" />
      </div>
    </CardContent>
    <CardFooter class="absolute bottom-0">
      <Button v-if="state === 'DETAIL'" @click="state = 'LIST'" class="w-full">
        <ChevronLeft class="mr-2 h-4 w-4" /> Back
      </Button>
    </CardFooter>
  </Card>
</template>
