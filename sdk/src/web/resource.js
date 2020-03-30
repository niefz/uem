/**
 * 资源统计
 * @type {Object}
 */
import DB from './lib/db';

const resourceHandler = {
  init() {
    if (!(window.performance && window.performance.getEntries)) return;
    const resources = this.getPerformanceEntries();
  },
  getPerformanceEntries() {
    const { location, performance } = window;
    const { href } = location;
    const resource = performance.getEntriesByType('resource');

    const resourceInfo = {
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

    DB.addLog(resourceInfo);
  },
};

export default resourceHandler;
