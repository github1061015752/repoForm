import { sj } from './util';

const aevent = {
  data: {
    // 全局事件
    events: {},
    // 点击外部时，需要隐藏的元素及其隐藏方法
    // 例如：点击下拉列表外部时，隐藏下拉列表
    /**
     * @type Map<Node, Function> 组件内根节点，隐藏的方法
     */
    hiddenNodes: new Map()
  },
  /**
   * 启动「点击元素外部时，隐藏元素内部元素」的功能，例如隐藏下拉框
   */
  enableGlobalHide() {
    const { hiddenNodes } = this.data;
    const hideNode = e => {
      const { target } = e;
      for (const [node, fn] of hiddenNodes.entries()) {
        const isContained = node.contains(target);
        if (!isContained) {
          fn();
        }
      }
    };
    document.addEventListener('click', hideNode);
  },
  /**
   * 添加需要在点击外部时隐藏的元素
   * @param {Node} node
   * @param {Function} fn 隐藏元素的方法，或其他回调方法
   */
  addHiddenNode(node, fn) {
    const { hiddenNodes } = this.data;
    hiddenNodes.set(node, fn);
  },
  /**
   * 移除需要在点击外部时隐藏的元素
   * @param {Node} node
   */
  removeHiddenNode(node) {
    const { hiddenNodes } = this.data;
    hiddenNodes.delete(node);
  },
  /**
   * 订阅事件，添加一个回调函数，返回取消订阅的方法（通常用于回调函数是传入时定义的匿名函数，不想把该函数保存起来的情况）
   * @param {string} event 事件名
   * @param {Function} callback 订阅事件的回调方法
   */
  on(event, callback) {
    const callbacks = this.data.events[event] || [];
    callbacks.push(callback);
    this.data.events[event] = callbacks;
    return () => aevent.remove(event, callback);
  },
  /**
   * 触发订阅某事件的所有回调函数，传参执行
   * @param {string} event
   * @param  {...any} args
   */
  emit(event, ...args) {
    const callbacks = aevent.data.events[event];
    const canEmit = callbacks instanceof Array && callbacks.length > 0;
    if (!canEmit) {
      return;
    }
    for (let callback of callbacks) {
      callback(...args);
    }
  },
  /**
   * 移除已订阅某个事件的回调函数
   * @param {string} event
   * @param {Function} callback
   * @returns
   */
  remove(event, callback) {
    const callbacks = this.data.events[event];
    const canRemove = callbacks instanceof Array && callbacks.length > 0;
    if (!canRemove) {
      return;
    }
    const newCallbacks = callbacks.filter(fn => fn !== callback);
    this.data.events[event] = newCallbacks;
  },
  /**
   * 移除某个事件的所有回调函数
   * @param {string} event
   * @returns
   */
  clear(event) {
    const callbacks = this.data.events[event];
    const canRemove = callbacks instanceof Array && callbacks.length > 0;
    if (!canRemove) {
      return;
    }
    this.data.events[event] = [];
  },
  /**
   * vue 实例化之前，添加全局事件监听器，统一管理全局事件
   */
  listenGlobalEvent() {
    // const docEvents = ['mousemove', 'keyup'];
    // const winEvents = ['resize'];
    // for (let type of docEvents) {
    //   const handler = this.createEventHandler(type, true);
    //   document.addEventListener(type, handler);
    // }
    // for (let type of winEvents) {
    //   const handler = this.createEventHandler(type);
    //   window.addEventListener(type, handler);
    // }
  },
  /**
   * 添加全局事件监听器前，创建全局事件处理程序
   * @param {string} event
   * @param {boolean} useThrottle 是否使用节流
   * @returns
   */
  createEventHandler(event, useThrottle = false) {
    if (!useThrottle) {
      return function (...args) {
        aevent.emit(event, ...args);
      };
    }

    return sj.throttle({
      then(...args) {
        aevent.emit(event, ...args);
      },
      delay: 500,
      handleStart: true
    });
  }
};

export { aevent };
