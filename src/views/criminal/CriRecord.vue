<script lang="ts" setup>
import Writ from './Writ.vue';
import Busy from './Busy.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { selectFormByPhone } from '@/services/api/businessApi';
import { originFormDataByUser } from '@/services/store/store';
import { criRecordQuery, toPay } from './criRecord';

const route = useRoute();

const queryName = ref('');
const writHtmlStr = ref('');

const loading = ref(true);
const querying = ref(false);

const visibleDefault = ref(true);
const visibleWrit = ref(false);
const visibleBusy = ref(false);

watch(
  originFormDataByUser,
  () => {
    const criRecordForm = originFormDataByUser.value.find(formItem => (formItem as any).type == 0) as any;
    writHtmlStr.value = criRecordForm?.formData || '';
    const haveWrit = writHtmlStr.value != null && writHtmlStr.value !== '';

    //没有类型为0的表单, 有就不显示默, 没有就显示默认页面
    if (originFormDataByUser.value.some(formItem => (formItem as any).type == 0)) visibleDefault.value = false; //有
    else visibleDefault.value = true; //没有
    //有表单 有文书
    if (haveWrit) visibleWrit.value = true;
    //有表单 但是表单内容为空
    if (criRecordForm && !haveWrit) visibleBusy.value = true;
  },
  { deep: true }
);

onMounted(() => {
  const userPhone = sessionStorage.getItem('phone');
  if (userPhone != null && userPhone !== '') selectFormByPhone(userPhone);
  const userName = sessionStorage.getItem('userName') || '';
  const isPay = route.query && route.query?.pay && route.query?.pay == '1';
  const isFromRedirect = document.referrer.includes('/redirect');
  if (isPay && isFromRedirect) {
    querying.value = true;
    criRecordQuery(userName).finally(() => {
      location.replace(location.href.split('?')[0]);
      selectFormByPhone(userPhone!);
    });
    setTimeout(() => (querying.value = false), 3500);
  }
});

const timeout = setTimeout(() => (loading.value = false), 300);
onUnmounted(() => clearTimeout(timeout));
</script>

<template>
  <main class="h-full w-full relative" v-loading="loading" element-loading-background="rgba(4, 4, 4,0.9)">
    <template v-if="!loading && visibleDefault">
      <img src="\image\bg-criminal.webp" alt="加载出错" class="w-full h-full object-cover" />
      <section
        class="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col justify-center items-center space-y-12 whitespace-nowrap"
      >
        <div class="gradient">官方数据, 专业查询</div>
        <div class="gradient-two">仅需姓名, 简单方便</div>
        <div class="flex items-center space-x-3">
          <el-input v-model="queryName" placeholder="请输入查询人的姓名" autocomplete="none" autofocus maxlength="24" />
        </div>

        <el-button type="primary" size="large" @click.stop="toPay(queryName)">
          <span class="mr-2 text-black"> 案底查询</span>
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24">
            <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"></path>
          </svg>
        </el-button>
        <!-- <div v-if="showQR" class="flex flex-col justify-center items-center space-y-2 text-white">
          <img src="\image\QRcode.png" alt="加载出错" class="" />
          <div class="text-lg">微信支付6.6元查询</div>
        </div>  -->
        <!-- <div class="text-xs">说明：支付成功后，选择微信在线服务扫码注册</div> -->
      </section>
    </template>

    <template v-if="!visibleDefault">
      <div class="h-full w-full loading-querying" v-loading="querying" element-loading-text="数据查询中.....">
        <Busy v-if="!querying && visibleBusy" />
        <Writ v-if="visibleWrit" :writString="writHtmlStr" />
      </div>
    </template>
  </main>
</template>

<style lang="postcss" scoped>
.gradient {
  display: inline-block;
  color: #48c3a7;
  text-transform: uppercase;
  background: -webkit-linear-gradient(130deg, #ff9f65, #50b3bc, #5999dc);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @apply text-4xl sm:text-7xl font-bold text-white select-none;
}
.gradient-two {
  display: inline-block;
  color: #48c3a7;
  text-transform: uppercase;
  background: -webkit-linear-gradient(20deg, #ff9f65, #50b3bc, #5999dc);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @apply text-2xl sm:text-5xl font-bold text-white select-none;
}

:deep(.el-input .el-input__inner) {
  @apply text-white;
}

:deep(.el-input .el-input__wrapper) {
  background-color: rgba(0, 0, 0, 0);
}
:deep(.el-input ::placeholder) {
  @apply text-white;
}

:deep(.el-button--primary.el-button) {
  @apply bg-cyan-200;
}

.loading-querying:deep(.el-loading-spinner) {
  @apply -translate-y-1/2;
}

.loading-querying:deep(.el-loading-text) {
  @apply text-lg mt-5 ml-3;
}
</style>
