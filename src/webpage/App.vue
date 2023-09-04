<script>
import { defineComponent } from 'vue';
import { ElConfigProvider } from 'element-plus';
import StIconSymbol from '@/components/base/st-icon/StIconSymbol.vue';

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export default defineComponent({
  components: {
    ElConfigProvider,
    StIconSymbol
  },
  setup() {
    return {
      locale: zhCn
    };
  }
});
</script>

<template>
  <StIconSymbol />
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
#app {
  width: 100%;
  min-width: 1366px;
  height: 100%;
  /* min-height: 768px; */
  min-height: 600px;
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
