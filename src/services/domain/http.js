import { vars } from '@/services/data/vars';
import { ajump } from '@/services/domain/jump.js';
import axios from 'axios';

const http = axios.create({
  baseURL: window._sjt_dict.base_url
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

  if (res instanceof Error) {
    const { status, statusText } = res.response;
    isError = true;
    error = [status, statusText].join(' ');
    isSuccess = false;
    data = null;
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
  }

  return { isError, error, isSuccess, data };
}

window.http = http;

export { http, handleAxiosRes };
