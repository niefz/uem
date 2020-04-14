/**
 * 单页面统计
 * @type {Object}
 */
import DB from './lib/db';
import report from './report';

const spaHandler = {
  init(opt) {
    this.opt = opt;

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
  handler() {
    setTimeout(() => {
      DB.getLogs({
        start: Date.now() - 24 * 3600 * 1000,
        end: Date.now(),
      }, (err, result) => {
        const { performance } = window;
        const already = result.filter(r => r.key === 'resource').map(r => r.resource).flat(1);
        const resource = performance.getEntriesByType('resource').filter(r => already.every(a => a.name !== r.name && a.startTime !== r.startTime));

        const spaInfo = {
          key: 'resource',
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

        this.report(this.opt);
      });
    }, 0);
  },
  report(opt) {
    report.reportLog(opt);
  },
};

export default spaHandler;
