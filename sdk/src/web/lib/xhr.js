/**
 * XMLHttpRequest hook
 */
import hookXMLHttpRequest from 'ajax-hook';
import { getCookie, uuid } from './utils';
import DB from './db';

export const hackXMLHttpRequest = (opt) => {
  hookXMLHttpRequest.hookAjax({
    open: function(arg) {
      const [method, url] = arg;
      this.api = {
        method,
        url,
        startTime: Date.now(),
      };
    },
    send: function(arg, xhr) {
      const sid = getCookie('x-session-id');
      const tid = uuid();
      const [params] = arg;
      this.api.params = params;
      this.api.headers = {
        'x-session-id': sid,
        'x-tracing-id': tid,
      };
      xhr.setRequestHeader('x-session-id', sid);
      if (opt.enableTrace) xhr.setRequestHeader('x-tracing-id', tid);
    },
    onreadystatechange: function(xhr) {
      if (xhr.readyState === 4) {
        const { status, response } = xhr.xhr;
        const { method, url, headers, params, startTime } = xhr.api;

        const xhrInfo = {
          key: 'api',
          page: window.location.href,
          title: window.document.title,
          api: {
            method,
            url,
            headers,
            params,
            status,
            response,
            startTime,
            endTime: Date.now(),
          },
          ht: Date.now(),
        };

        DB.addLog(xhrInfo);
      }
    },
  });
};
