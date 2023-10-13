<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

import Menu from '@/views/menu/Menu.vue';
import StIconSymbol from '@/components/base/st-icon/StIconSymbol.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const isLoginPage = computed(() => useRoute().path === '/' || useRoute().path.includes('login'));
</script>

<template>
  <StIconSymbol />
  <el-config-provider :locale="zhCn">
    <Menu v-if="!isLoginPage"></Menu>
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f8fbff;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(167, 168, 168, 0.7);
  border-radius: 5px;
  border-color: transparent;
  background-clip: padding-box;
  border: 1px transparent solid;
}
</style>
