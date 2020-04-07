/**
 * 单页面统计
 * @type {Object}
 */
import DB from './lib/db';
import { getCookie } from './lib/utils';

const spaHandler = {
  init(opt) {
    // uid
    this.uid = opt.uid;

    // history aop
    function aop(type) {
      const source = window.history[type];
      return function() {
        const event = new Event(type);
        event.arguments = arguments;
        window.dispatchEvent(event);
        return source.apply(this, arguments);
      };
    }

    window.history.pushState = aop('pushState');
    window.history.replaceState = aop('replaceState');

    window.addEventListener('hashchange', this.handler, false);
    window.addEventListener('pushState', this.handler, true);
    window.addEventListener('replaceState', this.handler, true);
  },
  handler(e) {
    setTimeout(() => {
      DB.getLogs({
        start: Date.now() - 24 * 3600 * 1000,
        end: Date.now(),
      }, function(err, result) {
        const { location, performance } = window;
        const { href } = location;
        const already = result.filter(r => r.key === 'resource').map(r => r.resource).flat(1);
        const resource = performance.getEntriesByType('resource').filter(r => already.every(a => a.name !== r.name && a.startTime !== r.startTime));
        console.log(resource);

        const spaInfo = {
          sid: getCookie('x-session-id'),
          uid: getCookie(this.uid),
          key: 'resource',
          page: href,
          resource: resource.map(({ name, startTime, duration, transferSize, initiatorType }) => ({
            name,
            startTime,
            duration,
            transferSize,
            initiatorType,
          })),
          ht: Date.now(),
        };

        DB.addLog(spaInfo);
      });
    }, 0);
  },
};

export default spaHandler;
