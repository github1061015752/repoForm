const base = window._pwb_dict.origin;

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
  toMenu(hashVal = 'criRecord') {
    const url = base + `/#/${hashVal}`;
    ajump.go(url);
  },
  /**
   * 点击帮助文档后，跳转到帮助文档页
   */
  toQueue() {
    const url = base + '/#/queue';
    window.open(url, '_blank');
  },

  toSDK() {
    ajump.go(base + '/sdk/#/sdkList');
  }
};

export { ajump };
