<script lang="ts" setup>
import { watch, PropType, reactive, computed } from 'vue';

interface Options {
  key: string;
  name: string;
  children: any[];
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<Options[]>,
    required: true
  },
  options: {
    type: Array as PropType<Options[]>,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const state = reactive({
  visible: false,
  activeTab: props.options[0].key,
  keyword: '',
  checkAll: computed((): boolean[] => Array(props.options.length).fill(true)),
  selected: [] as Options[],
  onCancel: () => {
    state.selected = props.modelValue;
    state.visible = false;
  },
  onConfirm: () => {
    emit('update:modelValue', JSON.parse(JSON.stringify(state.selected)));
    state.visible = false;
  }
});

watch(
  () => props.options,
  () => {
    state.selected = JSON.parse(JSON.stringify(props.options));
  },
  { immediate: true, deep: true }
);

function handleCheckAllChange(value: boolean, index: number) {
  const children = JSON.parse(JSON.stringify(props.options[index].children));
  state.selected[index].children = value ? children.slice() : children.slice(0, 1);
  state.checkAll[index] = true;
}
</script>

<template>
  <el-popover
    popper-class="st-dropdown-pro-plus-popper"
    placement="bottom-start"
    :width="450"
    trigger="click"
    v-model:visible="state.visible"
    :popper-options="{
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['bottom-end', 'top-start', 'right']
          }
        }
      ]
    }"
  >
    <template #reference>
      <div
        class="inline-flex items-center align-top h-7 px-3 rounded-3 cursor-pointer select-none text-sm text-gray-600 border border-solid border-gray-200 hover:bg-blue-50"
      >
        <slot>
          <p>维度过滤</p>
        </slot>
      </div>
    </template>

    <el-tabs tab-position="left" v-model="state.activeTab">
      <el-tab-pane
        v-for="(item, index) in options"
        :key="item.key"
        :label="item.name"
        :name="item.key"
      >
        <template #label>
          <div class="flex">
            <p class="max-w-20 truncate">{{ item.name }}</p>
            <p>
              {{ `(${state.selected[index].children.length}/${item.children.length})` }}
            </p>
          </div>
        </template>
        <div class="pl-3 w-full h-full flex flex-col">
          <el-input
            ref="inputRef"
            :autofocus="true"
            v-model="state.keyword"
            placeholder="输入关键字搜索（正则表达式）"
            size="mini"
            class="py-1"
          ></el-input>

          <div class="flex-grow overflow-auto pt-2">
            <el-scrollbar height="100%">
              <el-checkbox
                class="border-b w-full"
                v-model="state.checkAll[index]"
                :indeterminate="item.children.length !== state.selected[index].children.length"
                @change="handleCheckAllChange($event, index)"
                >全选</el-checkbox
              >
              <el-checkbox-group
                class="pt-1 w-full"
                v-model="state.selected[index].children"
                :min="1"
              >
                <vxe-list :height="Math.min(item.children.length * 28, 300)" :data="item.children">
                  <template #default="{ items }">
                    <ul class="flex flex-col flex-wrap space-y-1">
                      <li v-for="value in items">
                        <el-checkbox :label="value" />
                      </li>
                    </ul>
                  </template>
                </vxe-list>
              </el-checkbox-group>
            </el-scrollbar>
          </div>
        </div>
      </el-tab-pane>

      <footer>
        <el-button size="mini" @click="state.onCancel"> 取消 </el-button>

        <el-button size="mini" type="primary" @click="state.onConfirm"> 确认 </el-button>
      </footer>
    </el-tabs>
  </el-popover>
</template>

<style scoped></style>

<style>
.st-dropdown-pro-plus-popper ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.st-dropdown-pro-plus-popper ::-webkit-scrollbar-track {
  background: transparent;
}
.st-dropdown-pro-plus-popper ::-webkit-scrollbar-thumb {
  background-color: rgba(167, 168, 168, 0.25);
  border-radius: 5px;
  border-color: transparent;
  background-clip: padding-box;
  border-right: 1px transparent solid;
}

.st-dropdown-pro-plus-popper footer {
  @apply flex justify-end py-2 px-3 box-border;
  @apply border-t border-solid border-gray-200;
}
.st-dropdown-pro-plus-popper footer .el-button {
  @apply px-2.5 py-1.5 h-auto font-normal min-h-0;
}
</style>
