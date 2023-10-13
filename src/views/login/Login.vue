<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FormInstance } from 'element-plus';
import md5 from 'blueimp-md5';

import {
  tabVal,
  authCodeForm,
  queryRecordForm,
  rules,
  sentAuthCode,
  countdownDurationInSeconds,
  isRetryState,
  isAllowAgreement,
  login
} from './login';

const formRef = ref<FormInstance>();
const formRef2 = ref<FormInstance>();

const lastFormRef = computed(() => (tabVal.value === 'authCode' ? formRef.value : formRef2.value));

//7-pay.cn/submit.php?name=iphone%20xs%20Max%20%E4%B8%80%E5%8F%B0&money=0.03&out_trade_no=201911914837526544601&notify_url=http://www.aaa.com/notify_url.php&pid=20230913114527&param=%E9%87%91%E8%89%B2%20256G&return_url=http://www.baidu.com&sign=9b5c852b40285f0b6391c1590ac14de6&sign_type=MD5&type=alipay

// https://7-pay.cn/submit.php?name=iphone%20xs%20Max%20%E4%B8%80%E5%8F%B0&money=0.03&out_trade_no=201911914837526544601&notify_url=http://www.aaa.com/notify_url.php&pid=20230913114527&param=%E9%87%91%E8%89%B2%20256G&return_url=http://www.baidu.com&sign=a1ab2197ec477da469c987a864fc0033&sign_type=MD5&type=alipay

// function getSign(data, hashkey) {
//   // 对数据对象的键按字母顺序进行排序
//   const sortedKeys = Object.keys(data).sort();

//   // 创建一个新的数组以存储有效数据
//   const pre = [];

//   // 遍历数据对象，过滤掉特殊键和空值
//   sortedKeys.forEach(key => {
//     const value = data[key];
//     if (key !== 'sign' && key !== 'sign_type' && value !== null && value !== '') {
//       pre.push(`${key}=${value}`);
//     }
//   });

//   // 将过滤后的数据以 '&' 分隔并连接成字符串
//   const arg = pre.join('&');
// debugger;
//   // 计算签名并返回
//   return md5(arg + hashkey).toLowerCase(); // 假设有一个 md5 函数来计算 MD5 散列值
// }

// https://7-pay.cn/submit.php?name=iphone xs Max 一台&money=0.03&out_trade_no=201911914837526544601&notify_url=http://www.aaa.com/notify_url.php&pid=201901151314084206659771&param=金色 256G&return_url=http://www.baidu.com&sign=28f9583617d9caf66834292b6ab1cc89&sign_type=MD5&type=alipay

//https://7-pay.cn/submit.php?name=iphone&money=0.03&out_trade_no=201911914837526544601&notify_url=http://www.aaa.com/notify_url.php&pid=20230913114527&param=1111&return_url=http://www.baidu.com&sign=a1ab2197ec477da469c987a864fc0033&sign_type=MD5&type=wxpay
// 示例用法：

//https://7-pay.cn/submit.php?name=iphone&money=0.03&out_trade_no=201911914837526544601&notify_url=http://www.aaa.com/notify_url.php&pid=20230913114527&param=1111&return_url=http://www.baidu.com&sign=//https://7-pay.cn/submit.php?name=iphone&money=0.03&out_trade_no=201911914837526544601&notify_url=http://www.aaa.com/notify_url.php&pid=20230913114527&param=1111&return_url=http://www.baidu.com&sign=96fc2c08cb404b03f922b8834d26128b&sign_type=MD5&type=wxpay

// const datas = {
//   type: 'wxpay',
//   name: 'iphone',
//   money: '0.03',
//   out_trade_no: '201911914837526544601',
//   notify_url: 'http://www.aaa.com/notify_url.php',
//   pid: '20230913114527',
//   param: '1111',
//   return_url: 'http://www.baidu.com'
// };

// const hashkey = 'uuN5ADY9KGjEjHihzbrQt8cl0ZyThE0s';
// const signature = getSign(datas, hashkey);
// console.log(signature);

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
  <main class="login w-full h-full overflow-hidden relative">
    <img src="\image\background.webp" class="w-full h-full backdrop-blur-[.3px]" />
    <div class="w-full h-full flex absolute top-0 left-0">
      <div class="absolute top-16 text-4xl font-bold text-white left-1/2 -translate-x-1/2 drop-shadow-xl whitespace-nowrap">
        个人信息密码箱
      </div>
      <div
        class="box-border p-8 w-5/6 sm:w-[30%] min-w-fit sm:min-w-[500px] h-1/2 bg-[#f5f6fa] rounded-3xl absolute top-48 left-1/2 -translate-x-1/2 shadow"
        @keydown.enter=""
      >
        <!-- 滑轮形式切换登录 -->
        <section class="h-[95%] sm:h-[90%] flex flex-col">
          <el-tabs class="w-full flex-grow" v-model="tabVal">
            <el-tab-pane label="验证码登录" name="authCode">
              <el-form ref="formRef" class="mt-5" :model="authCodeForm" :rules="rules">
                <el-form-item prop="phoneNum">
                  <el-input placeholder="手机号" v-model="authCodeForm.phoneNum" size="small" maxlength="11"> </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="authCodeForm.authCode" placeholder="手机验证码" class="auth-radius" maxlength="6">
                    <template #append>
                      <div @click.stop="sentAuthCode(formRef)" :class="[isRetryState ? 'cursor-default' : 'cursor-pointer']">
                        {{ isRetryState ? `重发(${countdownDurationInSeconds}秒)` : '发送验证码' }}
                      </div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="查询记录" name="password">
              <el-form ref="formRef2" class="mt-5 space-y-1" :model="queryRecordForm" :rules="rules">
                <el-form-item prop="name">
                  <el-input placeholder="姓名" v-model="queryRecordForm.name" size="small" maxlength="15"> </el-input>
                </el-form-item>
                <el-form-item prop="serialNum">
                  <el-input
                    show-password
                    placeholder="唯一秘钥  ( 保存时生成的一串字母 )"
                    v-model="queryRecordForm.serialNum"
                    size="small"
                    required
                  >
                  </el-input>
                </el-form-item>
              </el-form>
              <div class="text-gray-400 space-y-1 my-3 text-xs sm:text-sm">
                <div class="flex items-center">
                  <StIcon icon="warn" type="warning" :round="0" :pointer="false" />请务必输入查询人准确的姓名。
                </div>
                <div class="flex items-center">
                  <StIcon icon="warn" type="warning" :round="0" :pointer="false" />本方式登录只能查看信息,不能进行编辑!
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <section class="space-y-7">
            <div class="text-xs">
              <el-checkbox v-model="isAllowAgreement" class="h-[14px] box-border align-top" />
              您已阅读并同意
              <a href="javascript:void(0);" class="text-[#0094ff] no-underline" @click="() => false">《用户协议》</a>
              ，点击勾选即代表您同意上述法律文书的相关条款并签署上述法律文书。
            </div>
            <el-button type="primary" size="large" class="w-full" @click="login(lastFormRef)">{{ '登录' }}</el-button>
          </section>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped lang="postcss">
:deep(.el-tabs .el-tabs__nav-scroll .el-tabs__nav) {
  @apply w-full justify-around;
}
:deep(.el-tabs .el-tabs__header.is-top) {
  @apply mb-1 sm:mb-3;
}
:deep(.el-tabs .el-tabs__nav .el-tabs__item) {
  @apply font-[#262626]  text-lg sm:text-xl font-semibold;
}
:deep(.el-tabs .el-tabs__header .el-tabs__nav-wrap::after) {
  @apply hidden;
}
:deep(.el-tabs .el-tabs__content) {
  @apply flex-grow;
}

:deep(.el-input .el-input__wrapper) {
  @apply rounded-xl;
}
:deep(.auth-radius.el-input div.el-input__wrapper) {
  @apply rounded-l-xl rounded-r-none;
}
:deep(.auth-radius.el-input .el-input-group__append) {
  @apply rounded-r-xl;
}

:deep(.el-input .el-input__wrapper .el-input__inner) {
  @apply h-10;
}

:deep(.el-input .el-input__wrapper .el-input__inner::placeholder) {
  @apply pl-1 font-semibold text-sm;
}

:deep(.el-form-item__content .el-button) {
  @apply h-11  font-bold text-lg leading-4;
}
</style>
