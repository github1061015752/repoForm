<script setup lang="ts">
// import { MenuItem } from '@/services/data/app';
import { aevent } from '@/services/domain/aevent';
import { onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MenuItem } from './useMenu';

type Props = {
  menuList: MenuItem[];
};
type State = {
  active?: string;
};

const menuListRef = ref();
const route = useRoute();
const props = defineProps<Props>();

const state: State = reactive({});

const handleClickMenu = (item: MenuItem) => {
  if (state.active === item.id) {
    setActiveItem(undefined);
  } else {
    setActiveItem(item.id);
  }
};

const setActiveItem = (id?: string | undefined) => {
  state.active = id;
};
const handleGlobalClick = () => {
  setActiveItem(undefined);
};

const handelUrl = (item: MenuItem) => {
  const token = route.params.token ? `/${route.params.token}` : '';
  return `${token}${item.url}`;
};

onMounted(() => {
  aevent.addHiddenNode(menuListRef.value, () => {
    setActiveItem(undefined);
  });
});
onBeforeUnmount(() => {
  aevent.removeHiddenNode(menuListRef.value);
});
</script>

<template>
  <div class="menu-list" ref="menuListRef">
    <div
      v-for="item in menuList.filter(item => item.enabled)"
      :class="{
        'is-active': item.subs?.length ? route.path.includes(handelUrl(item)) : handelUrl(item) === route.path
      }"
      class="menu-list__item"
    >
      <router-link
        v-if="!item.subs?.length"
        class="menu-list__link"
        :target="item._blank ? '_blank' : '_self'"
        :to="{ path: handelUrl(item) }"
      >
        <span> {{ item.title }} </span>
      </router-link>

      <a v-else class="menu-list__link" :target="item._blank ? '_blank' : '_self'" @click="handleClickMenu(item)">
        <span> {{ item.title }} </span>
        <StIcon
          icon="dire2"
          class="text-[#A9CCF0] !transition-all"
          :style="{ transform: `rotate(${item.id === state.active ? 180 : 0}deg)` }"
          :size="4"
        />
      </a>

      <div
        class="menu-list__content"
        :class="{ 'shadow-light': state.active === item.id }"
        :style="{
          height: item.id === state.active ? `${(item.subs?.length ?? 0) * 36 + 16}px` : 0
        }"
      >
        <div class="menu-list__sub">
          <router-link
            v-for="subItem in item.subs ?? []"
            class="menu-list__option"
            :target="subItem._blank ? '_blank' : '_self'"
            :to="{ path: `${handelUrl(item)}${subItem.url}` }"
            @click="setActiveItem(undefined)"
          >
            <StIcon :icon="subItem.icon" type="primary" class="-mx-0.5" />
            <span class="menu-list__text">
              {{ subItem.title }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.menu-list {
  @apply flex items-center text-sm;
}
.menu-list__link {
  @apply h-full inline-flex items-center space-x-1 px-4 cursor-pointer whitespace-nowrap;
}
.menu-list__item {
  @apply inline-flex justify-center items-center h-[100%];
  @apply relative border-b-2 border-[#3185DB] text-gray-100;
}
.menu-list__item.is-active {
  @apply bg-[#276aaf] border-b-[#fff];
}
.menu-list .menu-list__sub .router-link-active {
  @apply bg-[#e8eefd];
}
.menu-list__content {
  @apply absolute top-[60px] left-1/2 z-[2200] m-2;
  @apply transform -translate-x-[50%] overflow-hidden;
  @apply transition-all duration-300;
}
.menu-list__sub {
  @apply border border-solid border-[#EBEEF5] rounded;
  @apply bg-white min-w-[150px] py-2 box-border;
}
.menu-list__option {
  @apply block text-gray-600 text-sm h-[36px] flex items-center;
  @apply px-2.5 box-border space-x-1.5 hover:bg-[#E8EEFD];
}
</style>
