<script setup>
import HeaderMain from '@/components/HeaderMain.vue';
</script>
<template>
  <HeaderMain :should-show-menu="true"></HeaderMain>
  <el-empty description="暂无此页面"></el-empty>
</template>

<style scoped>
.el-empty {
  @apply w-full h-full flex-grow;
}
</style>
