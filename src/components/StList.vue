<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['list', 'label'],
  emits: ['select']
});
</script>

<template>
  <ul class="st-list">
    <li
      v-for="(item, i) in list"
      :key="i"
      class="w-full h-7 px-2 text-sm leading-7 cursor-pointer hover:bg-blue-150 truncate"
      :class="{
        'text-blue-650': label === item.name
      }"
      :title="item.name"
      @click="$emit('select', i, item)"
    >
      <slot :item="item">
        <span>{{ item.name }}</span>
      </slot>
    </li>
  </ul>
</template>

<style lang="postcss" scoped></style>
