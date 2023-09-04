const TimeUtil = {
  /**
   * Date 对象转 yyyy-MM-dd 字符串
   */
  dateToYMD(date) {
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return Y + M + D;
  },
  firstSecondOfDate(date) {
    return TimeUtil.dateToYMD(date) + ' 00:00:00';
  },
  lastSecondOfDate(date) {
    return TimeUtil.dateToYMD(date) + ' 23:59:59';
  },
  dateToYMDHMS(date) {
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  },
  timeStampToYMDHMS(timeStamp) {
    if (typeof timeStamp === 'string') {
      timeStamp = parseInt(timeStamp);
    }
    let date = new Date(timeStamp);
    return TimeUtil.dateToYMDHMS(date);
  },
  secondsToColonDelimited(seconds) {
    seconds = parseInt(seconds);
    if (seconds === undefined) {
      return '0:00';
    }
    if (seconds <= 0) {
      return '0:00';
    }
    let hour = Math.floor(seconds / (60 * 60));
    let minute = Math.floor((seconds % (60 * 60)) / 60);
    let second = (seconds % (60 * 60)) % 60;
    let hourPart = hour > 0 ? hour + ':' : '';
    let minutePart = hourPart !== '' && minute < 10 ? '0' + minute + ':' : minute + ':';
    let secondPart = second < 10 ? '0' + second : second;
    return hourPart + minutePart + secondPart;
  },
  /**
   * 两个时间的差值(天数)
   *
   */
  distanceToday(first, second) {
    const firstTimestamp = +new Date(first);
    const secondTimestamp = +new Date(second);
    //如果传入的时间不存在
    if (!first || !second) {
      return '';
    }
    return Math.round(Math.abs(secondTimestamp - firstTimestamp) / (3600 * 1000 * 24));
  }
};

export { TimeUtil };
