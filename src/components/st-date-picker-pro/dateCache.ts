import { vars } from '@/services/data/vars';

/**
 * 读取缓存时间
 * @param defaultDate 默认时间范围 [startDate, endDate];
 */
function getDateCache(presetDate: Date[]) {
  const key = vars.flag_date;
  const range = JSON.parse(localStorage.getItem(key) as string);
  const canUseCache = range instanceof Array && range.length === 2;
  if (!canUseCache) return presetDate;
  return range.map(num => new Date(num));
}

/**
 * 缓存时间
 * @param range 时间范围 [startDate, endDate];
 */
function setDateCache(range: Date[] | number[]) {
  const stringified = JSON.stringify(range.map(date => +date));
  localStorage.setItem(vars.flag_date, stringified);
}

export { getDateCache, setDateCache };
