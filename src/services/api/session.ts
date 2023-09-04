import { http } from '@/services/domain/http';
import { WebSessionActionsOption } from '@/views/session/web/session';
import axios from 'axios';
import { sj } from '@/services/domain/util';

const apiSession = {
  /**
   * 完整的参数 eg. '?token=324wewer4&startTime=1634235204....'
   */
  getSessionList(token: string, filter: any, pageIndex: number, pageSize: number) {
    let params = '?token=' + token + '&type=all&sort=0';
    params += '&pageIndex=' + pageIndex + '&pageSize=' + pageSize;
    params += '&startTime=' + filter.startTime + '&endTime=' + filter.endTime;
    if (filter.sessionRadioType === '可回放会话') {
      params += '&hasReplay=1';
    }
    const request = http.post('/session' + params, filter.filterBody);
    return request;
  },
  getSessionReplay(currentRow: any, token: string) {
    const params =
      '?token=' +
      token +
      '&sessionId=' +
      currentRow.sessionId +
      '&replayType=' +
      currentRow.replay_type;
    return http.get('/session/replay' + params);
  },
  getSessionAction(currentRow: any, token: string) {
    const params =
      '?token=' +
      token +
      '&sessionId=' +
      currentRow.sessionId +
      '&startTimestamp=' +
      currentRow.begin_time +
      '&isId=' +
      currentRow.isId +
      '&replayType=' +
      currentRow.replay_type;
    return http.get('/session/action' + params);
  },
  getSessionActionAndReplay(row: any, route: any) {
    return axios.all([
      apiSession.getSessionAction(row, route.params.token),
      apiSession.getSessionReplay(row, route.params.token)
    ]);
  },
  getSessionIndex(token: string, userIndex: number) {
    const params = '?token=' + token + '&userIndex=' + userIndex;
    return http.get('session/count' + params);
  },
  getSessionInfo(sessionId: string, token: string) {
    const params = '?sessionId=' + sessionId + '&token=' + token;
    return http.get('session/entry' + params);
  },
  // web 接口
  getWebSessionList,
  getWebSessionItem,
  getWebSessionActions,
  getWebTimeline
};

export interface WebSessionListQuery {
  token: string;
  type?: -1 | 0 | 1; // -1全部，0无回放，1有回放
  sort?: 0 | 1; // 0 降序，1升序
  pageIndex: number;
  pageSize: number;
  startTime: string;
  endTime: string;
}

/** 获取 web 会话列表 */
function getWebSessionList(query: WebSessionListQuery) {
  query.type = typeof query.type === 'number' ? query.type : -1;
  query.sort = typeof query.sort === 'number' ? query.sort : 0;
  const { token, type, sort, pageIndex, pageSize, startTime, endTime } = query;
  const rest = [
    '/h5/session',
    createQuery('token', token, true),
    createQuery('type', type),
    createQuery('sort', sort),
    createQuery('pageIndex', pageIndex),
    createQuery('pageSize', pageSize),
    createQuery('startTime', startTime),
    createQuery('endTime', endTime)
  ].join('');
  return http.post(rest);
}

/** 获取当前会话对象 */
function getWebSessionItem(query: { token: string; sessionId: string }) {
  const rest = [
    '/h5/session/entry',
    createQuery('token', query.token, true),
    createQuery('sessionId', query.sessionId)
  ].join('');
  return http.get(rest);
}

/** 获取 web 会话视频数据 */
function getWebSessionActions(query: WebSessionActionsOption) {
  const rest = (() => {
    if (query.type === 'json') {
      return [
        '/h5/session/action',
        createQuery('token', query.token, true),
        createQuery('isId', query.isId)
      ].join('');
    }

    if (query.type === 'file') {
      return [
        '/h5/session/replayV2',
        createQuery('token', query.token, true),
        createQuery('sessionId', query.sessionId)
      ].join('');
    }

    return '';
  })();

  return http.get(rest);
}

/**
 * 获取 web 回放右上角的时间线数据
 */
function getWebTimeline(query: Pick<WebSessionActionsOption, 'token' | 'sessionId'>) {
  const rest = sj.createURL({ rest: '/h5/session/timeline', query });
  return http.get(rest);
}

/**
 * 获取
 */
function createQuery(k: string, v: any, isFirst: boolean = false) {
  return isFirst ? `?${k}=${v}` : `&${k}=${v}`;
}

export { apiSession };
