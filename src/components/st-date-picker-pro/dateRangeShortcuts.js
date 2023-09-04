function initRange() {
  const end = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 0);
  return [start, end];
}

const dateRangeShortcuts = [
  {
    text: '今天',
    value: () => {
      const [start, end] = initRange();
      return [start, end];
    },
    previousText: '昨天',
    previous: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      return [start, end];
    }
  },
  {
    text: '昨天',
    value: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      return [start, end];
    },
    previousText: '前天',
    previous: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 2);
      end.setDate(end.getDate() - 2);
      return [start, end];
    }
  },
  {
    text: '本周',
    value: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      return [start, end];
    },
    previousText: '上周',
    previous: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      start.setDate(start.getDate() - 7);
      end.setMonth(start.getMonth());
      end.setDate(start.getDate() + 6);
      return [start, end];
    }
  },
  {
    text: '上周',
    value: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      start.setDate(start.getDate() - 7);
      end.setMonth(start.getMonth());
      end.setDate(start.getDate() + 6);
      return [start, end];
    },
    previousText: '上上周',
    previous: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      start.setDate(start.getDate() - 7 - 7);
      end.setMonth(start.getMonth());
      end.setDate(start.getDate() + 6);
      return [start, end];
    }
  },
  {
    text: '本月',
    value: () => {
      const [start, end] = initRange();
      start.setDate(1);
      return [start, end];
    },
    previousText: '上月',
    previous: () => {
      const [start, end] = initRange();
      start.setMonth(start.getMonth() - 1, 1);
      end.setDate(0);
      return [start, end];
    }
  },
  {
    text: '上月',
    value: () => {
      const [start, end] = initRange();
      start.setMonth(start.getMonth() - 1, 1);
      end.setDate(0);
      return [start, end];
    },
    previousText: '上上月',
    previous: () => {
      const [start, end] = initRange();
      end.setMonth(start.getMonth() - 1, 0);
      start.setMonth(start.getMonth() - 2, 1);
      return [start, end];
    }
  },
  {
    text: '前天',
    value: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 2);
      end.setDate(end.getDate() - 2);
      return [start, end];
    }
  },
  {
    text: '上上周',
    value: () => {
      const [start, end] = initRange();
      const thisDay = start.getDay() - 1;
      start.setDate(start.getDate() - thisDay);
      if (thisDay === -1) {
        start.setDate(start.getDate() - 7);
      }
      start.setDate(start.getDate() - 7 - 7);
      end.setMonth(start.getMonth());
      end.setDate(start.getDate() + 6);
      return [start, end];
    }
  },
  {
    text: '上上月',
    value: () => {
      const [start, end] = initRange();
      end.setMonth(start.getMonth() - 1, 0);
      start.setMonth(start.getMonth() - 2, 1);
      return [start, end];
    }
  },
  {
    text: '过去7天',
    value: () => {
      //不包括今天
      const [start, end] = initRange();
      start.setDate(start.getDate() - 7);
      end.setDate(end.getDate() - 1);
      return [start, end];
    }
  },
  {
    text: '过去30天',
    value: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 30);
      end.setDate(end.getDate() - 1);
      return [start, end];
    }
  },
  {
    text: '过去60天',
    value: () => {
      const [start, end] = initRange();
      start.setDate(start.getDate() - 60);
      end.setDate(end.getDate() - 1);
      return [start, end];
    }
  }
];

export { dateRangeShortcuts };
