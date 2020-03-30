/**
 * API 统计
 * @type {Object}
 */
import { hackFetch } from './lib/fetch';
import { hackXMLHttpRequest } from './lib/xhr';

const apiHandler = {
  init(options) {
    // 拦截 xmlHttpRequest 请求
    hackXMLHttpRequest(options);

    // 拦截 fetch 请求
    hackFetch(options);
  },
};

export default apiHandler;
