<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  titleTips: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:visible']);
</script>

<template>
  <div class="panel">
    <div class="panel-view" :class="{ 'opacity-0 -ml-14': !visible }">
      <!-- 面板顶部 -->
      <header>
        <!-- 折叠按钮 -->
        <div class="icon-fold is-rotate" @click="emit('update:visible', false)">
          <StIcon plain icon="dire3" type="primary" :rotate="-90" />
        </div>
        <!-- 标题 -->
        <div class="title">
          <span class="text-gray-700 font-medium text-lg">
            {{ title }}
          </span>
        </div>

        <div class="flex-grow"></div>
      </header>

      <main>
        <slot></slot>
      </main>

      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
      <!-- 展开按钮 -->
    <div class="panel-hide" :class="{ '-mr-14': visible }">
    
      <div class="icon-fold space-y-4">
        <StIcon plain icon="dire3" type="primary" :rotate="-90" @click="emit('update:visible', true)" />
        <slot name="panel-hide"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
/* 总体样式 */
.panel {
  @apply h-full w-full flex   relative bg-white shadow overflow-hidden;
}
.panel .panel-view {
  @apply h-full w-full flex-none flex flex-grow flex-col transition duration-300  ;
}
.panel .panel-hide {
  @apply w-9 px-1.5 py-3.5 box-border transition-all duration-300 flex-shrink-0;
}

/* Header样式 */
.panel .panel-view > header {
  @apply h-14 px-4 py-3.5 box-border border-b border-solid border-gray-200 flex items-center transition-all duration-300 select-none;
}
.panel .panel-view > header .title {
  @apply flex-grow flex ml-4 pl-4 border-l border-solid border-gray-200 space-x-1.5;
}

/* Footer样式 */
.panel .panel-view > footer {
  @apply h-16 w-full border-t border-solid border-gray-200;
}

/* Main样式 */
.panel .panel-view > main {
  height: calc(100% - 7.6rem);
  /*@apply overflow-auto divide-y;*/
}
.panel .panel-view > main .title {
  @apply mb-3 px-4 pt-4 flex items-center space-x-1.5;
}
.panel .panel-view > main .title > span {
  @apply text-base font-medium text-gray-700;
}

/* Icon相关样式 */
.panel .icon-fold > div {
  @apply h-6 w-6 transition cursor-pointer rounded text-blue-600 bg-blue-150 hover:bg-blue-400 hover:text-white;
}
.panel .is-rotate {
  @apply transform rotate-180;
}
</style>
