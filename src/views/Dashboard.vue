<script setup>
import HeaderMain from '@/components/HeaderMain.vue';
import { appList } from '@/services/data/app.js';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const token = computed(() => route.params.token);
</script>

<template>
  <div class="dashboard w-full h-full flex flex-col">
    <HeaderMain :should-show-menu="true" />
    <div class="flex-grow overflow-auto">
      <router-view v-if="appList.length > 0" v-slot="{ Component, route }" :key="token">
        <suspense>
          <template #default>
            <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
          </template>
          <template #fallback>
            <el-empty description="加载中"></el-empty>
          </template>
        </suspense>
      </router-view>
      <div v-else v-loading="!appList.length" class="h-full w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
