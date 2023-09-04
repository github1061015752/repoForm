<script setup lang="ts">
import { computed, ComputedRef, onMounted, reactive, watch } from 'vue';

interface Item {
  key: string | number; // 选项唯一标识
  name?: string; // 名称, @input会被替换成输入框
  value?: any | number[]; // 数据，@input时为输入框默认值
  tips?: string; // 提示词
  input?: {
    max: number; // 最大值
    min: number; // 最小值
    width?: number; // 宽度，默认 16
    placeholder?: string; // 提示词
  }[]; // 自定义输入配置,
  divide?: boolean; // 分组
}
interface Option {
  type?: 'radio' | 'checkbox'; // 类型
  width?: number; // 显示文本的宽度
  showIcon?: boolean; // 是否显示按钮
  checkAll?: boolean | string; // 是否全选、全选名称
  placeholder?: string; // 提示词
}
interface Popper {
  class?: string; // 自定义 popper 类名
  arrow?: boolean; // 箭头
  width?: number; // 宽度
  height?: number; // main最大高度
  modifiers?: object; // 位置
}
interface Header {
  title?: string; // 名称
  tips?: string; // 提示词
  search?: string | boolean; // 搜索词
}
interface Footer {
  confirm?: string | boolean; // 确认按钮
  cancel?: string | boolean; // 取消按钮
}

interface Props {
  modelValue: { key: string | number; value: any; input?: number[] }[]; // 选中值
  option?: Option; // 选项配置
  popper?: Popper; // 弹框配置
  header?: Header; // 顶部配置
  footer?: Footer; // 底部配置
  data?: Item[]; // 选项数据
}
interface Emits {
  (e: 'confirm', value: { key: string; value: any; input?: number[] }[]): void;
  (e: 'update:modelValue', value: { key: string; value: any; input?: number[] }[]): void;
}
interface State {
  optionSet: Option; // 选项配置
  popperSet: Popper; // 弹窗配置
  footerSet: Footer; // 底部配置
  headerSet: Header; // 顶部配置

  isInit: boolean; // 是否初始化中
  search?: string; // 搜索内容
  searchResult: ComputedRef; //搜索结果
  visible: boolean; // 弹窗显示
  select: { key: string; value: any; input?: number[] }[]; // 选中数据
  data: { [key: string]: Item }; // 选项数据
  previous: {
    select?: string[];
    data?: { [key: string]: Item };
  }; // 备份，用于取消时恢复数据
  valueText: ComputedRef; // 显示的值

  hasItemTips: ComputedRef; // 是否含有提示词
  vxeListHeight: ComputedRef; // 虚拟滚动的高度

  getOptionClass: Function; // 获取选项样式类
  getCheckAllClass: Function; // 获取全选样式类

  onUpdate: Function; // modelValue 更新事件
  onCheckAll: Function; // 全选事件
  onCheckItem: Function; // 多选事件
  onConfirm: Function; // 确定事件
  onCancel: Function; // 取消事件
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [
    { key: '1', name: '选项1', value: 1 },
    { key: '2', name: '选项2', value: 1 },
    {
      key: '3',
      name: '自定义@input',
      value: [1],
      input: [{ min: 1, max: 10, placeholder: 'cs', width: 12 }]
    },
    { key: '4', name: '选项4', value: 1 },
    { key: '11', name: '这是一个很长很长很长很长很长的选项', value: 1 },
    { key: '12', name: '选项12', value: 1 },
    { key: '13', name: '选项13', value: 1 },
    { key: '14', name: '选项14', divide: true, value: 1 },
    { key: '15', name: '选项15', value: 1 },
    { key: '21', name: '选项21', value: 1 },
    { key: '22', name: '选项22', value: 1 },
    { key: '23', name: '选项23', value: 1 },
    { key: '24', name: '选项24', value: 1 },
    { key: '25', name: '选项25', value: 1 }
  ]
});

const emits = defineEmits<Emits>();

const defaultOption = {
  type: 'checkbox',
  width: 32,
  showIcon: true,
  checkAll: true
};

const defaultPopper = {
  arrow: true,
  width: 32,
  height: 200,
  modifiers: [
    {
      name: 'flip',
      options: {
        fallbackPlacements: [
          ...['bottom-start', 'bottom-end'],
          ...['top', 'top-start', 'top-end'],
          ...['right', 'right-start', 'right-end'],
          ...['left', 'left-start', 'left-end']
        ]
      }
    }
  ]
};

const state: State = reactive<State>({
  optionSet: Object.assign(defaultOption, props.option),
  popperSet: Object.assign(defaultPopper, props.popper),
  footerSet: Object.assign({}, props.footer),
  headerSet: Object.assign({}, props.header),

  isInit: false,
  search: undefined,
  searchResult: computed(() => {
    const reg = new RegExp(state.search || '', 'i');
    return Object.values(state.data).filter(v => reg.test(v.name || ''));
  }),
  visible: false,
  select: [],
  data: {},
  previous: { select: [], data: {} },

  valueText: computed(() => {
    if (state.optionSet.type === 'checkbox')
      return `${state.optionSet.placeholder || ''}(${state.select.length}/${props.data.length})`;

    const { name, value, input } = state.data[state.select[0]?.key] || {};
    if (!name) return '';
    if (!input) return name;
    if (input.length === 1) return name.replace('@input', value[0] + '');
    return value.reduce((pre: number, cur: number, index: number) =>
      (index === 1 ? name.replace('@input', pre + '') : pre + '').replace('@input', cur + '')
    );
  }),
  hasItemTips: computed(() => Object.keys(state.data).some(key => state.data[key].tips)),
  vxeListHeight: computed(() => {
    const divideList = props.data.filter(item => item.divide);
    const optionList = props.data.filter(item => !item.divide);
    const defaultHeight = state.popperSet.height || 200;
    const optionHeight = optionList.length * 30;
    let divideHeight = 0;
    divideList.forEach(item => {
      divideHeight += item.name ? 31 : 13;
    });

    return Math.min(defaultHeight, optionHeight + divideHeight);
  }),
  getOptionClass: (key: string) => {
    return {
      option: true,
      checked: state.select.map(v => v.key).includes(key),
      radio: state.optionSet.type === 'radio',
      checkbox: state.optionSet.type === 'checkbox'
    };
  },
  getCheckAllClass: () => {
    const optionList = Object.values(state.data).filter(item => !item.divide);

    return {
      'option checkbox checkbox-all': true,
      'checked-all': state.select.length === optionList.length,
      'checked-some': state.select.length && state.select.length < optionList.length
    };
  },

  onCheckAll: () => {
    const optionList = Object.values(state.data).filter(item => !item.divide);
    state.select =
      state.select.length < optionList.length
        ? optionList.map(({ key, value }) => JSON.parse(JSON.stringify({ key, value })))
        : [];
  },
  onCheckItem: (key: any, value: any) => {
    const item = { key, value };
    if (state.optionSet.type === 'radio') {
      state.select = [item];
    } else {
      const index = state.select.findIndex(item => item.key === key);
      if (index === -1) state.select.push(item);
      else state.select.splice(index, 1);
    }
  },
  onConfirm: () => {
    state.visible = false;
    state.search = undefined;
    // 更新数据
    const result = state.select;
    emits('update:modelValue', result);
    emits('confirm', result);
  },
  onCancel: () => {
    state.visible = false;
    state.search = undefined;
    // 重置数据
    state.select = JSON.parse(JSON.stringify(state.previous.select));
    state.data = JSON.parse(JSON.stringify(state.previous.data));
  },
  onUpdate: () => {
    // 更新 state
    state.select = JSON.parse(JSON.stringify(props.modelValue));
    // state.data = Object.fromEntries(props.data.map(item => [item.key, item]));
    // 更新 previous
    state.previous = JSON.parse(
      JSON.stringify({
        select: state.select,
        data: state.data
      })
    );
  }
});

// 监听 modelValue，更新 select 和 data
watch(
  () => props.modelValue,
  () => state.onUpdate(),
  { deep: true }
);

// 监听 select，如果是单选且没有确定按钮，自动确定
watch(
  () => state.select,
  () => {
    if (state.isInit) return (state.isInit = false);
    if (state.optionSet.type === 'checkbox') return;
    if (!state.footerSet.confirm) state.visible = false;
  },
  { deep: true }
);

// 监听选项, 更新选项相关数据
watch(
  () => props.data,
  () => {
    state.data = Object.fromEntries(props.data.map(item => [item.key, item]));
    state.previous.data = JSON.parse(JSON.stringify(state.data));
  },
  { deep: true }
);

onMounted(() => {
  state.isInit = true;
  state.data = Object.fromEntries(props.data.map(item => [item.key, item]));
  state.onUpdate();
});
</script>

<template>
  <el-popover
    :popper-class="`st-dropdown-pro-popper ${state.popperSet.class}`"
    placement="bottom-start"
    trigger="click"
    v-model:visible="state.visible"
    :hide-after="0"
    :show-arrow="state.popperSet.arrow"
    :popper-options="state.popperSet"
    :width="(state.popperSet.width || state.optionSet.width || 32) / 4 + 'rem'"
    @hide="state.footerSet.confirm ? state.onCancel() : state.onConfirm()"
  >
    <template #reference>
      <slot name="value" :value="state.valueText" :placeholder="state.optionSet.placeholder">
        <div
          class="st-dropdown-value"
          :style="{ width: state.optionSet.width ? state.optionSet.width / 4 + 'rem' : '' }"
        >
          <slot name="value-icon"></slot>
          <slot name="value-text">
            <div >
              {{ state.valueText || state.optionSet.placeholder || '请选择' }}
            </div>
          </slot>
        </div>
      </slot>
    </template>

    <!-- 标题 -->
    <header v-if="state.headerSet.title">
      <slot name="header" :title="state.headerSet.title" :tips="state.headerSet.tips">
        <div class="leading-5 mb-1 py-px flex items-center">
          <div class="w-0 flex-grow truncate">{{ state.headerSet.title }}</div>
          <el-tooltip :content="state.headerSet.tips" v-if="state.headerSet.tips" placement="top">
            <StIcon
              v-bind="{ icon: 'tips', size: 3.6, border: 1, round: 100, type: 'info' }"
              class="opacity-75 flex-none"
            />
          </el-tooltip>
        </div>
      </slot>
    </header>

    <!-- 搜索框 -->
    <header v-else-if="state.headerSet.search">
      <div class="leading-5 -mt-0.5 py-px flex items-center">
        <el-input
          class="w-0 flex-grow truncate"
          :placeholder="state.headerSet.search === true ? '搜索' : state.headerSet.search"
          v-model="state.search"
          size="mini"
          clearable
        />
        <StIcon
          v-if="!state.search"
          v-bind="{ icon: 'search', size: 4, zoom: true, type: 'info' }"
          class="opacity-75 flex-none"
        />
      </div>
    </header>

    <main style="min-height: 44px">
      <slot name="main">
        <!-- 全选 -->
        <div
          v-if="state.optionSet.type === 'checkbox' && state.optionSet.checkAll && !state.search"
          :class="state.getCheckAllClass()"
          @click="state.onCheckAll()"
        >
          <slot
            name="check-all"
            :isCheckAll="state.select.length === Object.keys(state.data).length"
            :isCheckSome="
              state.select.length && state.select.length < Object.keys(state.data).length
            "
          >
            <div class="button" />
            <div class="truncate flex-grow w-full">
              {{ state.optionSet.checkAll === true ? '全选' : state.optionSet.checkAll }}
            </div>
          </slot>
        </div>

        <!-- 选项 -->
        <vxe-list
          :height="state.vxeListHeight"
          :data="state.searchResult"
          class="w-full overflow-x-hidden"
        >
          <template #default="{ items }">
            <div
              class="w-full overflow-x-hidden"
              v-for="{ name, input, tips, divide, key, value } in items"
              :key="key"
            >
              <div class="divide" v-if="divide && !state.search">{{ name }}</div>

              <div
                v-if="!divide"
                :class="state.getOptionClass(key)"
                @click="state.onCheckItem(key, value, input)"
              >
                <slot
                  name="option"
                  v-bind="{ name, input, tips, divide, key }"
                  :isChecked="state.select.includes(key)"
                >
                  <div v-if="state.optionSet.showIcon" class="button" />

                  <slot name="option-icon"></slot>

                  <div v-if="!input" class="truncate flex-grow w-full">{{ name }}</div>

                  <template v-else v-for="(item, index) in name.split('@input')" :key="index">
                    <div class="whitespace-nowrap">{{ item }}</div>
                    <el-input-number
                      v-if="index < name.split('@input').length - 1"
                      v-model="value[index]"
                      v-bind="{ ...input[index], size: 'mini', controls: false }"
                      :style="{ width: `${(input[index].width || 16) / 4}rem` }"
                    />
                  </template>
                  <div class="flex-grow" />

                  <StTooltip v-if="tips" :content="tips" placement="top">
                    <StIcon
                      v-bind="{ icon: 'tips', size: 3.6, border: 1, round: 100, type: 'info' }"
                      class="opacity-75 flex-none"
                    />
                  </StTooltip>
                  <div v-else-if="state.hasItemTips" class="w-4 h-4 flex-none" />
                </slot>
              </div>
            </div>
          </template>
        </vxe-list>
      </slot>
    </main>

    <footer v-if="state.footerSet.confirm || state.footerSet.cancel">
      <slot name="footer" :cancel="state.onCancel" :confirm="state.onConfirm">
        <el-button size="mini" @click="state.onCancel()" v-if="state.footerSet.cancel">
          取消
        </el-button>

        <el-button
          v-if="state.footerSet.confirm"
          v-bind="{ size: 'mini', type: 'primary' }"
          @click="state.onConfirm()"
        >
          确认
        </el-button>
      </slot>
    </footer>
  </el-popover>
</template>

<style lang="postcss" scoped>
.st-dropdown-value {
  border-radius: 3px;
  @apply inline-flex items-center align-top h-7 px-3 cursor-pointer select-none;
  @apply border border-solid border-gray-200;
  @apply hover:bg-blue-50;
}
.st-dropdown-value > div {
  @apply flex-grow truncate text-sm text-gray-500;
}
</style>

<style lang="postcss">
.st-dropdown-pro-popper {
  min-width: 4rem !important;
  @apply p-0 select-none text-gray-500 !important;
}

.st-dropdown-pro-popper header {
  @apply pt-2 pb-0.5 px-3 box-border font-medium;
  @apply border-b border-solid border-gray-200;
}
.st-dropdown-pro-popper header .el-input {
  @apply block;
}
.st-dropdown-pro-popper header .el-input__inner {
  @apply pl-0 pr-5 border-none outline-none text-sm leading-6 h-6;
}
.st-dropdown-pro-popper header .el-input__suffix {
  @apply transform translate-x-2.5;
}

.st-dropdown-pro-popper main {
  @apply grid py-2 relative;
}
.st-dropdown-pro-popper main .divide {
  @apply text-gray-400 text-xs ml-3 mr-1 pt-2 pb-1.5 mb-1.5;
  @apply border-b border-solid border-gray-200;
}
.st-dropdown-pro-popper main .divide:empty {
  @apply pt-0;
}

.st-dropdown-pro-popper main .option {
  min-height: 30px;
  @apply flex items-center px-1.5 ml-1.5 box-border cursor-pointer rounded-sm;
  @apply hover:bg-blue-50;
}
.st-dropdown-pro-popper main .option.checkbox-all {
  min-height: 36px;
  @apply mb-2 -mt-2 mx-0 px-3 border-b border-solid border-gray-200;
  @apply hover:bg-white;
}
.st-dropdown-pro-popper main .option .button {
  @apply flex-none w-3.5 h-3.5 relative box-border mr-1.5 bg-white;
  transition: transform 0.15s ease-in 0.05s;
}
.st-dropdown-pro-popper main .option .button::after {
  content: ' ';
}

.st-dropdown-pro-popper main .option.radio .button {
  @apply border border-solid border-gray-200 rounded-full;
  transition: transform 0.15s ease-in 0.05s;
}
.st-dropdown-pro-popper main .option.checkbox .button {
  @apply border border-solid border-gray-200 rounded-sm;
}

.st-dropdown-pro-popper main .option.checked.radio,
.st-dropdown-pro-popper main .option.checked.checkbox,
.st-dropdown-pro-popper main .option.checked-all.checkbox,
.st-dropdown-pro-popper main .option.checked-some.checkbox {
  @apply text-blue-400;
}
.st-dropdown-pro-popper main .option.checked.radio .button,
.st-dropdown-pro-popper main .option.checked.checkbox .button,
.st-dropdown-pro-popper main .option.checked-all.checkbox .button,
.st-dropdown-pro-popper main .option.checked-some.checkbox .button {
  @apply border-blue-400 bg-blue-400;
}
.st-dropdown-pro-popper main .option.checked.radio .button::after {
  @apply w-1 h-1 rounded-full bg-white;
  @apply absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
}
.st-dropdown-pro-popper main .option.checked.checkbox .button::after,
.st-dropdown-pro-popper main .option.checked-all.checkbox .button::after {
  @apply w-1 h-2 border-r border-b border-solid border-white;
  @apply absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-2/3 rotate-45;
}
.st-dropdown-pro-popper main .option.checked-some.checkbox .button::after {
  @apply w-1.5 h-px border-t border-solid border-white;
  @apply absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
}

.st-dropdown-pro-popper main .option .el-input-number {
  @apply text-center mx-1;
}
.st-dropdown-pro-popper main .option .el-input-number .el-input__inner {
  @apply px-0.5 h-6 box-border;
  --el-input-border-radius: 3px;
  border: var(--el-input-border, var(--el-border-base)) !important;
}

.st-dropdown-pro-popper footer {
  @apply flex justify-end py-2 px-3 box-border;
  @apply border-t border-solid border-gray-200;
}
.st-dropdown-pro-popper footer .el-button {
  @apply px-2.5 py-1.5 h-auto font-normal min-h-0;
}

.st-dropdown-pro-popper .vxe-list--virtual-wrapper {
  @apply overflow-y-scroll;
}
.st-dropdown-pro-popper .vxe-list--body {
  @apply w-full overflow-x-hidden;
}

.st-dropdown-pro-popper ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.st-dropdown-pro-popper ::-webkit-scrollbar-track {
  background: transparent;
}
.st-dropdown-pro-popper ::-webkit-scrollbar-thumb {
  background-color: rgba(167, 168, 168, 0.25);
  border-radius: 5px;
  border-color: transparent;
  background-clip: padding-box;
  border-right: 1px transparent solid;
}
</style>
