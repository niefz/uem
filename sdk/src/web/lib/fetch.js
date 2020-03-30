/**
 * fetch hook
 */
import { getCookie, uuid } from './utils';
import DB from './db';

export const hackFetch = () => {
  const _fetch = window.fetch;

  if (!_fetch) return;

  window.fetch = function() {
    const sid = getCookie('x-session-id');
    const tid = uuid();
    const startTime = Date.now();
    const [href, options] = arguments;
    const [url, param] = href.split('?');
    const method = options ? options.method : '';
    const params = options ? options.method === 'GET' ? param : options.body : param;
    arguments[1].headers['x-session-id'] = sid;
    if (options.enableTrace) arguments[1].headers['x-tracing-id'] = tid;
    return _fetch
      .apply(this, arguments)
      .then(function(res) {
        const { status } = res;
        res.clone().text().then(response => {
          const fetchInfo = {
            key: 'api',
            page: window.location.href,
            api: {
              method,
              url,
              headers: {
                'x-session-id': sid,
                'x-tracing-id': tid,
              },
              params,
              status,
              response,
              startTime,
              endTime: Date.now(),
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
