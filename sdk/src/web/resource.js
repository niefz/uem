/**
 * 资源统计
 * @type {Object}
 */
import DB from './lib/db';
import { getCookie } from './lib/utils';

const resourceHandler = {
  init(opt) {
    if (!(window.performance && window.performance.getEntries)) return;
    const resources = this.getPerformanceEntries(opt);
  },
  getPerformanceEntries(opt) {
    const { location, performance } = window;
    const { href } = location;
    const resource = performance.getEntriesByType('resource');

    const resourceInfo = {
      sid: getCookie('x-session-id'),
      uid: getCookie(opt.uid),
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
