<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: { type: String, default: '' }, // 图标
  type: { type: String, default: '' }, // 主题
  round: { type: Number, default: 3 }, // 圆角
  border: { type: Number, default: 0 }, // 边框
  fill: { type: Boolean, default: false }, // 填充
  plain: { type: Boolean, default: false }, // 浅色
  pointer: { type: Boolean, default: true }, // 指针
  disabled: { type: Boolean, default: false }, // 禁用
  zoom: { type: Boolean, default: false }, // 缩放
  transition: { type: Boolean, default: true }, // 过渡动画
  size: { type: Number, default: 6 }, // 大小
  rotate: { type: Number, default: 0 } // 旋转
});

const boxClass = computed(() => ({
  'st-svg-icon': true,
  'st-transition': props.transition,
  'cursor-pointer': props.pointer && !props.disabled,
  'cursor-not-allowed opacity-30': props.disabled,
  'border-solid': props.border,

  'border-blue-400 text-blue-400': !props.fill && props.type === 'primary',
  'border-red-400 text-red-400': !props.fill && props.type === 'danger',
  'border-yellow-400 text-yellow-400': !props.fill && props.type === 'warning',
  'border-green-400 text-green-400': !props.fill && props.type === 'success',
  'border-gray-400 text-gray-400': !props.fill && props.type === 'info',

  'bg-blue-50 hover:bg-blue-400': props.plain && props.type === 'primary',
  'bg-red-50 hover:bg-red-400': props.plain && props.type === 'danger',
  'bg-yellow-50 hover:bg-yellow-400': props.plain && props.type === 'warning',
  'bg-green-50 hover:bg-green-400': props.plain && props.type === 'success',
  'bg-gray-50 hover:bg-gray-400': props.plain && props.type === 'info',
  'hover:text-white': props.plain,

  'text-white': props.fill,
  'bg-blue-400': props.fill && props.type === 'primary',
  'bg-red-400': props.fill && props.type === 'danger',
  'bg-yellow-400': props.fill && props.type === 'warning',
  'bg-green-400': props.fill && props.type === 'success',
  'bg-gray-400': props.fill && props.type === 'info'
}));

const boxStyle = computed(() => ({
  width: `${props.size / 4}rem`,
  height: `${props.size / 4}rem`,
  transform: `rotate(${props.rotate}deg)`,
  borderRadius: `${props.round}px`,
  borderWidth: `${props.border}px`
}));

const svgStyle = computed(() => ({
  margin: `-${props.zoom ? props.size / 16 : 0}rem`
}));
</script>

<template>
  <div :class="boxClass" :style="boxStyle">
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      :style="svgStyle"
    >
      <use :xlink:href="`#icon-${icon}`"></use>
    </svg>
  </div>
</template>

<style lang="postcss" scoped>
.st-svg-icon {
  @apply inline-block align-top transform;
}
.st-svg-icon.st-transition {
  @apply transition-all duration-300;
}
</style>
