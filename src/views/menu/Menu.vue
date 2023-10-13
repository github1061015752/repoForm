<script setup lang="ts">
import { useRoute } from 'vue-router';
import { MenuList, MenuLogo, MenuAvatar } from './index';
import { useMenu, MenuItem } from './useMenu';
import { reactive } from 'vue';

const menuList = reactive([
  { title: '案底查询', id: 'criminalRecord', enabled: true, url: '/criRecord', subs: [] },
  // { title: '信息箱', id: 'messageBox', enabled: true, url: '/form', subs: [] },
  // { title: '统计', id: 'statistic', enabled: true, url: '/statistic', subs: [] } // _blank: false
]);

type Props = {
  hideMenuList?: boolean;
  hideMenuIcon?: boolean;
  hideMenuLogo?: boolean;
  hideMenuAvatar?: boolean;
  hideAppList?: boolean;
};

const route = useRoute();
const props = defineProps<Props>();

const { state, util } = useMenu(route);
</script>

<template>
  <header class="header-main">
    <slot name="logo">
      <MenuLogo v-if="!hideMenuLogo"></MenuLogo>
    </slot>

    <slot name="default">
      <MenuList v-if="!hideMenuList" :menuList="menuList" class="mx-4 flex-grow" />
    </slot>

    <slot name="avatar">
      <MenuAvatar v-if="!hideMenuAvatar" @click="util.handleClick" />
    </slot>
  </header>
</template>

<style scoped lang="postcss">
.header-main {
  @apply h-[60px] flex flex-nowrap justify-between bg-[#3185db] opacity-80;
}
</style>
