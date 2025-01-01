<script setup lang="ts">
import dayjs from 'dayjs'
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import PaginationComp from '@/components/PaginationComp.vue'
import { ref } from 'vue'
import { tradersFetcher } from '@/api'
import { computed } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL

const fetcher = async () =>
  await fetch(`${apiUrl}/orders`).then(response => response.json())

const { isPending, isError, isFetching, data, error, refetch } = useQuery({
  queryKey: ['orders'],
  queryFn: fetcher,
})

const { data: traders } = useQuery({
  queryKey: ['traders'],
  queryFn: tradersFetcher,
})

const page = ref(1)
const defaultPageCount = 10

const selectVal = ref('-1')

const getTraderName = traderId => {
  const tradersVal = traders.value?.traders
  if (!tradersVal) return traderId
  return tradersVal.find(trader => trader.id === traderId)?.name || traderId
}

const dataFiltered = computed(() => {
  const orderByTrader = data.value?.orders?.filter(
    (o, idx) =>
      (selectVal.value === '-1' || o.trader_id === selectVal.value),
  )
  return orderByTrader || [];
})

const pnl = computed(() => {
  return dataFiltered.value.reduce((acc, order) => acc + (order.pnl || 0), 0)
})

</script>

<template>
  <div class="wrapper">
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <div v-else-if="data">
      <Select v-if="traders?.traders" v-model="selectVal">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select trader" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="-1" key="all">All traders</SelectItem>
            <SelectItem v-for="trader in traders.traders" :key="trader.id" :value="trader.id">
              {{ trader.name }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <!-- ---------- -->
      <div class="mt-2 ml-2 gap-1">
        <h1 class="text-sm font-bold">PNL: {{ pnl }}</h1>
        <span class="text-sm">Orders: {{ dataFiltered.length }}</span>
      </div>
      <!-- ---------- -->
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
          <TableRow v-for="order in dataFiltered.filter(
            (_, idx) =>
              idx >= page * defaultPageCount - defaultPageCount &&
              idx < page * defaultPageCount,
          )" :key="order.id">
            <TableCell class="flex items-center gap-0.5">
              <Badge :class="`${order.side === 'BUY' ? 'bg-green-500' : 'bg-red-500'} text-white px-1 py-0.25`">{{
                order.side[0] }} </Badge><span>{{ order.symbol?.replace('USDT', '') }}</span>
            </TableCell>
            <TableCell>{{ order.pnl?.toFixed(2) }}</TableCell>
            <TableCell>{{ order.status }}</TableCell>
            <TableCell>{{ getTraderName(order.trader_id) }}</TableCell>
            <TableCell class="text-right">{{
              dayjs(order.open_time).format('DD.MM HH:mm:ss')
              }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div class="mt-2"></div>
      <PaginationComp v-if="dataFiltered.length > 10" :total="dataFiltered.length" v-on:update-page="$event => {
          // console.log($event)
          page = $event
        }
        " />
    </div>
  </div>
</template>

<!-- <style>

</style> -->
