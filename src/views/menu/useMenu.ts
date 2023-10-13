import { ajump } from '@/services/domain/jump.js';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import { computed, reactive } from 'vue';

export type NotifyItem = {
  type: string;
  time: string;
  read: boolean;
  title: string;
  content?: string;
};

export type MenuState = {
  notifyVisible: boolean;
  iconValue: { [key: string]: number | boolean };
  notifyList: NotifyItem[];
};

export type MenuItem = {
  title: string;
  id: string;
  enabled: boolean;
  url: string;
  _blank?: Boolean;
  subs?: MenuSubItem[];
};

export type MenuSubItem = {
  title: string;
  id: string;
  url: string;
  icon: string;
  _blank?: Boolean;
};

export const useMenu = (route: RouteLocationNormalizedLoaded) => {
  const util = {
    handleClick: (type: string) => {
      if (type === 'notify') {
        state.notifyVisible = true;
      }
      if (type === 'task') {
        ajump.toQueue();
      }

      if (type === 'user') {
        // ajump.toPersonalCenter();
      }
      if (type === 'logout') {
        // apiAccount.logout();
        sessionStorage.clear();
        ajump.toLogin();
      }
    }
  };

  const state: MenuState = reactive({
    notifyVisible: false,
    queueVisible: false,
    iconValue: {
      notify: false,
      task: false,
      help: false
    },
    notifyList: new Array(100).fill(0).map((_, index) => ({
      type: 'board',
      time: new Date().toJSON(),
      read: false,
      title: `guoo 已删除 他人分享给你的看板「模拟通知${index}」`,
      content: Math.random() > 0.5 ? `你可在「看板-共享给我」中查看` : ''
    }))
  });

  return {
    state,
    util
  };
};
