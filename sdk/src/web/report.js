/**
 * 日志上报
 * @param data
 * @param url
 */
import LZString from 'lz-string';
import DB from './lib/db';
import { getCookie, loaded, convertToUrlParams } from './lib/utils';

const report = {
  init(opt) {
    // 页面后台运行时，自动触发上报
    window.document.addEventListener('visibilitychange', () => {
      if (window.document.visibilityState === 'hidden') {
        this.reportLog(opt, 'visibilitychange');
      }
    }, false);

    // 页面卸载时，自动触发上报
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      this.reportLog(opt, 'leave');
    });

    // 页面加载时，自动触发上报
    loaded(() => {
      this.reportLog(opt, 'enter');
    });

    // 定时上报
    const timeout = 1000 * 10;
    const interval = () => {
      this.reportLog(opt);
      setTimeout(interval, timeout);
    };
    setTimeout(interval, timeout);
  },
  reportLog(opt, type = 'process') {
    DB.getLogs({
      start: Date.now() - 24 * 3600 * 1000,
      end: Date.now(),
    }, (err, result) => {
      if (result.length || type === 'leave') {
        const { aid, uid, url } = opt;
        const logger = {
          type,
          aid,
          sid: getCookie('x-session-id'),
          uid: getCookie(uid) || 'anonymous',
          rt: Date.now(),
          base: result.find(r => r.key === 'base'),
          performance: result.filter(r => r.key === 'performance'),
          resource: result.filter(r => r.key === 'resource'),
          spa: result.filter(r => r.key === 'spa'),
          error: result.filter(r => r.key === 'error'),
          api: result.filter(r => r.key === 'api'),
          behavior: result.filter(r => r.key === 'behavior'),
          console: result.filter(r => r.key === 'console'),
          record: result.filter(r => r.key === 'record'),
        };
        const loggerString = JSON.stringify(logger);
        const toCompress = LZString.compress(loggerString);
        const src = url + '?' + convertToUrlParams(JSON.parse(loggerString));
        if (window.navigator.sendBeacon && typeof window.navigator.sendBeacon === 'function') {
          const headers = {
            type: 'text/plain; charset=utf-8',
          };
          const blob = new Blob([loggerString], headers);
          window.navigator.sendBeacon(url, blob);
        } else if (src.length < 2083) {
          const img = new Image();
          img.src = src;
        } else {
          const client = new XMLHttpRequest();
          client.open('POST', url, false);
          client.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
          client.send(toCompress);
        }
        DB.clearDB();
      }
    });
  },
};

export default report;
