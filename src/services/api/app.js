import { http } from '@/services/domain/http.js';
import { vars } from '@/services/data/vars';
import { appList, currentApp, topApp } from '@/services/data/app.js';
import { ElMessage } from 'element-plus';

const apiApp = {
  /**
   * 进入首页或应用详情页后，获取应用列表，并保存应用列表
   * @returns
   */
  getAppList() {
    let rest = '/app';
    let config = {
      headers: {
        userName: localStorage.getItem(vars.flag_user)
      }
    };
    let request = http.get(rest, config);

    request.then(
      res => {
        if (res.data.code === 200) {
          let { appLists, appTop } = res.data.data;
          appLists.forEach(item => {
            item.platformIcon = item.platform === 3 ? 'fab fa-html5' : 'fas fa-mobile';
            item.reportDate =
              item.reportDate === '' ? '-' : new Date(item.reportDate).toLocaleDateString();
            item.time = new Date(item.time).toLocaleDateString();
            let isTop = appTop.findIndex(topAPPToken => {
              return topAPPToken === item.token;
            });
            item.order = isTop !== -1 ? isTop : appTop.length;
            item.isTop = isTop !== -1 ? true : false;
          });
          appList.value = Object.freeze(appLists);
          topApp.value = appTop;
        }
      },
      error => {
        appList.value = [];
      }
    );
    return request;
  },
  creatApp(creatAppPost) {
    return http.post('/app', creatAppPost);
  },
  updateApp({ token, appName, description }) {
    let rest = `/app?token=${token}&description=${description}`;
    if (appName) {
      rest += `&appName=${appName}`;
    }
    rest = encodeURI(rest);

    console.log(rest);
    return http.put(rest);
  },
  removeApp() {
    const token = currentApp.value.token;
    const rest = '/app?token=' + token;
    return http
      .delete(rest)
      .then(res => {
        ElMessage.success('保存成功');
        return res.data.data;
      })
      .catch(err => {
        console.log(err);
        ElMessage.error('保存失败');
      });
  },
  /**
   * 置顶app应用
   * @returns
   */
  appTop(appTopBody) {
    return http.post('/app/appTop', appTopBody, {
      headers: {
        userName: localStorage.getItem(vars.flag_user)
      }
    });
  },
  getAppConfig() {
    const token = currentApp.value.token;
    const rest = '/config?token=' + token;

    return http.get(rest);
  },
  setAppConfig(configData) {
    const token = currentApp.value.token;
    const rest = '/config?token=' + token;

    return http.post(rest, configData);
  },
  getSetting(type) {
    const token = currentApp.value.token;
    const rest = '/setting';
    const params = { token, type };

    return http
      .get(rest, { params })
      .then(res => {
        if (res.data?.code === 200) {
          return res.data.data;
        }
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log('Error', err.message);
        }
        console.log(err.config);
        ElMessage.error('获取失败');
        return [];
      });
  },
  setSetting(data) {
    const token = currentApp.value.token;
    const rest = '/setting';
    const params = { token };

    return http[data.id ? 'put' : 'post'](rest, data, { params })
      .then(res => {
        if (res.data.code === 200) {
          ElMessage.success('保存成功');
        }
      })
      .catch(err => {
        if (err.response?.status === 406) {
        } else if (err.response?.status === 403) {
          ElMessage.warning('您没有该操作的权限');
        } else {
          ElMessage.error('保存失败');
        }
      });
  },
  removeSetting(id, type) {
    const token = currentApp.value.token;
    const rest = '/setting';
    const params = { token, id, type };

    return http
      .delete(rest, { params })
      .then(res => {
        if (res.data.code === 200) {
          ElMessage.success('删除成功');
        }
      })
      .catch(err => {
        if (err.response?.status === 403) {
          ElMessage.warning('您没有该操作的权限');
        } else {
          ElMessage.error('删除失败');
        }
      });
  },
  receiveSwitchSetting(id, receiveSwitch, type) {
    const token = currentApp.value.token;
    const rest = '/setting/switch';
    const params = { token, id, switch: receiveSwitch, type };

    return http.put(rest, null, { params });
  },

  async getVirtualEvent() {
    const token = currentApp.value.token;
    const rest = `/virtualEvent/byToken?token=${token}`;

    try {
      const res = await http.get(rest);
      if (res.data?.code === 200) {
        return res.data.data;
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  async setVirtualEvent(data, id) {
    const token = currentApp.value.token;
    let rest = `/virtualEvent?token=${token}`;

    try {
      let res;
      if (id) {
        rest += `&id=${id}`;
        res = await http.put(rest, data);
      } else {
        res = await http.post(rest, data);
      }
      if (res.data?.code === 200) {
        ElMessage.success('保存成功');
        return res.data.data;
      }
    } catch (err) {
      console.log(err);
      ElMessage.error('保存失败');
    }
  },
  async removeVirtualEvent(id) {
    const rest = `/virtualEvent?id=${id}`;

    try {
      const res = await http.delete(rest);
      if (res.data?.code === 200) {
        ElMessage.success('删除成功');
        return res.data.data;
      }
    } catch (err) {
      console.log(err);
      ElMessage.error('删除失败');
    }
  }
};
export { apiApp };
