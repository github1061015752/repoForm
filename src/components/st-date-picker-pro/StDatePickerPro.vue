<script setup>
import { TimeUtil } from '@/services/domain/timeutil.js';
import { computed, ref, watch } from 'vue';
import { getDateCache, setDateCache } from './dateCache';
import { dateRangeShortcuts } from './dateRangeShortcuts.js';
import PanelDatePicker from './PanelDatePicker.vue';

const props = defineProps({
  modelValue: {
    type: Array
  },
  contrastValue: {
    type: Array,
    default: null
  },
  contrastSupport: {
    type: Boolean,
    default: false
  },
  dynamicSupport: {
    type: Boolean,
    default: false
  },
  borderTheme: {
    type: Boolean,
    default: false
  },
  maxRange: {
    type: Number,
    default: 90_000
  },
  useCache: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:modelValue', 'update:contrastValue', 'change']);

defineExpose({
  initPickerData
});

// const defaultDate = dateRangeShortcuts.find(v => v.text === '过去7天').value();
const last7Days = dateRangeShortcuts.find(v => v.text === '过去7天').value();
const defaultDate = props.useCache ? getDateCache(last7Days) : last7Days;

// 动态时间、静态时间 tab
const dateType = ref(props.dynamicSupport ? 'dynamic' : 'static');

// 是否对比 CheckBox
const isContrast = ref(false);

// 选中的时间范围，值为原生javascript Date
const pickerDate = ref(defaultDate);
const pickerDateContrast = ref(null);

const shortcut = ref('');
const shortcutContrast = ref('');

// 显示的 日期范围字符串
const dateRangeStr = ref();
const dateRangeStrContrast = ref();
const showedDateRangeStr = computed(() => {
  const str = dateRangeStr.value.split(' | ')[0];
  const strContrast = dateRangeStrContrast.value?.split(' | ')[0];
  if (isContrast.value && strContrast) {
    return `${str} <span class=" px-2 text-blue-400">VS</span> ${strContrast}`;
  }
  return `${str}`;
});

// 日历面板显示的日期范围预览
const pickerDatePreview = computed(() =>
  getDateRangeStr(pickerDate.value, dateType.value, shortcut.value)
);
const pickerDatePreviewContrast = computed(() => {
  if (pickerDateContrast.value) {
    return getDateRangeStr(pickerDateContrast.value, dateType.value, shortcutContrast.value);
  }
  return '';
});

/**
 * 根据原生JavaScript Date日期范围，及是否动态日期，拼接显示的字符串
 * @param {Date[]} dateRange
 * @param {'dynamic'|'static'} dateType
 * @param {'昨日'|'今日'|'本周'|'上周'|'本月'|'上月'} shortcut
 * @returns {string}
 */
function getDateRangeStr(dateRange, dateType, shortcut) {
  if (!dateRange || dateRange.length === 0) {
    return '';
  }
  let dateRangeStr = '';
  if (dateType === 'dynamic') {
    if (shortcut) {
      dateRangeStr += shortcut;
    } else {
      const today = new Date().setHours(0, 0, 0, 0);
      const [start, end] = dateRange
        .map(v => new Date(v).setHours(0, 0, 0, 0))
        .map(v => Math.floor((today - v) / (60 * 60 * 1000 * 24)));
      if (end === 0 || end === 1) {
        if (start === end) {
          dateRangeStr += end ? '昨天' : '今天';
        } else if (end === 0) {
          dateRangeStr += `${start > 1 ? `过去${start}天` : '昨天'} ~ 今天`;
        } else {
          dateRangeStr += `过去${start}天`;
        }
      } else {
        dateRangeStr += `过去${start}天 ~ 过去${end}天`;
      }
    }
    dateRangeStr += ' | ';
  }
  dateRangeStr += `${TimeUtil.dateToYMD(dateRange[0])} ~ ${TimeUtil.dateToYMD(dateRange[1])}`;
  return dateRangeStr;
}

// 是否设置为上一周期
const isPrevCycle = ref(true);
/**
 * 设置对比时间为上一周期
 */
function setContrastPreviousCycle() {
  const shortcutIndex = dateRangeShortcuts.slice(0, 6).findIndex(v => v.text === shortcut.value);
  if (shortcutIndex >= 0) {
    pickerDateContrast.value = dateRangeShortcuts[shortcutIndex].previous();
    shortcutContrast.value = dateRangeShortcuts[shortcutIndex].previousText;
  } else {
    const tmp = pickerDate.value.map(v => new Date(v));
    const [start, end] = tmp.map(v => v.setHours(0, 0, 0, 0));
    const dayCount = Math.floor((end - start) / (60 * 60 * 1000 * 24));
    tmp.forEach(v => v.setDate(v.getDate() - dayCount - 1));
    pickerDateContrast.value = tmp;
    shortcutContrast.value = '';
  }
}

watch([isPrevCycle, pickerDate], () => {
  if (isPrevCycle.value) {
    setContrastPreviousCycle();
  } else {
    shortcutContrast.value = '';
  }
});

/**
 * 切换是否开启对比时，设置对比时间
 */
const handleContrastCheckbox = val => {
  if (val) {
    isPrevCycle.value = true;
    if (!pickerDateContrast.value) {
      setContrastPreviousCycle();
    }
  } else {
    isPrevCycle.value = false;
  }
};

/**
 * 初始化 日期选择面板所需数据
 * @param {(Date|string|number)[]} range
 * @param {Date[] | null | undefined}rangeContrast
 */
function initPickerData(range = props.modelValue, rangeContrast = props.contrastValue) {
  function convert2Date(range) {
    let [dateType, pickerDate, shortcut] = [null, null, null];
    if (range.length === 2) {
      // 长度为 2 的日期字符串数字
      // [ "2021-12-01 00:00:00", "2021-12-03 23:59:59" ]
      dateType = 'static';
      pickerDate = range.map(v => {
        if (typeof v === 'string') return new Date(v.replace(/\-/g, '/'));
        return new Date(v);
      });
    } else if (range.length === 1) {
      // 长度为 1 以','分隔的数字字符串， 有如下两种情况
      // [ "n" ] 从0开始的单个数字分别代表 【今天，明天，本周，上周，本月，上月】
      // [ "m,n" ] 以','分隔的两个数字,m >= n，代表 过去的第m天 到 过去的第n天
      dateType = 'dynamic';
      const dynamicRange = range[0].split(',').map(v => parseInt(v));
      if (dynamicRange.length === 1 && dynamicRange[0] >= 0) {
        shortcut = dateRangeShortcuts[dynamicRange[0]].text;
        pickerDate = dateRangeShortcuts[dynamicRange[0]].value();
      } else if (dynamicRange.length === 2) {
        const startDate = new Date();
        const endDate = new Date();
        startDate.setHours(0, 0, 0);
        endDate.setHours(23, 59, 59);
        startDate.setDate(startDate.getDate() - dynamicRange[0]);
        endDate.setDate(endDate.getDate() - dynamicRange[1]);
        pickerDate = [startDate, endDate];
      }
    }
    return { dateType, pickerDate, shortcut };
  }

  if (!range || range.length <= 0) {
    // 没有初始化数据时，默认设置过去7天
    range = [TimeUtil.firstSecondOfDate(defaultDate[0]), TimeUtil.lastSecondOfDate(defaultDate[1])];
    rangeContrast = null;
    emit('update:modelValue', range);
    emit('update:contrastValue', rangeContrast);
    // emit('change', range, rangeContrast);
  }

  const tmp = convert2Date(range);
  dateType.value = props.dynamicSupport ? tmp.dateType : 'static';
  shortcut.value = tmp.shortcut;
  pickerDate.value = tmp.pickerDate;

  // 是否已开启对比
  if (rangeContrast && rangeContrast.length > 0) {
    isContrast.value = true;
    const tmp = convert2Date(rangeContrast);
    pickerDateContrast.value = tmp.pickerDate;
    shortcutContrast.value = tmp.shortcut;
    dateRangeStrContrast.value = pickerDatePreviewContrast.value;
  } else {
    isContrast.value = false;
    pickerDateContrast.value = null;
    shortcutContrast.value = '';
  }

  dateRangeStr.value = pickerDatePreview.value;
}

// 控制面板是否展开
const popoverVisible = ref(false);
function cancel() {
  popoverVisible.value = false;
}

/**
 * 点击确定，转换 date picker数据并提交
 */
function submit() {
  const getDynamicRange = (dateRange, shortcut) => {
    if (!dateRange || dateRange.length === 0) {
      return null;
    }
    const shortcutIndex = dateRangeShortcuts.slice(0, 9).findIndex(v => v.text === shortcut);
    if (shortcutIndex >= 0) {
      return [`${shortcutIndex}`];
    } else {
      const today = new Date().setHours(0, 0, 0, 0);
      const [start, end] = dateRange
        .map(v => new Date(v).setHours(0, 0, 0, 0))
        .map(v => Math.floor((today - v) / (60 * 60 * 1000 * 24)));
      return [`${start},${end}`];
    }
  };

  let range;
  let rangeContrast;
  if (props.dynamicSupport && dateType.value === 'dynamic') {
    range = getDynamicRange(pickerDate.value, shortcut.value);
    if (isContrast.value) {
      rangeContrast = getDynamicRange(pickerDateContrast.value, shortcutContrast.value);
    }
  } else {
    range = [
      TimeUtil.firstSecondOfDate(pickerDate.value[0]),
      TimeUtil.lastSecondOfDate(pickerDate.value[1])
    ];
    if (isContrast.value) {
      rangeContrast = [
        TimeUtil.firstSecondOfDate(pickerDateContrast.value[0]),
        TimeUtil.lastSecondOfDate(pickerDateContrast.value[1])
      ];
    }
  }
  dateRangeStr.value = pickerDatePreview.value;
  dateRangeStrContrast.value = pickerDatePreviewContrast.value;
  emit('update:modelValue', range);
  emit('update:contrastValue', isContrast.value ? rangeContrast : null);
  emit('change', range, isContrast.value ? rangeContrast : null);
  popoverVisible.value = false;
}

watch(
  [() => props.modelValue, () => props.contrastValue],
  () => {
    initPickerData(props.modelValue, props.contrastValue);
  },
  {
    immediate: true
  }
);

watch(
  pickerDate,
  cur => {
    props.useCache && setDateCache(cur);
  },
  {
    immediate: true
  }
);
</script>

<template>
  <el-popover
    placement="bottom-start"
    :width="666"
    trigger="click"
    v-model:visible="popoverVisible"
    @hide="initPickerData()"
    :popper-options="{
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top-start']
          }
        }
      ]
    }"
  >
    <!-- 显示内容 -->
    <template #reference>
      <div class="st-date-value" :class="borderTheme ? 'st-date-border' : ''">
        <StIcon icon="date" type="info" class="opacity-75 -ml-1" />
        <slot><span v-html="showedDateRangeStr"></span></slot>
      </div>
    </template>

    <!-- 日期类型 -->
    <header class="st-date-header">
      <el-tabs v-if="dynamicSupport" v-model="dateType">
        <el-tab-pane label="动态时间" name="dynamic"></el-tab-pane>
        <el-tab-pane label="静态时间" name="static"></el-tab-pane>
      </el-tabs>
      <div></div>
      <!-- 日期数值 -->
      <span class="ml-2 mr-1.5">{{ pickerDatePreview }}</span>
    </header>

    <!-- 日期选择器 -->
    <PanelDatePicker
      v-model:dateRange="pickerDate"
      v-model:shortcut="shortcut"
      :maxRange="maxRange"
    />

    <!-- 日期对比选项 -->
    <div class="flex h-10 leading-10">
      <el-checkbox
        v-if="contrastSupport"
        class="w-36 ml-px"
        v-model="isContrast"
        @change="handleContrastCheckbox"
      >
        添加对比
      </el-checkbox>
      <div v-if="isContrast" class="flex flex-grow justify-end">
        <span class="ml-2 mr-1.5">{{ pickerDatePreviewContrast }}</span>
      </div>
    </div>

    <!-- 日期对比选择器 -->
    <PanelDatePicker
      v-if="isContrast"
      :isContrastPanel="true"
      v-model:isPrevCycle="isPrevCycle"
      v-model:dateRange="pickerDateContrast"
      v-model:shortcut="shortcutContrast"
      :maxRange="maxRange"
    />

    <!-- 操作按钮 -->
    <div class="w-full mt-3 flex justify-end" :style="!isContrast ? { marginTop: '-1.75rem' } : {}">
      <el-button @click="cancel" size="mini">取消</el-button>
      <el-button @click="submit" size="mini" type="primary">确定</el-button>
    </div>
  </el-popover>
</template>

<style scoped lang="postcss">
.st-date-value {
  min-width: 13rem;
  @apply inline-flex items-center text-center rounded whitespace-nowrap px-2 h-7 text-sm leading-7 bg-blue-150 cursor-pointer select-none;
}
.st-date-border {
  border-radius: 0.1875rem;
  @apply text-gray-650 border border-solid border-gray-200 bg-transparent hover:bg-blue-150;
}
.st-date-header {
  border-color: var(--el-border-color-light);
  @apply h-8 mb-3 w-full flex justify-between leading-8 border-b-2 border-solid;
}
:deep(.el-tabs--top .el-tabs__item.is-top) {
  @apply px-5 h-8 leading-8 !important;
}
</style>
