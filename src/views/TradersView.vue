<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ref } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL

const tradersInput = ref('')

const fetcher1 = async () =>
  await fetch('/api').then(response => response.json())
const fetcher = async () =>
  await fetch(`${apiUrl}/traders`).then(response => response.json())

const { isPending, isError, isFetching, data, error, refetch } = useQuery({
  queryKey: ['traders'],
  queryFn: fetcher,
})

const postFn = async traders => {
  const response = await fetch(`${apiUrl}/traders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ traders }),
  })
  return response.json()
}

const {
  error: addError,
  mutate,
  data: addData,
} = useMutation({
  mutationFn: traders => postFn(traders),
})

const addTraders = () => {
  const traders = JSON.parse(tradersInput.value)
  console.log('🚀 ~ addTraders ~ traders:', traders)
  mutate(traders)
}
</script>

<template>
  <div class="wrapper">
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline"> Add </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done. err:
            {{ addError }} data: {{ addData }}
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <Textarea
            v-model="tradersInput"
            placeholder="Type your message here."
          />
        </div>
        <DialogFooter>
          <Button type="submit" @click="addTraders"> Save changes </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <div v-else-if="data">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]"> Name </TableHead>
            <TableHead>Id</TableHead>
            <TableHead>Active</TableHead>
            <TableHead class="text-right"> Created at </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="trader in data.traders" :key="trader.id">
            <TableCell>{{ trader.name }}</TableCell>
            <TableCell>{{ trader.id }}</TableCell>
            <TableCell>{{ trader.active }}</TableCell>
            <TableCell class="text-right">{{ trader.created_at }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<!-- <style>

</style> -->
