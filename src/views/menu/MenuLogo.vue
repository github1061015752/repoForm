<script setup lang="ts">
import logo from '@/assets/icon/logo.svg';
import home from '@/assets/icon/home.svg';
</script>

<template>
  <div class="menu-logo">
    <a href="/" @click.prevent>
      <img :src="logo" />
      <img :src="home" />
    </a>
  </div>
</template>

<style lang="postcss" scoped>
.menu-logo {
  @apply relative flex cursor-pointer hover:bg-blue-710;
  @apply py-3 px-5 box-border transition;
}
.menu-logo img {
  @apply w-[36px] h-[36px] transition;
}
.menu-logo img:first-of-type {
  @apply opacity-100;
}
.menu-logo img:last-of-type {
  @apply absolute left-5 top-3 opacity-0;
}
.menu-logo:hover img:first-of-type {
  @apply opacity-0;
}
.menu-logo:hover img:last-of-type {
  @apply opacity-100;
}
</style>
