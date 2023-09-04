<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import logo from '@/assets/icon/logo.svg';
let username = ref('');
let password = ref('');
let isLoading = ref(false);
let isNewApp = 0;
/**
 * 用户登录
 * */
// function login() {
//   if (!username.value || !password.value) {
//     ElMessage.warning({
//       message: '用户名及密码不能为空!',
//       type: 'warning'
//     });
//     return;
//   }

//   let user = {
//     username: username.value,
//     password: password.value
//   };

//   isLoading.value = true;
//   apiAccount
//     .login(user)
//     .then(res => {
//       if (isNewApp.value === 'tianjian') return ajump.toSDK();
//       setTimeout(ajump.toHome, 0);
//     })
//     .catch(err => {
//       isLoading.value = false;
//       ElMessage.error({
//         message: err.response.data,
//         type: 'error'
//       });
//     });
// }
</script>

<template>
  <main class="w-full h-full overflow-hidden relative">
    <div class="w-full h-full bg-[#a0d3f6] backdrop-blur-[.3px] min-h-[850px]"></div>
    <div class="w-full h-full flex absolute top-0 left-0">
      <div
        class="box-border p-8 w-[30%] h-1/2 bg-[#f5f6fa] rounded-3xl absolute top-40 left-1/2 -translate-x-1/2 shadow"
        @keydown.enter=""
      >
        <!-- 滑轮形式切换登录 -->

        <el-tabs class="w-full" v-model="isNewApp">
          <el-tab-pane label="验证码登录" name="authCode">
            <el-form class="my-5">
              <el-form-item>
                <el-input placeholder="手机号" v-model="username" size="small"> </el-input>
              </el-form-item>
              <el-input v-model="username" placeholder="手机验证码">
                <!-- <template #prepend></template> -->
                <template #append><button @click="sentAuthCode">发送验证码</button></template>
              </el-input>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="查询记录" name="password">
            <el-form class="w-full">
              <el-form-item>
                <el-input placeholder="手机号" v-model="username" size="small"> </el-input>
              </el-form-item>
              <el-form-item>
                <el-input show-password placeholder="唯一秘钥" v-model="password" size="small"> </el-input>
              </el-form-item>
            </el-form>
            <div>输入需查询信息的手机号，以及对应保存时生成的唯一秘钥</div>
          </el-tab-pane>
        </el-tabs>
        <el-button type="primary" size="large" class="w-full mt-5" @click="">{{ '登录' }}</el-button>
      </div>
    </div>
  </main>

  <!-- 
  <div class="font-conmon w-[34%] h-full">
    <div class="absolute text-white flex items-center space-x-3 left-[3%] top-[3%]">
      <img :src="logo" alt="加载失败" class="w-[30px] h-[30px] select-none" />
      <div class="flex flex-col">
        <div class="text-sm h-[24px] leading-[24px]">天明分析</div>
        <div class="text-xs">TianMing Analysis</div>
      </div>
    </div>
    <div class="absolute text-white text-xs opacity-80 left-[45%] bottom-[2%] transform scale-[0.75]">
      <span>© Copyright AppInsight 2019-2021</span>
      <div class="mt-1">
        <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备19158621号-3</a>
      </div>
    </div>
  </div> -->
</template>

<style scoped lang="postcss">
/* .font-conmon {
  font-family:
    PingFangSC-Regular,
    STHeiti,
    Microsoft YaHei,
    微软雅黑,
    serif;
  color: #fafbfc;
} */

:deep(.el-input .el-input__inner) {
  @apply h-[46px];
}
:deep(.el-form-item__content .el-button) {
  @apply h-[46px]  font-bold text-lg leading-4;
}
</style>
