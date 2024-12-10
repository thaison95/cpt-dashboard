<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import PaginationComp from '@/components/PaginationComp.vue'

const apiUrl = import.meta.env.VITE_API_URL

const fetcher = async () =>
  await fetch(`${apiUrl}/orders`).then(response => response.json())

const { isPending, isError, isFetching, data, error, refetch } = useQuery({
  queryKey: ['orders'],
  queryFn: fetcher,
})
</script>

<template>
  <div class="wrapper">
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <div v-else-if="data">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]"> Symbol </TableHead>
            <TableHead>PnL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Trader</TableHead>
            <TableHead class="text-right"> Opened at </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="order in data.orders" :key="order.id">
            <TableCell>{{ order.symbol?.replace('USDT', '') }}</TableCell>
            <TableCell>{{ order.pnl?.toFixed(2) }}</TableCell>
            <TableCell>{{ order.status }}</TableCell>
            <TableCell>{{ order.trader_id }}</TableCell>
            <TableCell class="text-right">{{
              dayjs(order.open_time).format('DD.MM HH:mm:ss')
            }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div class="mt-2"></div>
      <PaginationComp />
    </div>
  </div>
</template>

<!-- <style>

</style> -->
