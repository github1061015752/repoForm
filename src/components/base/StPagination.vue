<script setup>
import { computed, reactive, watch } from 'vue';

const props = defineProps({
  pageIndex: { type: Number, default: 1 }, // 当前页码
  dataSize: { type: Number, default: 0 }, // 数据总数
  pageSize: { type: Number, default: 50 }, // 页面大小
  pageOption: { type: Array, default: [10, 20, 50, 100] }, // 页面大小选项
  showInfo: { type: Boolean, default: true }, // 显示页面大小跟数据总数
  placement: { type: String, default: 'top' }, // 弹出方向
  trigger: { type: String, default: 'click' }, // 触发方式
  resetIndexTo1: { type: Boolean, default: false } //修改页面大小重置当前页面为第一页
});
const emits = defineEmits([
  'update:pageSize', // 更新大小
  'update:pageIndex', // 更新页码
  'pageChange' // 页码或大小改变
]);

const state = reactive({
  pageSize: props.pageSize, // 页面大小
  pageTotal: computed(() => Math.ceil(props.dataSize / state.pageSize)),
  pageIndex: props.pageIndex || 1, // 当前页面
  pageVisible: false, // 显示分页器
  pageInput: undefined, // 页码输入
  // 页码表高度
  mainClass: computed(() => ({
    'h-36 py-2': state.pageTotal > 10,
    'h-28 py-3': state.pageTotal > 5 && state.pageTotal <= 10,
    'h-20 py-5': state.pageTotal <= 5
  })),
  // 页码表布局
  gridClass: computed(() => ({
    'st-page-container': true,
    'gap-y-2': state.pageTotal > 10,
    'gap-y-3': state.pageTotal > 5 && state.pageTotal <= 10
  }))
});

const onPageSizeChange = pageSize => {
  emits('update:pageSize', pageSize);
  if (state.pageIndex > state.pageTotal) {
    state.pageIndex = state.pageTotal;
    emits('update:pageIndex', state.pageTotal);
  }
  if (props.resetIndexTo1) state.pageIndex = 1;
  emits('pageChange', { pageIndex: state.pageIndex, pageSize: state.pageSize });
  state.pageVisible = false;
};
// 选中页码
const onClickItem = value => {
  emits('update:pageIndex', value);
  state.pageIndex = value;
  emits('pageChange', { pageIndex: state.pageIndex, pageSize: state.pageSize });
  state.pageVisible = false;
};
// 输入页码并确认
const onClickButton = () => {
  if (state.pageInput) {
    emits('update:pageIndex', Number(state.pageInput));
    state.pageIndex = Number(state.pageInput);
    emits('pageChange', { pageIndex: state.pageIndex, pageSize: state.pageSize });
    state.pageVisible = false;
  }
};
// 点击上一页
const onClickPrev = () => {
  if (state.pageIndex > 1) {
    state.pageIndex--;
    emits('update:pageIndex', state.pageIndex);
    emits('pageChange', { pageIndex: state.pageIndex, pageSize: state.pageSize });
  }
};
// 点击下一页
const onClickNext = () => {
  if (state.pageIndex < state.pageTotal) {
    state.pageIndex++;
    emits('update:pageIndex', state.pageIndex);
    emits('pageChange', { pageIndex: state.pageIndex, pageSize: state.pageSize });
  }
};

// 监听页码输入
watch(
  () => state.pageInput,
  () => {
    if (!state.pageInput) return;
    if (state.pageInput < 1) state.pageInput = 1;
    if (state.pageInput > state.pageTotal) state.pageInput = state.pageTotal;
  }
);
watch(
  () => props.pageIndex,
  () => {
    state.pageIndex = props.pageIndex;
  }
);
</script>

<template>
  <div class="st-pangination">
    <el-button-group size="small" class="mr-2">
      <!-- 上一页 -->
      <el-button
        class="arrow-left"
        size="small"
        :disabled="state.pageIndex <= 1"
        @click="onClickPrev()"
      >
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M609.408 149.376L277.76 489.6a32 32 0 000 44.672l331.648 340.352a29.12 29.12 0 0041.728 0 30.592 30.592 0 000-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 000-42.688 29.12 29.12 0 00-41.728 0z"
          ></path>
        </svg>
      </el-button>
      <!-- 下一页 -->
      <el-button
        class="arrow-right"
        size="small"
        :disabled="state.pageIndex >= state.pageTotal"
        @click="onClickNext()"
      >
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M340.864 149.312a30.592 30.592 0 000 42.752L652.736 512 340.864 831.872a30.592 30.592 0 000 42.752 29.12 29.12 0 0041.728 0L714.24 534.336a32 32 0 000-44.672L382.592 149.376a29.12 29.12 0 00-41.728 0z"
          ></path>
        </svg>
      </el-button>
    </el-button-group>

    <el-popover
      v-model:visible="state.pageVisible"
      :placement="placement || 'top'"
      :show-arrow="false"
      :width="320"
      :trigger="trigger || 'click'"
    >
      <!-- 分析器主体 -->
      <template #reference>
        <el-button size="small" class="st-pangination-page">
          {{ `${state.pageIndex} / ${state.pageTotal === 0 ? 1 : state.pageTotal} 页` }}
        </el-button>
      </template>
      <!-- 分页器弹窗 -->
      <div class="st-pangination-popover">
        <!-- header -->
        <header>
          <span class="text-sm leading-8">每页显示</span>
          <el-radio-group
            v-model="state.pageSize"
            @change="onPageSizeChange"
            size="small"
            class="opacity-95"
          >
            <el-radio-button v-for="item in pageOption" :key="item" :label="item"></el-radio-button>
          </el-radio-group>
        </header>

        <!-- main -->
        <main :class="state.mainClass">
          <el-scrollbar height="100%">
            <div :class="state.gridClass">
              <div
                v-for="item in state.pageTotal"
                @click="onClickItem(item)"
                :key="item"
                :class="[
                  item === state.pageIndex ? 'st-page-item__active' : 'st-page-item',
                  'whitespace-nowrap'
                ]"
              >
                {{ item }}
              </div>
            </div>
          </el-scrollbar>
        </main>

        <!-- footer -->
        <footer>
          <span class="text-sm leading-9 transform translate-y-px">前往页面</span>
          <div>
            <el-input
              size="small"
              v-model="state.pageInput"
              :placeholder="`1 ~ ${state.pageTotal === 0 ? 1 : state.pageTotal}`"
            ></el-input>
            <el-button size="small" type="primary" @click="onClickButton()">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M224 480h640a32 32 0 110 64H224a32 32 0 010-64z" />
                <path
                  fill="currentColor"
                  d="M237.248 512l265.408 265.344a32 32 0 01-45.312 45.312l-288-288a32 32 0 010-45.312l288-288a32 32 0 1145.312 45.312L237.248 512z"
                />
              </svg>
            </el-button>
          </div>
        </footer>
      </div>
    </el-popover>

    <el-button v-if="showInfo" size="small" class="st-pangination-info">
      {{ `${state.pageSize} 条/页` }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ `共 ${props.dataSize} 条` }}
    </el-button>
  </div>
</template>

<style lang="postcss" scoped>
/* 按钮样式 */
.st-pangination {
  @apply p-2 box-border inline-flex;
}
.st-pangination:deep() .el-button {
  @apply px-2 py-0 my-0.5 leading-7 h-7 opacity-95;
}
.st-pangination:deep() .arrow-left svg,
.st-pangination:deep() .arrow-right svg {
  @apply w-4 h-4;
}

.st-pangination-page {
  min-width: 6rem;
  @apply align-top;
}

.st-pangination-info {
  background: var(--el-button-background-color, var(--el-color-white));
  border-color: var(--el-button-border-color, var(--el-border-color-base));
  @apply ml-2 px-4 cursor-default text-gray-400 font-normal !important;
}

/* 弹出框样式 */
.st-pangination-popover {
  @apply flex flex-col -m-3 box-border select-none;
}
.st-pangination-popover > header {
  @apply text-base leading-9 py-2 px-4 flex justify-between;
}

/* Main样式 */
.st-pangination-popover > main {
  @apply box-border border-t border-b border-solid border-gray-200;
}
.st-pangination-popover > main .st-page-container {
  @apply px-4 box-border w-full grid grid-cols-5 gap-x-5;
}
.st-pangination-popover > main .st-page-item {
  @apply text-center w-10 h-8 my-0.5 mx-auto leading-9 cursor-pointer rounded transform duration-200 bg-gray-50 hover:bg-blue-100 hover:text-blue-400;
}
.st-pangination-popover > main .st-page-item__active {
  @apply text-center w-10 h-8 my-0.5 mx-auto leading-9 cursor-pointer rounded transform duration-200 bg-blue-100 text-blue-400;
}

/* Footer样式 */
.st-pangination-popover > footer {
  @apply text-base leading-9 py-2 px-4 flex justify-between;
}
.st-pangination-popover > footer:deep() .el-input {
  @apply w-20 my-0.5 align-top mr-2;
}
.st-pangination-popover > footer:deep() .el-input input {
  @apply text-sm pl-3 pr-0;
}
.st-pangination-popover > footer:deep() .el-button {
  @apply px-2 py-0 my-0.5 leading-7 h-7 opacity-95;
}
.st-pangination-popover > footer:deep() svg {
  @apply w-4 h-4 transform rotate-180;
}
</style>
