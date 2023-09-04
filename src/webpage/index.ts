import { createApp } from 'vue';

import '@/assets/style/tailwind.base.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import '@/assets/style/tailwind.extend.css';
import StIcon from '@/components/base/st-icon/StIcon.vue';

import { router } from './router.js';
import App from './App.vue';

createApp(App).use(ElementPlus, { locale: zhCn }).use(router).component('StIcon', StIcon).mount('#app');
