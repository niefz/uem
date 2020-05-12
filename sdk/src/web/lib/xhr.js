/**
 * XMLHttpRequest hook
 */
import hookXMLHttpRequest from 'ajax-hook';
import { getCookie, uuid, convertToJson } from './utils';
import DB from './db';

export const hackXMLHttpRequest = (opt) => {
  hookXMLHttpRequest.hookAjax({
    open: function(arg) {
      const [method, url] = arg;
      this.api = {
        method,
        url,
        params: method === 'GET' ? convertToJson(url.split('?')[1]) : '',
        startTime: performance.now(),
      };
    },
    send: function(arg, xhr) {
      const sid = getCookie('x-session-id');
      const tid = uuid();
      const [params] = arg;
      if (params) this.api.params = params;
      this.api.headers = {
        'x-session-id': sid,
        'x-tracing-id': tid,
      };
      xhr.setRequestHeader('x-session-id', sid);
      if (opt.enableTrace) xhr.setRequestHeader('x-tracing-id', tid);
    },
    onreadystatechange: function(xhr) {
      if (xhr.readyState === 4) {
        const { status, responseText } = xhr.xhr;
        const { method, url, headers, params, startTime } = xhr.api;

        const xhrInfo = {
          key: 'api',
          pid: getCookie('pid'),
          page: decodeURIComponent(window.location.href),
          title: window.document.title,
          api: {
            method,
            url,
            headers,
            params,
            status,
            // response: responseText ? responseText.slice(0, 10240) : '',
            startTime,
            endTime: performance.now(),
          },
          ht: Date.now(),
        };

        DB.addLog(xhrInfo);
      }
    },
  });
};
