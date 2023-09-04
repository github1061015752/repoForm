<script setup>
import { computed, reactive, watch } from 'vue';

const props = defineProps({
  vert: { type: Boolean, default: false }, // 垂直方向
  delay: { type: Number, default: 200 }, // 事件延迟
  area1: { type: Object, default: null }, // 区域1配置
  area2: { type: Object, default: null } // 区域2配置
});
const emits = defineEmits(['change']);

// 默认区域配置
const areaDefault = {
  minSize: 420, // 区域最小值
  curSize: 530, // 区域当前值
  maxSize: 640, // 区域最大值
  visible: true, // 显示/折叠区域
  button: true, // 显示/隐藏按钮
  offset: 56, // 区域折叠后大小
  hidden: false // 禁用区域
};

const state = reactive({
  active: false, // 是否正在展开/收缩
  timeout: null, // 响应延迟计时器
  overlay: null, // 遮罩层对应区域，area1/area2
  mousedown: false, // 鼠标是否按下
  area1: props.area1 ? Object.assign({}, areaDefault, props.area1) : { hidden: true }, // 区域1
  area2: props.area2 ? Object.assign({}, areaDefault, props.area2) : { hidden: true }, // 区域2
  class: computed(() => ({
    'is-vert': props.vert,
    'select-none': state.overlay,
    'pointer-events-none': state.active,
    'pointer-events-auto': !state.active
  })), // 组件类
  cursor: computed(() => (state.overlay ? state.getCursor(state.overlay) : {})), // 遮罩层样式
  // 计算区域样式
  getStyle: area => {
    if (state[area].hidden) return {};

    const curlabel = props.vert ? 'height' : 'width';
    const minLabel = props.vert ? 'minHeight' : 'minWidth';
    const maxLabel = props.vert ? 'maxHeight' : 'maxWidth';
    const vertMargin = area === 'area1' ? 'marginTop' : 'marginBottom';
    const horzMargin = area === 'area1' ? 'marginLeft' : 'marginRight';
    const curMargin = props.vert ? vertMargin : horzMargin;
    const style = {};

    style[curlabel] = state[area].curSize + 'px';
    style[minLabel] = state[area].minSize + 'px';
    style[maxLabel] = state[area].maxSize + 'px';
    style[curMargin] = state[area].visible ? '' : `-${state[area].curSize - state[area].offset}px`;

    return style;
  },
  // 计算区域类
  getClass: area => {
    if (state[area].hidden) return {};
    return {
      'st-area': true,
      'st-area1': area === 'area1',
      'st-area2': area === 'area2',
      'is-close': !state[area].visible,
      'st-dynamic': !state.mousedown
    };
  },
  // 计算分割线样式
  getCursor: area => {
    if (state[area].hidden) return {};
    if (!state[area].visible) return {};
    const cursor = {
      index: Number(area.slice(-1)),
      value: 'pointer'
    };

    if (cursor.index === 1) {
      if (state[area].curSize <= state[area].minSize)
        cursor.value = props.vert ? 's-resize' : 'e-resize';
      else if (state[area].curSize >= state[area].maxSize)
        cursor.value = props.vert ? 'n-resize' : 'w-resize';
      else cursor.value = props.vert ? 'row-resize' : 'col-resize';
    }
    if (cursor.index === 2) {
      if (state[area].curSize <= state[area].minSize)
        cursor.value = props.vert ? 'n-resize' : 'w-resize';
      else if (state[area].curSize >= state[area].maxSize)
        cursor.value = props.vert ? 's-resize' : 'e-resize';
      else cursor.value = props.vert ? 'row-resize' : 'col-resize';
    }

    return { cursor: cursor.value };
  },
  // 计算按钮类
  getButton: area => {
    if (state[area].hidden) return {};
    return { 'is-active': !state[area].visible };
  }
});

// 分割线按下鼠标，显示遮罩层
const onMouseDown = area => {
  state.overlay = area;
  state.mousedown = true;
};
// 鼠标移动，更新区域大小
const onMouseMove = e => {
  const area = state.overlay;
  const movement = props.vert ? 'movementY' : 'movementX';
  if (!state[area].visible) return;
  if (area === 'area1') state[area].curSize += e[movement] / 2;
  if (area === 'area2') state[area].curSize -= e[movement] / 2;

  if (!state.timeout) {
    state.timeout = setTimeout(() => {
      state.timeout = 0;
    }, props.delay);
    emits('change', area);
  }
};
// 鼠标离开，结束响应
const onMouseUp = () => {
  if (state.overlay) {
    const area = state[state.overlay];
    if (area.curSize < area.minSize) area.curSize = area.minSize;
    if (area.curSize > area.maxSize) area.curSize = area.maxSize;

    emits('change', state.overlay);
    state.overlay = null;
    state.mousedown = false;
  }
};
// 点击分割线按钮，折叠/展开
const clickButton = area => {
  state[area].visible = !state[area].visible;
  emits('change', area);
};

watch(() => [state.area1.visible, state.area2.visible], () => {
  state.active = true;
  setTimeout(() => {
    state.active = false;
  }, 300);
});

// 抛出区域对象，方便外部控制
defineExpose({
  area1: state.area1,
  area2: state.area2
});
</script>

<template>
  <div class="st-dynamic-area" :class="state.class">
    <!-- 区域1 -->
    <div
      v-if="!state.area1.hidden"
      :class="state.getClass('area1')"
      :style="state.getStyle('area1')"
    >
      <div class="st-slot">
        <slot name="area1"> area1 </slot>
      </div>
    </div>

    <!-- 分割线1 -->
    <div
      v-if="!state.area1.hidden"
      class="st-line st-line1"
      :style="state.getCursor('area1')"
      @mousedown.stop="onMouseDown('area1')"
    >
      <div
        v-if="state.area1.button"
        class="st-button"
        :class="state.getButton('area1')"
        @click.stop="clickButton('area1')"
        @mousedown.stop
      >
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M685.248 104.704a64 64 0 010 90.496L368.448 512l316.8 316.8a64 64 0 01-90.496 90.496L232.704 557.248a64 64 0 010-90.496l362.048-362.048a64 64 0 0190.496 0z"
          ></path>
        </svg>
      </div>
    </div>

    <!-- 主区域 -->
    <div class="st-main">
      <div class="st-slot">
        <slot> main </slot>
      </div>
    </div>

    <!-- 分割线2 -->
    <div
      v-if="!state.area2.hidden"
      class="st-line st-line2"
      :style="state.getCursor('area2')"
      @mousedown.stop="onMouseDown('area2')"
    >
      <div
        v-if="state.area2.button"
        class="st-button"
        :class="state.getButton('area2')"
        @click.stop="clickButton('area2')"
        @mousedown.stop
      >
        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          class="transform rotate-180"
        >
          <path
            fill="currentColor"
            d="M685.248 104.704a64 64 0 010 90.496L368.448 512l316.8 316.8a64 64 0 01-90.496 90.496L232.704 557.248a64 64 0 010-90.496l362.048-362.048a64 64 0 0190.496 0z"
          ></path>
        </svg>
      </div>
    </div>

    <!-- 区域2 -->
    <div
      v-if="!state.area2.hidden"
      :class="state.getClass('area2')"
      :style="state.getStyle('area2')"
    >
      <div class="st-slot">
        <slot name="area2"> area2 </slot>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div
      v-show="state.overlay"
      class="st-overlay"
      :style="state.cursor"
      @mousemove.stop="onMouseMove"
      @mouseup.stop="onMouseUp"
      @mouseleave.stop="onMouseUp"
    />
  </div>
</template>

<style lang="postcss" scoped>
/* 整体样式 */
.st-dynamic-area {
  @apply w-full h-full flex relative overflow-hidden;
}
.st-dynamic-area.is-vert {
  @apply flex-col;
}
/* 主区域样式 */
.st-dynamic-area .st-main {
  @apply w-0 h-full flex-1;
}
.st-dynamic-area.is-vert .st-main {
  @apply w-full h-0 flex-1;
}
/* 动态区域样式 */
.st-dynamic-area .st-area {
  @apply flex-shrink-0;
}
/* 分割线样式 */
.st-dynamic-area .st-line {
  /* @apply h-full w-2 z-50 bg-blue-200 flex-shrink-0 flex items-center;
  @apply border opacity-30 hover:border-gray-500 hover:border-opacity-30 hover:opacity-40; */
  @apply h-full w-2 -mx-1 z-50  flex-shrink-0 flex items-center;
}
.st-dynamic-area.is-vert .st-line {
  /* @apply w-full h-2 flex-col bg-blue-200; */
  @apply w-full h-2 flex-col;
}
/* 分割线按钮样式 */
.st-dynamic-area .st-line .st-button {
  @apply w-4 h-8 p-0.5 box-border rounded bg-gray-100 z-50 flex-shrink-0 cursor-pointer text-gray-400 flex items-center;
}
.st-dynamic-area .st-line .st-button.is-active {
  transform: rotateY(180deg);
  transition: all 0.3s;
}
.st-dynamic-area .st-line2 .st-button {
  @apply -m-3;
}
.st-dynamic-area.is-vert .st-line .st-button {
  @apply w-8 h-4 flex-col;
}
.st-dynamic-area.is-vert .st-line .st-button.is-active {
  transform: rotateX(180deg);
  transition: all 0.3s;
}
.st-dynamic-area.is-vert .st-line1 .st-button svg {
  @apply transform rotate-90;
}
.st-dynamic-area.is-vert .st-line2 .st-button svg {
  @apply transform -rotate-90;
}
/* 其他样式 */
.st-dynamic-area .st-slot {
  @apply w-full h-full box-border;
}
.st-dynamic-area .st-overlay {
  @apply absolute left-0 right-0 top-0 bottom-0 z-50;
}
.st-dynamic-area .st-dynamic {
  @apply duration-300 transition-all !important;
}
</style>
