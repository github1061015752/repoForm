import { ElMessage } from 'element-plus';

const sj = {
  log(...args: any[]) {
    args.forEach(arg => console.log(arg));
  },
  /**
   * 判断数据为 null 或 undefined
   */
  isNil(value: unknown) {
    return value == null;
  },
  /**
   * 判断数据是否为数组类型
   */
  isArray(value: unknown) {
    return Array.isArray(value);
  },
  /**
   * 判断数据是否为数值类型
   */
  isNumber(value: unknown) {
    return typeof value === 'number';
  },
  /**
   * 判断数据是否为字符串类型
   */
  isString(value: unknown) {
    return typeof value === 'string';
  },
  /**
   * 判断数据是否为非空字符串
   */
  isNotEmptyString(value: unknown) {
    return typeof value === 'string' && value !== '';
  },
  /**
   * 判断数据是否为布尔类型
   */
  isBoolean(value: unknown) {
    return typeof value === 'boolean';
  },
  /**
   * 获取字符串总宽度，英文宽度为 1，中文宽度为 2
   */
  getStringWidth(value: string) {
    let width = value.length;
    Array.from(value).forEach(char => {
      const isDoubleChar = char.charCodeAt(0) >= 255;
      if (isDoubleChar) {
        width++;
      }
    });
    return width;
  },
  /**
   * 创建请求 url 时，创建一个请求参数，返回格式为 ?key=value 或 &key=value
   */
  createQuery(key: string, value: string, isFirst = false) {
    const excludeValues = [null, undefined, ''];
    const canCreate = excludeValues.every(v => {
      return key !== v && value !== v;
    });

    if (!canCreate) {
      return '';
    }

    let query = `${key}=${value}`;
    query = isFirst ? `?${query}` : `&${query}`;
    return query;
  },
  /**
   * 添加事件监听时，对事件处理程序进行节流和防抖处理，开始执行->中间节流->结束回调
   * @param {Object} option
   * @param {Function} option.then 节流或防抖需要执行的方法
   * @param {number} option.delay
   * @param {boolean} [option.handleStart]
   */
  throttle(option: { then: () => void; delay: number; handleStart?: boolean }) {
    const { delay } = option;
    let isStart = true;
    let last = 0;
    let timer = -1;

    return function (...args: any[]) {
      const now = Date.now();

      const shouldHandleStart = option.handleStart && isStart;
      if (shouldHandleStart) {
        // @ts-ignore
        option.then.apply(this, args);
        isStart = false;
        last = now;
        return;
      }

      const shouldHandleMiddle = now - last >= delay;
      if (shouldHandleMiddle) {
        // @ts-ignore
        option.then.apply(this, args);
        last = now;
      }

      clearTimeout(timer);
      timer = window.setTimeout(() => {
        isStart = true;
        last = Date.now();
        // @ts-ignore
        option.then.apply(this, args);
      }, delay * 2);
    };
  },
  /**
   * 生成防抖函数
   * @example
   * // 将获取数据的函数转换为防抖函数，避免因为参数经常变化导致频繁请求
   * const resolveData = (url) => http.get(url)
   * const debouncedResolveData = debounce(resolveData, 500)
   */
  debounce(fn: (...args: any[]) => void, delay = 1000) {
    let timer: number = -1;
    return function (...args: any[]) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  },
  /**
   * 格式化数值为每 3 位一个逗号的字符串，返回格式化后的结果
   */
  getFormattedNum(value: number) {
    const string = String(value);
    const array = Array.from(string);
    const splittedArray = [];

    while (1) {
      const len = array.length;
      const shouldStop = len - 3 < 0;
      const arr = shouldStop ? array.splice(0, len) : array.splice(len - 3, len);
      const shouldAdd = arr.length > 0;
      if (!shouldAdd) {
        break;
      }
      splittedArray.push(arr);
    }

    splittedArray.reverse();

    const formatted = splittedArray.map(arr => arr.join('')).join(',');
    return formatted;
  },
  /**
   * 获取保留指定小数位数的数值
   */
  getFixedNum(value: number, digit = 1) {
    const multiple = Math.pow(10, digit);
    const num = Math.round(value * multiple) / multiple;
    return num;
  },
  /**
   * 尝试获取满足期待条件的值，获取失败则返回备选值
   */
  obtain<T>(option: {
    get: () => T;
    expect?: (v: T) => boolean;
    alternative: T | (() => T);
    debug?: boolean;
  }) {
    const canShowError = typeof option.debug === 'boolean' ? option.debug : true;
    option.alternative =
      typeof option.alternative === 'function'
        ? (option.alternative as () => T)()
        : option.alternative;
    try {
      const value = option.get();
      const canGetValue = typeof option.expect === 'function' ? option.expect(value) : true;
      return canGetValue ? value : option.alternative;
    } catch (err) {
      if (canShowError) {
        console.error(err);
      }
      return option.alternative;
    }
  },
  /**
   * 尝试调用方法，避免调用失败中断程序
   */
  invoke(fn: (...args: any[]) => any, canShowError = true) {
    try {
      return fn();
    } catch (err) {
      canShowError && console.error(err);
    }
  },
  /**
   * 根据列表创建枚举映射对象，实现名称和值互查
   * @param list 待转换为枚举类型的列表，每一项是一个对象
   * @param nameKey 列表项对象中，键的键名
   * @param valueKey 列表项对象中，值的键名
   */
  createEnumMap(list: Readonly<{ [k: string]: any }[]>, nameKey = 'name', valueKey = 'value') {
    const map = new Map();
    list.forEach(item => {
      map.set(item[nameKey], item[valueKey]);
      map.set(item[valueKey], item[nameKey]);
    });
    return map;
  },
  /**
   * 获取列表中的下一个元素，无限循环获取
   */
  getNextItem<T>(item: T, list: T[]) {
    const max = list.length - 1;
    const currentIndex = list.indexOf(item);
    let nextIndex = currentIndex + 1;
    nextIndex = nextIndex >= max ? 0 : nextIndex;
    const nextItem = list[nextIndex];
    return nextItem;
  },
  /**
   * 当数组 array 长度不够 length 时，用 value 填充至指定的长度
   */
  fillArray(array: any[], length: number, value: any) {
    const targetLen = length - array.length;
    const canFill = targetLen > 0;
    if (!canFill) return;
    array.push(...new Array(targetLen).fill(value));
  },
  /**
   * 获取图标资源路径
   * @param {string} icon 图片名字
   * @param {string} format 图片格式，默认png
   * @param {boolean} isActive 图片状态类型，默认false
   * @returns {string} 资源路径
   */
  getIcon(icon: string, format = 'png', isActive = false) {
    if (isActive) {
      icon = `${icon}-active`;
    }
    return `/static/sjt-img/${icon}.${format}`;
  },
  joinQuery,
  createURL,
  pickProps,
  copy,
  getFormattedTime,
  getDataType,
  formatParams,
  hexToRgb
};

/**
 * 拼接对象为 url 参数，如：?k1=v1&k2=v2
 * @param query
 */
function joinQuery(query: { [k: string]: any }) {
  return Object.keys(query)
    .reduce((prev, cur) => prev + `&${cur}=${encodeURIComponent(query[cur])}`, '?')
    .replace('?&', '?');
}

/**
 * 拼接 base + rest + query 为 url，其中，base, query 为可选
 */
function createURL({
  base,
  rest,
  query
}: {
  base?: string;
  rest: string;
  query?: { [k: string]: any };
}) {
  let url = rest;
  if (query) url += joinQuery(query);
  if (base) url = base + url;
  return url;
}

/**
 * @example
 * // 从对象中，提取指定属性，返回新对象
 * const obj = pickProps({ name: 'aubur', 0: 27, [Symbol.iterator]: () => null }, [Symbol.iterator]);
 */
function pickProps<ObjType extends object, ObjKeys extends keyof ObjType>(
  obj: ObjType,
  keys: ObjKeys[]
) {
  const result = {} as { [k in ObjKeys]: ObjType[k] };
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

/**
 * 复制文本到系统剪切板
 */
function copy({
  el,
  text,
  onSuccess,
  onError
}: {
  el: () => Node | null;
  text: string;
  onSuccess?: () => void;
  onError?: () => void;
}) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        ElMessage.success('已复制到剪切板');
        typeof onSuccess === 'function' && onSuccess();
      })
      .then(err => {
        ElMessage.error('复制失败' + JSON.stringify(err));
        typeof onError === 'function' && onError();
      });
  } else {
    const selection = window.getSelection()!;
    const range = document.createRange();
    const node = el();
    if (node) {
      range.selectNode(node);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy', false, text);
      ElMessage.success('已复制到剪切板');
      typeof onSuccess === 'function' && onSuccess();
    } else {
      ElMessage.error('复制失败');
      typeof onError === 'function' && onError();
    }
    selection.removeAllRanges();
  }
}

/**
 * 获取当前时间的格式化结果：年月日时分秒
 * @example
 * console.log(getFormattedTime('2022-03-04 11:42:12'))
 * console.log(getFormattedTime(Date.now()))
 * console.log(getFormattedTime(new Date()))
 */
function getFormattedTime(date?: Date | number | string, withMs = false) {
  const d = (() => {
    if (date instanceof Date) return date;
    if (typeof date === 'number' || typeof date === 'string') return new Date(date);
    return new Date();
  })();
  const ts = d.getTime() - d.getTimezoneOffset() * 60000;
  let result = new Date(ts).toISOString().slice(0, -1).split('T').join(' ');
  if (!withMs) result = result.split('.')[0];
  return result;
}

/**
 * 获取一个变量的数据类型
 * @param  {any} data 要获取类型的变量
 */
function getDataType(data: any) {
  return Object.prototype.toString.call(data).slice(8, -1);
}

/**
 * 格式化参数，删除空健
 * @param  {Object} params 要检查的参数对象
 */
function formatParams(params: any) {
  if (sj.getDataType(params) != 'Object') {
    return console.log('params is not a object');
  }
  for (const key of Object.keys(params)) {
    if (!params[key]) delete params[key];
  }
  return params;
}

/*
    hex: {String}, "#333", "#AF0382"
  */
/**
 * @param  {String} hex
 * @param  {} type='string'
 */
function hexToRgb(hex: string, type = 'string') {
  hex = hex.slice(1);
  if (hex.length == 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const rgb = {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  };

  return type == 'object' ? rgb : `(${rgb.r},${rgb.g},${rgb.b})`;
}

export { sj };
