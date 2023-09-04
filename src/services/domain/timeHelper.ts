const timeHelper = {
  /**
   * 解析时间对象为字符串形式，如 2021-01-01 00:00:01
   * @param value
   * @param [shouldParseTime] 是否解析日期、时间中的时间部分
   */
  parseInstance(value: Date, shouldParseTime = false) {
    const [year, month, date] = [value.getFullYear(), value.getMonth() + 1, value.getDate()];
    const partDate = [year, month, date].map(v => (+v < 10 ? '0' + v : '' + v)).join('-');

    if (!shouldParseTime) return partDate;

    const [hour, min, sec] = [value.getHours(), value.getMinutes(), value.getSeconds()];
    const partTime = [hour, min, sec].map(v => (+v < 10 ? '0' + v : '' + v)).join(':');

    return [partDate, partTime].join(' ');
  },
  /**
   * 解析时间戳为字符串形式
   * @param value
   * @param [shouldParseTime]
   */
  parseNumber(value: number, shouldParseTime = false) {
    const instance = new Date(value);
    const result = this.parseInstance(instance, shouldParseTime);
    return result;
  },
  /**
   * 将单位为秒的时长格式化为时分秒表示的时长
   * @example
   * const duration = 119;
   * const formattedDuration = getDurationWithSec(duration); // => 1:59
   */
  getDurationWithSec(value: number) {
    const canGet = typeof value === 'number' && value > 0;
    if (!canGet) return '0:00';

    const hour = Math.floor(value / (60 * 60)); // 秒 / 每小时秒数 -> 向下取整
    const minute = Math.floor((value % (60 * 60)) / 60); // 秒 % 每小时秒数 -> 除去所有小时后，剩余秒数 ->
    const second = Math.round(value % 60); // 秒 % 60整倍数 -> 剩余秒

    const shouldAddHour = hour > 0;
    if (shouldAddHour) {
      const rest = [minute, second].map(v => (+v < 10 ? '0' + v : '' + v));
      return [hour, ...rest].join(':');
    } else {
      const rest = [second].map(v => (+v < 10 ? '0' + v : '' + v));
      return [minute, ...rest].join(':');
    }
  },
  /**
   * 格式化毫秒为时长
   */
  getDurationWithMs(value: number, showMs = true) {
    const canGet = typeof value === 'number' && value > 0;
    if (!canGet) return '0:00';

    const ms = this.addPrefix(Math.round(value % 1000), 3);
    const sec = Math.floor(value / 1000);
    const duration = this.getDurationWithSec(sec);
    return showMs ? duration + '.' + ms : duration;
  },
  /**
   * 数值左侧补0至指定位数，返回字符串，如：2 -> 02
   */
  addPrefix(num: number, digit = 2) {
    if (isNaN(num) || !isFinite(num)) return '' + num;
    let result = '' + num;
    let prefix = '';
    const shouldAdd = digit > result.length;
    if (shouldAdd) {
      prefix = new Array(digit - result.length).fill(0).join('');
    }
    return prefix + result;
  }
};

export { timeHelper };
