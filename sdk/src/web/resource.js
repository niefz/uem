/**
 * 资源统计
 * @type {Object}
 */
import DB from './lib/db';
import { getCookie } from './lib/utils';

const resourceHandler = {
  init() {
    if (!(window.performance && window.performance.getEntries)) return;
    this.getPerformanceEntries();
  },
  getPerformanceEntries() {
    const { performance } = window;
    const resource = performance.getEntriesByType('resource').filter((r) => ['link', 'script', 'css', 'img', 'other'].includes(r.initiatorType));

    const resourceInfo = {
      key: 'resource',
      pid: getCookie('pid'),
      page: window.location.href,
      title: window.document.title,
      resource: resource.map(({ name, startTime, duration, transferSize, initiatorType }) => ({
        name,
        startTime,
        duration,
        transferSize,
        initiatorType,
      })),
      ht: Date.now(),
    };

    DB.addLog(resourceInfo);
  },
};

export default resourceHandler;
