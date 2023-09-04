<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const menu = [
  {
    name: '基础组件',
    children: [
      {
        name: 'StIcon 图标',
        path: '/icon'
      }
    ]
  }
];
</script>

<template>
  <div class="compon">
    <header>
      <!-- <img src="/static/favicon.svg" class="w-6 h-6 my-1 align-top inline-block" />
      <span class="leading-8 ml-1.5 align-top">Insight</span> -->
    </header>

    <section>
      <aside>
        <div v-for="item in menu">
          <div class="group">{{ item.name }}</div>
          <router-link
            v-for="item2 in item.children || []"
            :to="item2.path"
            :class="{ active: route.path === item2.path, item: true }"
          >
            {{ item2.name }}
          </router-link>
        </div>
      </aside>

      <main>
        <div class="view">
          <router-view></router-view>
        </div>
      </main>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.compon {
  @apply w-full h-full overflow-hidden select-none bg-white;
}
.compon > header {
  color: var(--el-color-primary);
  @apply text-xl border-b border-solid border-gray-200 box-border px-5 py-3.5;
}
.compon > section {
  height: calc(100% - 3.75rem);
  @apply w-full flex overflow-hidden;
}

.compon > section > aside {
  @apply w-52 h-full flex-shrink-0 overflow-y-scroll overflow-x-hidden text-sm pr-2 px-3 box-border;
}
.compon > section > aside .group {
  @apply p-2 box-border text-base font-semibold text-gray-600 mt-2 cursor-default;
}
.compon > section > aside .item {
  @apply mx-2 box-border cursor-pointer text-gray-500;
  @apply block p-2 box-border transform duration-200 truncate;
}
.compon > section > aside .item:hover {
  @apply text-blue-400;
}
.compon > section > aside .item.active {
  @apply text-blue-400 bg-blue-50 rounded;
}

.compon > section > main {
  @apply w-full h-full overflow-y-scroll overflow-x-hidden px-4 xl:pr-48 box-border relative;
}
.compon > section > main > .view {
  max-width: 55rem;
  @apply h-full mx-auto relative;
}

::-webkit-scrollbar {
  @apply w-1.5 h-1.5;
}
::-webkit-scrollbar-thumb {
  @apply rounded-lg bg-gray-900 bg-opacity-25;
}
::-webkit-scrollbar-track {
  @apply bg-gray-100;
}
</style>
