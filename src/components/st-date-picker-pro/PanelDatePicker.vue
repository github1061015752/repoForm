<script setup>
import Vue3Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css';

import { ref, watch } from 'vue';
import { dateRangeShortcuts } from './dateRangeShortcuts.js';
import { ElMessage } from 'element-plus';

const props = defineProps({
  dateRange: {
    type: Array,
    require: true
  },
  shortcut: {
    type: String,
    default: ''
  },
  maxRange: {
    type: Number,
    default: 90
  },
  isContrastPanel: {
    type: Boolean,
    default: false
  },
  isPrevCycle: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:dateRange', 'update:shortcut', 'update:isPrevCycle']);

const pickedRange = ref(props.dateRange);
watch(
  () => props.dateRange,
  () => {
    pickedRange.value = props.dateRange;
  }
);

function pick(dateRange, shortcut = '') {
  const curRange = new Date(dateRange[0]).getTime() - new Date(dateRange[1]).getTime();
  const maxRange = props.maxRange * 24 * 3600_000;
  if (Math.abs(curRange) > maxRange) {
    return ElMessage.error(`最大日期范围不能超过${props.maxRange}天`);
  }

  emit('update:dateRange', dateRange);
  emit('update:shortcut', shortcut);
}

const prevCycle = ref(true);
watch(
  () => props.isPrevCycle,
  val => {
    prevCycle.value = val;
  }
);
function changeContrastMode(val) {
  emit('update:isPrevCycle', val);
}
</script>

<template>
  <div class="st-date-picker flex space-x-2">
    <div v-if="isContrastPanel" class="w-36 grid grid-cols-1 gap-1">
      <el-radio-group v-model="prevCycle" size="small" @change="changeContrastMode">
        <el-radio class="p-2" :label="true">上一周期</el-radio>
        <el-radio class="p-2" :label="false">自定义</el-radio>
      </el-radio-group>
    </div>
    <!-- 快捷日期选项 -->
    <div v-else class="shortcuts w-36 grid grid-cols-2 gap-1">
      <el-button
        v-for="(shortcut, index) in dateRangeShortcuts.slice(0, 6)"
        :key="index"
        size="mini"
        @click="pick(shortcut.value(), shortcut.text)"
      >
        {{ shortcut.text }}
      </el-button>
      <el-button
        v-for="(shortcut, index) in dateRangeShortcuts.slice(9)"
        :key="index"
        class="col-span-2"
        size="mini"
        @click="pick(shortcut.value(), shortcut.text)"
      >
        {{ shortcut.text }}
      </el-button>
    </div>

    <!-- 日期选择器 -->
    <Vue3Datepicker
      v-model="pickedRange"
      range
      inline
      autoApply
      multiCalendars
      multiCalendarsSolo
      :disabled="isPrevCycle"
      :enableTimePicker="false"
      :maxDate="new Date().toLocaleDateString()"
      locale="zh-CN"
      @update:modelValue="pick"
    >
      <template #calendar-header="{ day }">
        <div>{{ day[1] }}</div>
      </template>
    </Vue3Datepicker>
  </div>
</template>

<style scoped lang="postcss">
.st-date-picker :deep(.el-button) {
  @apply m-0;
}
:deep(.dp__main *) {
  @apply text-xs;
}
:deep(.dp__menu) {
  @apply border-none;
}
:deep(.dp__calendar_wrapper) {
  height: 282px;
}
:deep(.dp__calendar_wrapper > .dp__calendar) {
  border-radius: 3px 0 0 3px;
  @apply p-2 pb-0 box-border border border-solid border-gray-200;
}
:deep(.dp__calendar_wrapper > .dp__calendar_next) {
  border-radius: 0 3px 3px 0;
  @apply ml-0 border-l-0;
}
:deep(.dp__calendar_wrapper > .dp__calendar .dp__month_year_row) {
  color: #303133 !important;
}
:deep(.dp__calendar_wrapper > .dp__calendar .db__calendar_header) {
  color: #606266 !important;
}
:deep(.dp__calendar_wrapper > .dp__calendar .dp__calendar_header_separator) {
  @apply mb-1 bg-gray-100;
}
:deep(.dp__calendar_wrapper > .dp__calendar .dp__calendar_header_item),
:deep(.dp__calendar_wrapper > .dp__calendar .dp__cell_inner) {
  @apply h-7 w-8;
}
:deep(.dp__calendar_wrapper > .dp__calendar .dp__calendar_content_wrap) {
  height: 100%;
}
</style>
