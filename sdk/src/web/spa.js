/**
 * 单页面统计
 * @type {Object}
 */
import DB from './lib/db';

const spaHandler = {
  init() {
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
    const spaInfo = {
      key: 'spa',
      hash: window.location.href,
      title: window.document.title,
      ht: Date.now(),
    };
    DB.addLog(spaInfo);
  },
};

export default spaHandler;
