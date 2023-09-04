<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { onMounted, reactive, watch } from 'vue';

const dialog = reactive({
  visible: false,
  title: '',
  option: {
    icon: '',
    size: 6,
    type: '',
    round: 0,
    border: 0,
    rotate: 0,
    fill: false,
    plain: false,
    pointer: true,
    disabled: false,
    zoom: false
  }
});

const example = reactive({
  list: [] as { icon: string }[]
});

const getClass = (index: number): object => {
  const _class = {} as any;

  _class['last-row'] = index > Math.floor(example.list.length / 7) * 7 - 1;
  _class[`row-${Math.floor(index / 7) + 1}`] = true;
  _class[`col-${(index % 7) + 1}`] = true;

  return _class;
};

const copyText = (value: string | object) => {
  let message = '';
  if (value !== 'object') message = `<StIcon icon='${value}' />`;
  else {
    const { icon, size, type, round, border, rotate } = dialog.option;
    const { fill, plain, pointer, disabled, zoom } = dialog.option;
    const iconStr = icon ? ` icon='${icon}'` : '';
    const sizeStr = size !== 6 ? ` :size='${size}'` : '';
    const typeStr = type ? ` type='${type}'` : '';
    const roundStr = round !== 3 ? ` :round='${round}'` : '';
    const borderStr = border !== 0 ? ` :border='${border}'` : '';
    const rotateStr = rotate !== 0 ? ` :rotate='${rotate}'` : '';
    const fillStr = fill ? ` fill` : '';
    const plainStr = plain && !fill ? ` plain` : '';
    const pointerStr = !pointer ? ` :pointer='false'` : '';
    const disabledStr = disabled ? ` disabled` : '';
    const zoomStr = zoom ? ` zoom` : '';
    message = `<StIcon${iconStr}${sizeStr}${typeStr}${roundStr}${borderStr}${rotateStr}${fillStr}${plainStr}${pointerStr}${disabledStr}${zoomStr}/>`;
  }
  // console.log(value, value !== 'object', message)

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        ElMessage.success('复制成功');
      })
      .catch(err => {
        ElMessage.error('复制失败');
      });
  } else {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', message);
    input.select();
    if (document.execCommand('copy')) {
      ElMessage.success('复制成功');
    } else {
      ElMessage.error('复制失败');
    }
    document.body.removeChild(input);
  }
};

const onEdit = (value: string) => {
  dialog.visible = true;
  dialog.title = value;
  dialog.option.icon = value;
};

const onReset = () => {
  Object.assign(dialog.option, {
    size: 6,
    type: 'info',
    round: 3,
    border: 0,
    rotate: 0,
    fill: false,
    plain: false,
    pointer: true,
    disabled: false,
    zoom: false
  });
};

const getIcons = () => {
  const app = document.querySelector('#app');
  const symbolParent = app!.firstElementChild;
  const symbolList = symbolParent!.children;
  let index = symbolList.length;
  const icons = [] as string[];
  while (index-- > 0) {
    const symbolEl = symbolList.item(index);
    const iconName = symbolEl!.id.replace(/^(icon\-)/i, '');
    icons.push(iconName);
  }
  return icons.map(item => ({
    icon: item
  }));
};

onMounted(() => {
  example.list = getIcons();
});
</script>

<template>
  <a id="icon" />
  <div class="icon-use">
    <header>
      <span>StIcon 图标</span>
      <span class="flex-grow"></span>
      <span class="text-gray-400 text-sm leading-7 font-normal"> 点击复制代码 </span>
    </header>
    <main>
      <div
        v-for="(item, index) in example.list"
        :key="index"
        :class="getClass(index)"
        @click="copyText(item.icon)"
        @contextmenu.prevent="onEdit(item.icon)"
        class="item"
      >
        <StIcon :icon="item.icon" :size="7" class="border-gray-500" />
        <div class="id">{{ item.icon }}</div>
      </div>
    </main>
    <footer class="h-16 mb-5"></footer>
  </div>

  <el-dialog v-model="dialog.visible" :width="800" :close-on-click-modal="false" class="icon-use-dialog">
    <template #header>
      <div class="flex">
        <div class="flex w-52 justify-between">
          <span class="select-text">{{ `icon-${dialog.title}` }}</span>
          <span>{{ `${dialog.option.size * 4}px` }}</span>
        </div>
        <div class="ml-4">
          <el-button size="mini" @click="onReset()"> 重置 </el-button>
        </div>
      </div>
    </template>

    <div class="icon-box relative">
      <StIcon v-bind="dialog.option" class="bg-white" />
      <div class="copy" @click="copyText('object')">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M768 832a128 128 0 01-128 128H192A128 128 0 0164 832V384a128 128 0 01128-128v64a64 64 0 00-64 64v448a64 64 0 0064 64h448a64 64 0 0064-64h64z"
          />
          <path
            fill="currentColor"
            d="M384 128a64 64 0 00-64 64v448a64 64 0 0064 64h448a64 64 0 0064-64V192a64 64 0 00-64-64H384zm0-64h448a128 128 0 01128 128v448a128 128 0 01-128 128H384a128 128 0 01-128-128V192A128 128 0 01384 64z"
          />
        </svg>
      </div>
    </div>
    <div class="icon-option text-gray-500">
      <el-descriptions :border="true" :column="1" size="small">
        <el-descriptions-item label="type">
          <el-radio-group v-model="dialog.option.type" size="mini">
            <el-radio-button label="primary">主要</el-radio-button>
            <el-radio-button label="success">成功</el-radio-button>
            <el-radio-button label="warning">警告</el-radio-button>
            <el-radio-button label="danger">危险</el-radio-button>
            <el-radio-button label="info">信息</el-radio-button>
            <el-radio-button label="">默认</el-radio-button>
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item label="size">
          <el-slider
            v-model="dialog.option.size"
            :min="3"
            :max="30"
            show-input
            input-size="mini"
            :show-tooltip="false"
            :marks="{ 6: '' }"
          />
        </el-descriptions-item>
        <el-descriptions-item label="round">
          <el-slider
            v-model="dialog.option.round"
            :min="0"
            :max="60"
            show-input
            input-size="mini"
            :show-tooltip="false"
            :marks="{ 3: '' }"
          />
        </el-descriptions-item>
        <el-descriptions-item label="rotate">
          <el-slider
            v-model="dialog.option.rotate"
            :min="-180"
            :max="180"
            show-input
            input-size="mini"
            :show-tooltip="false"
            :marks="{ '-90': '', 0: '', 90: '' }"
          />
        </el-descriptions-item>
        <el-descriptions-item label="border">
          <el-slider v-model="dialog.option.border" :min="0" :max="10" show-input input-size="mini" :show-tooltip="false" />
        </el-descriptions-item>
        <el-descriptions-item label="boolean">
          <div class="flex justify-between">
            <el-switch v-model="dialog.option.fill" active-text="填充" />
            <el-switch v-model="dialog.option.plain" active-text="朴素" />
            <el-switch v-model="dialog.option.pointer" active-text="指针" />
            <el-switch v-model="dialog.option.disabled" active-text="禁用" />
            <el-switch v-model="dialog.option.zoom" active-text="放大" />
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<style lang="postcss" scoped>
.icon-use {
  width: 880px;
  @apply bg-white absolute left-1/2 transform -translate-x-1/2 my-10 divide-y divide-gray-200;
}
.icon-use > header {
  @apply p-4 text-xl select-none text-gray-600 border border-b-0 border-solid border-gray-200 flex;
}
.icon-use > main {
  @apply grid grid-cols-7 border border-solid border-gray-200;
}
.icon-use > main > .item {
  @apply p-2 h-24 flex flex-col items-center justify-center box-border cursor-pointer;
  @apply border-r border-b border-solid border-gray-200 text-gray-500;
  @apply hover:bg-gray-50 hover:text-blue-400;
}
.icon-use > main > .item:hover :deep(.st-svg-icon) {
  @apply border-blue-400 !important;
}
.icon-use > main > .item:nth-child(7n) {
  @apply border-r-0;
}
.icon-use > main > .item.last-row {
  @apply border-b-0;
}
.icon-use > main > .item > .id {
  @apply text-sm font-light opacity-60 mt-1.5 whitespace-nowrap;
}
</style>

<style lang="postcss">
.icon-use-dialog .el-dialog__body {
  @apply pt-1 flex;
}

.icon-use-dialog .icon-box {
  @apply w-52 flex items-center justify-center flex-shrink-0;
  @apply bg-gray-200 rounded;
}
.icon-use-dialog .icon-box .st-svg-icon {
  @apply transition-none !important;
}
.icon-use-dialog .icon-box:hover .st-svg-icon {
  @apply transition-all !important;
}
.icon-use-dialog .icon-box .copy {
  @apply w-7 h-8 p-1.5 flex items-center justify-center cursor-pointer rounded absolute bottom-0 right-0 bg-gray-300 opacity-75;
}

.icon-use-dialog .icon-option {
  @apply flex-grow ml-4;
}
.icon-use-dialog .icon-option .el-switch__label:not(.is-active) {
  @apply text-gray-500;
}
</style>
