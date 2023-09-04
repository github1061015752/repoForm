import { currentApp, dynamicMenuList } from '@/services/data/app.js';

const base = window._sjt_dict.origin;

const ajump = {
  /**
   * 跳转到某个 url
   * @param {string} url 完整 url
   */
  go(url) {
    window.location = url;
  },
  /**
   * 退出账号或登录失效后，跳转到登陆页
   */
  toLogin() {
    const url = base + '/#/login';
    ajump.go(url);
  },
  /**
   * 登录成功后，跳转到应用列表页
   */
  toHome() {
    const url = base + '/#/';
    ajump.go(url);
  },
  /**
   * 点击帮助文档后，跳转到帮助文档页
   */
  toDoc() {
    return '';
    const url = base + '/static/doc/index.html';
    ajump.go(url);
  },
  /**
   * 点击帮助文档后，跳转到帮助文档页
   */
  toQueue() {
    const url = base + '/#/queue';
    window.open(url, '_blank');
  },
  /**
   * 切换应用后，跳转到该应用的详情页面，并保存当前应用信息
   * @param {Object} app 接口返回的应用
   */
  toApp(app) {
    const endList = location.href
      .split('#')[1]
      .split('/')
      .filter(item => item)
      .slice(1);

    const endPath = endList.join('/') + (endList.length ? '' : 'overview/data-board');

    let path = `/${app.token}/${endPath}`;

    currentApp.value = app;
    const newMenuList = dynamicMenuList(app.token);
    const defaultPath = newMenuList.find(element => element.enabled === true);
    path = `/${app.token}${defaultPath.url + defaultPath.subs[0].url}`;
    switch (app.platform) {
      case 3:
        ajump.go(base + '/web/#' + path);
        break;
      default:
        ajump.go(base + '/app/#' + path);
        break;
    }
  },
  toSDK() {
    ajump.go(base + '/sdk/#/sdkList');
  }
};

export { ajump };
