<script  lang="ts" setup>
import { AxiosResponse } from 'axios';
import { getCurrentInstance, ComponentInternalInstance } from 'vue';
import { UploadFile, UploadFiles, UploadRawFile, ElMessage } from 'element-plus';
import md5 from 'blueimp-md5';
import { downloadFile } from '@/services/domain/http';

// 组件用法 字段含义参考 https://element-plus.gitee.io/zh-CN/component/upload.html
interface Props {
  url?: string;
  name?: string; //上传的文件字段名
  drag?: boolean;
  tip?: string;
  limit?: number;
  accept?: string; //值参考 https://www.w3cschool.cn/htmltags/att-input-accept.html
  headers?: any;
  disabled?: boolean;
  customClass?: string;
  tipContent?: string;
  showFileList?: boolean;
  borderHeight?: string;

  beforeUpload?: (rawFile: UploadRawFile) => boolean;
  onSuccess?: (resp: AxiosResponse, file?: UploadFile, files?: UploadFiles) => void;
  onError?: (error: Error, file: UploadFile, files: UploadFiles) => void;

  downloadParam?: {
    showName: string; // 展示的文字 默认下载模板
    fileName: string; // 下载模板的文件名
    method: string;
    params: { [key: string]: any };
    data: { [key: string]: any };
  };

  // method: string;
  // onPreview: (file: UploadFile) => void;
  // onRemove: (file: UploadFile, files?: UploadFiles) => void;
}
const props = withDefaults(defineProps<Props>(), {
  drag: false,
  limit: 1,
  disabled: false,

  showFileList: false
});

const { slots } = getCurrentInstance() as ComponentInternalInstance;

// /** 下载模板  下载功能参考http定义的downloadFile */
// function downloadTemp(url_callback: string | Function | undefined) {
//   if (!url_callback)
//     return ElMessage({
//       type: 'error',
//       message: '缺失下载的url 或 下载回调函数',
//       grouping: true
//     });

//   if (typeof url_callback === 'string') {
//     //@ts-ignore
//     const { fileName = '模板' } = props.downloadParam;
//     //@ts-ignore
//     return downloadFile(fileName, { url: url_callback });
//   }

//   if (typeof url_callback === 'function') {
//     //@ts-ignore
//     // const { fileName = '模板', method, params, data } = props.downloadParam;
//     // return downloadFile(fileName, { url: url_callback, method, params, data });
//     url_callback();
//   }
// }

















// let formData = new FormData();

//  formData.append('user', userObj)


//  https://7-pay.cn/api.php?act=order&pid={商户ID}&key={商户密钥}&out_trade_no={商户订单号}




// fetch('/ https://7-pay.cn/api.php?act=order&pid=20230913114527&key=uuN5ADY9KGjEjHihzbrQt8cl0ZyThE0s&out_trade_no={f3ifr8uSe7GN9ieVwynF}', {
//   method: 'get'
// })










// https://account.court.gov.cn/api/login



// const data11 = {username: "18774979469",
// password: "lGcQYDi0w%2BjtOjIz6dTcknj9eYxtFYy1hinHVY%2FV%2By4DcTn%2BpAQUsJWoxwJSUtLnX2Ig610ng5zXsy0k28HuQkrN5RNUlrdOhIlWyQezwaV5rc0EWpS8tk%2B9ZRECYvksDwVGgHmnuE8bUJpYIKmbtOzSdcNibwzVR40dwLOD9l4edmD1tqjgvFpYUbHCzzYaTaANbhazJjeFYx9EsWIOpX24BleMR0TXWsaS3evfWNTvpF5e4oycG1cxKN1LJq98JyzlR2bkn%2Fkfs%2BDaajbPJBNOLgeAtUWBQKO%2BxPJXwoIdl6YHh5nqXwK47lTmSkHkGAqF611NdaDAMpxIiRWbxw%3D%3D",
// appDomain:" wenshu.court.gov.cn"}


// fetch('https://account.court.gov.cn/api/login', {
//   method: 'post',
//   data:JSON.stringify(data11),
  
// })



//lGcQYDi0w%2BjtOjIz6dTcknj9eYxtFYy1hinHVY%2FV%2By4DcTn%2BpAQUsJWoxwJSUtLnX2Ig610ng5zXsy0k28HuQkrN5RNUlrdOhIlWyQezwaV5rc0EWpS8tk%2B9ZRECYvksDwVGgHmnuE8bUJpYIKmbtOzSdcNibwzVR40dwLOD9l4edmD1tqjgvFpYUbHCzzYaTaANbhazJjeFYx9EsWIOpX24BleMR0TXWsaS3evfWNTvpF5e4oycG1cxKN1LJq98JyzlR2bkn%2Fkfs%2BDaajbPJBNOLgeAtUWBQKO%2BxPJXwoIdl6YHh5nqXwK47lTmSkHkGAqF611NdaDAMpxIiRWbxw%3D%3D
</script>

<template>
  <el-upload
    ref="upload"
    :class="` ${customClass || ''}`"
    :auto-upload="false"
    action="#"
    v-bind="{
      drag,
      limit,
      accept,
      headers,
      disabled,
      showFileList,

      beforeUpload,

      onSuccess,
      onError
    }"
  >
    <div class="w-40 h-24 relative">
      <slot></slot>
      <svg
        class="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"
        ></path>
      </svg>
      <span class="absolute left-1/2 bottom-1.5 -translate-x-1/2 text-xs scale-90 font-bold whitespace-nowrap">
        {{ tip }}
      </span>
    </div>
  </el-upload>
</template>

<style lang="postcss" scoped>
.dragger-height {
  @apply w-fit;
}
</style>
