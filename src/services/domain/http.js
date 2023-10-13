import { vars } from '@/services/data/vars';
import { ajump } from '@/services/domain/jump.js';
import axios from 'axios';

const http = axios.create({
  baseURL: window._pwb_dict.base_url
  // timeout: 12_000
});

http.interceptors.request.use(
  config => {
    let apt = localStorage.getItem(vars.flag_apt);
    let userName = localStorage.getItem(vars.flag_user);
    if (apt) {
      config.headers.apt = apt;
    }
    if (userName) {
      config.headers.userName = userName;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  res => {
    return Promise.resolve(res);
  },
  err => {
    const { response, message } = err;
    if (response == null) {
      ahttp.handleNetworkError(message);
      return Promise.reject(err);
    }
    let { status } = response;
    if (+status === 401) {
      ahttp.handleUnauthorized();
    }
    return Promise.reject(err);
  }
);

let ahttp = {
  /**
   * 网络错误时，打印错误信息
   * @param {string} msg
   */
  handleNetworkError(msg) {
    console.error(msg);
  },
  /**
   * 登录失效后，跳转到登录页
   */
  handleUnauthorized() {
    ajump.toLogin();
  }
};

function handleAxiosRes(res) {
  let isError = false;
  let error = null;
  let isSuccess = false;
  let data = null;
  let remoteMessage = '';

  if (res instanceof Error) {
    const { status, statusText, data: respData } = res.response || res.request || {};
    isError = true;
    error = [status, statusText].join(' ');
    isSuccess = false;
    data = null;
    remoteMessage = respData?.data?.message || respData?.message || '';
  } else if (res == null) {
    isError = true;
    error = '请检查网络';
    isSuccess = false;
    data = null;
  } else {
    isError = false;
    error = null;
    isSuccess = true;
    data = res.data.data || res.data;
    remoteMessage = res.data.data?.message || res.data?.message || '';
  }

  if (res?.data?.status !== 200) isSuccess = false;
  return { isError, error, isSuccess, data, res, remoteMessage };
}

function downloadFile(fileName, { method = 'get', url, params, data, responseType = 'blob' }) {
  http({ method, url, params, data, responseType }).then(res => {
    const blob = new Blob([res.data]);
    const elink = document.createElement('a');

    // @ts-ignore
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      // 兼容IE
      // @ts-ignore
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      // 非IE
      elink.download = fileName;
    }

    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  });
}

window.http = http;

export { http, handleAxiosRes, downloadFile };
