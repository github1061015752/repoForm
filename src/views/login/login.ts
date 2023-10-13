import type { FormInstance } from 'element-plus';
import { computed, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

import { sj } from '@/services/domain/util';
import { ajump } from '@/services/domain/jump';
import { handleAxiosRes } from '@/services/domain/http';
import { loginApi, selectFormByPhone, sentAuthCodeApi } from '@/services/api/businessApi';

const tabVal = ref('authCode' as 'password' | 'authCode');

const authCodeForm = reactive({
  phoneNum: '',
  authCode: '',
  remoteAuthCode: ''
});

const queryRecordForm = reactive({
  name: '',
  serialNum: '' //序列码
});

const rules = reactive({
  phoneNum: {
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error('请输入手机号码！'));
      }
      if (/^1[3456789]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的手机号码'));
      }
    },
    trigger: 'blur'
  },
  authCode: { required: true, message: '验证码不能为空!', trigger: 'blur' },
  name: {
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error('请输入姓名！'));
      }
      if (/^[\u4e00-\u9fff]{1,15}$/.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的姓名'));
      }
    },
    trigger: 'blur'
  },
  serialNum: { required: true, message: '请输入唯一秘钥!', trigger: ['blur', 'change'] }
});

let countdownInterval: NodeJS.Timeout;
let lastSentTime = 0;
const countdownDurationInSeconds = ref(60);
const isRetryState = computed(() => countdownDurationInSeconds.value < 60);

const isAllowAgreement = ref(false);

export { tabVal, rules, authCodeForm, queryRecordForm, countdownDurationInSeconds, isRetryState, isAllowAgreement };

/**
 * 发送验证码
 * 1, 控制每分钟只可以发送一条验证码
 * 2, 校验手机号是否正确,只有在正确的手机号格式下才发送验证码
 */
export function sentAuthCode(formRef: FormInstance | undefined) {
  if (!formRef) return;
  formRef.validate(valid => {
    if (valid) {
      const currentTime = Date.now();
      const oneMinuteInMillis = 60 * 1000;
      if (currentTime - lastSentTime >= oneMinuteInMillis) {
        // 这里添加发送验证码的逻辑，例如向用户发送验证码短信

        sentAuthCodeApi(authCodeForm.phoneNum).then(data => (authCodeForm.remoteAuthCode = data));

        // 更新上次发送验证码的时间戳
        lastSentTime = currentTime;

        /**
         * 此处是倒计时函数
         * @param durationInSeconds 倒计时多少秒
         */
        function startCountdown(durationInSeconds: number) {
          let remainingSeconds = durationInSeconds;

          // 清除之前的倒计时（如果有）
          clearInterval(countdownInterval);

          // 更新倒计时显示并处理倒计时结束的情况
          countdownInterval = setInterval(function () {
            remainingSeconds--;

            if (remainingSeconds >= 0) {
              //将剩余时间通知给外部ref剩余时间变量
              countdownDurationInSeconds.value = remainingSeconds;
            } else {
              clearInterval(countdownInterval);
              countdownDurationInSeconds.value = 60;
            }
          }, 1000);
        }

        // 开始倒计时
        startCountdown(--countdownDurationInSeconds.value);
      } else {
        ElMessage({
          message: `请等待${countdownDurationInSeconds.value}秒后再尝试发送验证码`,
          grouping: true,
          type: 'warning'
        });
      }
    } else {
      ElMessage({
        message: `请按要求输入手机号！`,
        grouping: true,
        type: 'warning'
      });

      return false;
    }
  });
}

/**
 * 登录
 * 1, 判断表单验证是否通过
 * 2, 发送登录请求
 *    1)如果是验证码方式登录,如果未注册就自动注册, 如果已经登录过就请求以前保存的数据;
 *    2)如果是查询记录方式登录, 只需要验证姓名和唯一秘钥是否存在并且一致。
 */
export const login = sj.debounce((formRef: FormInstance | undefined) => {
  if (!formRef) return;

  formRef.validate(async valid => {
    //验证码是否非空
    const isNull = !(authCodeForm.authCode != null && authCodeForm.authCode !== '');
    if (isNull)
      return ElMessage({
        message: `验证码不能为空`,
        grouping: true,
        type: 'warning'
      });
    //验证码是否与客户手机收到的验证码一致
    const isCorrect = authCodeForm.authCode == authCodeForm.remoteAuthCode;
    if (!isCorrect)
      return ElMessage({
        message: `验证码错误,请重新输入`,
        grouping: true,
        type: 'warning'
      });

    if (valid) {
      const { isError, res } = await loginApi(authCodeForm.phoneNum).then(handleAxiosRes, handleAxiosRes);
      console.log(res);
      if (isError) {
        ElMessage.warning(`${res?.data?.msg}`);
        return null;
      } else {
        sessionStorage.setItem('phone', authCodeForm.phoneNum);
        ajump.toMenu('criRecord');
      }
    } else
      ElMessage({
        message: `请按要求输入正确的信息！`,
        grouping: true,
        type: 'warning'
      });
  });
}, 300);
