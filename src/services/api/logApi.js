import { http } from '@/services/domain/http';

const apiLog = {
  getSessionLogRequest(token,sessionId,beginTime,endTime,page,pageSize) {
    let params = '?sessionId=' + sessionId
    params += '&token=' + token
    params += '&page=' + page
    params += '&pageSize=' + pageSize
    params += '&beginTime=' + beginTime
    params += '&endTime=' + endTime
    const request = http.get('/log/search' + params)
    return request
  }
};

export { apiLog };
