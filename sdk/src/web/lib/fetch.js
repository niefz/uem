/**
 * fetch hook
 */
import { getCookie, uuid } from './utils';
import DB from './db';

export const hackFetch = (opt) => {
  const _fetch = window.fetch;

  if (!_fetch) return;

  window.fetch = function() {
    const sid = getCookie('x-session-id');
    const tid = uuid();
    const startTime = performance.now();
    const [href, options] = arguments;
    const [url, param] = href.split('?');
    const method = options ? options.method : '';
    const params = options ? options.method === 'GET' ? param : options.body : param;
    if (arguments[1]) arguments[1].headers['x-session-id'] = sid;
    if (opt.enableTrace) arguments[1].headers['x-tracing-id'] = tid;
    return _fetch
      .apply(this, arguments)
      .then(function(res) {
        const { status } = res;
        res.clone().text().then(response => {
          const fetchInfo = {
            key: 'api',
            pid: getCookie('pid'),
            page: decodeURIComponent(window.location.href),
            title: window.document.title,
            api: {
              method,
              url,
              headers: {
                'x-session-id': sid,
                'x-tracing-id': tid,
              },
              params,
              status,
              // response: response ? response.slice(0, 10240) : '',
              startTime,
              endTime: performance.now(),
            },
          };
          DB.addLog(fetchInfo);
        });
        return res;
      })
      .catch(function(err) {
        throw err;
      });
  };
};
