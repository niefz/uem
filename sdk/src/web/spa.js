/**
 * 单页面统计
 * @type {Object}
 */
import DB from './lib/db';
import { setCookie, uuid } from './lib/utils';

const spaHandler = {
  init(options) {
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

    window.addEventListener('hashchange', (event) => {
      this.handler(event, options);
    });
    window.addEventListener('pushState', (event) => {
      this.handler(event, options);
    }, true);
    window.addEventListener('replaceState', (event) => {
      this.handler(event, options);
    });
  },
  handler(event, options) {
    // const resources = [];
    // const performanceObserver = new PerformanceObserver(function(list) {
    //   const [PerformanceNavigationTiming] = list.getEntriesByType('navigation');
    //   if (PerformanceNavigationTiming) return;
    //   const [PerformanceResourceTiming] = list.getEntriesByType('resource');
    //   if (PerformanceResourceTiming) resources.push(PerformanceResourceTiming);
    //   const resource = resources.filter((r) => ['link', 'script', 'css', 'img', 'other'].includes(r.initiatorType));
    //   console.log(resource);
    // });
    // performanceObserver.observe({
    //   entryTypes: ['navigation', 'resource'],
    // });
    if (event.type === 'replaceState') return;

    // mark page
    const pid = uuid();

    setCookie('pid', pid, window.location.hostname);

    setTimeout(() => {
      const spaInfo = {
        key: 'spa',
        pid,
        page: event.target.location.href,
        title: event.target.document.title,
        ht: Date.now(),
      };
      DB.addLog(spaInfo);
    }, 100);
  },
};

export default spaHandler;
