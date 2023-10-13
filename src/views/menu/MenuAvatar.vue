<script setup lang="ts">
// import { accountInfo } from '@/services/data/account';
// import { StSvgUse } from '@/components/base/st-svg-use';
// import logout from '@/assets/feather-icons/log-out.svg?obj';
// import user from '@/assets/feather-icons/user.svg?obj';

type Emits = {
  (e: 'click', type: string): void;
};

const emits = defineEmits<Emits>();
</script>

<template>
  <el-dropdown
    class="mr-5"
    trigger="click"
    placement="bottom-start"
    popper-class="shadow-light w-fit"
    @command="(type: string) => emits('click', type)"
  >
    <el-avatar class="menu-user" :size="36"><StIcon icon="user4" :size="7" :round="99" /></el-avatar>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="user">
          <!-- <StSvgUse :svg="user"></StSvgUse> -->
          <span class="pl-2">个人中心</span>
        </el-dropdown-item>

        <el-dropdown-item divided command="logout">
          <!-- <StSvgUse :svg="logout"></StSvgUse> -->
          <span class="pl-2">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="postcss">
.menu-user {
  @apply bg-[#5e6c89] select-none my-3 cursor-pointer;
}
</style>

<style lang="postcss">
.menu-user__username {
  @apply -my-[5px] -mx-4 py-[5px] px-[18px] min-w-[120px];
  @apply cursor-default truncate bg-white text-gray-600;
}
</style>
