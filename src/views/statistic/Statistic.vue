<script setup lang="ts">
import StatisticPageHeader from './StatisticHeader.vue';
import StatisticTable from './StatisticTable.vue';
import StPagination from '@/components/base/StPagination.vue';

import { onMounted, reactive, ref, toRefs } from 'vue';

import { getFormList, pagination, dataTotal } from './statistic';

onMounted(() => {
  getFormList(pagination.pageNum, pagination.pageSize);
});
</script>

<template>
  <div class="w-full h-full">
    <!-- 过滤头 -->
    <header class="flex items-center h-14 bg-white shadow">
      <StatisticPageHeader />
    </header>
    <!-- 表格 -->
    <main class="h-5/6 flex flex-col justify-between bg-white shadow m-5 p-1">
      <div class="relative w-full flex-grow overflow-hidden"><StatisticTable /></div>
      <div class="self-end">
        <StPagination
          v-model:pageIndex="pagination.pageNum"
          v-model:pageSize="pagination.pageSize"
          :dataSize="dataTotal"
          resetIndexTo1
        />
      </div>
    </main>
  </div>
</template>

<style scoped></style>
