<script lang="ts" setup>
import DOMPurify from 'dompurify';

const props = defineProps<{
  writString: string;
}>();

const writHTMLString = DOMPurify.sanitize(props.writString);
</script>

<template>
  <main class="overflow-y-auto w-full h-full">
    <section v-if="false" class="flex justify-center pt-10">
      <div class="font-bold text-xl">查询人{{ '-' }} 没有案底</div>
    </section>
    <section v-else v-html="writHTMLString" ref="writ-container" class="py-8 sm:px-14 px-3"></section>
  </main>
</template>

<style lang="postcss" scoped></style>
