/**
 * 日志上报
 * @param data
 * @param url
 */
import LZString from 'lz-string';
import DB from './lib/db';
import { formatter, getCookie } from './lib/utils';

const report = {
  init(opt) {
    // 页面后台运行时，自动触发上报
    window.document.addEventListener('visibilitychange', () => {
      if (window.document.visibilityState === 'hidden') {
        this.reportLog(opt);
      }
    }, false);

    // 页面卸载时，自动触发上报
    window.document.addEventListener('beforeunload', () => {
      this.reportLog(opt);
    }, false);

    // 定时上报
    const timeout = 1000 * 10; // 10s
    setTimeout(() => {
      this.reportLog(opt);
    }, timeout);
  },
  reportLog(opt) {
    DB.getLogs({
      start: Date.now() - 24 * 3600 * 1000,
      end: Date.now(),
    }, function(err, result) {
      if (result.length) {
        const { aid, uid, url } = opt;
        const logger = {
          aid,
          sid: getCookie('x-session-id'),
          uid: getCookie(uid),
          base: result.filter(r => r.key === 'base'),
          performance: result.filter(r => r.key === 'performance'),
          resource: result.filter(r => r.key === 'resource'),
          error: result.filter(r => r.key === 'error'),
          api: result.filter(r => r.key === 'api'),
          behavior: result.filter(r => r.key === 'behavior'),
          console: result.filter(r => r.key === 'console'),
          record: result.filter(r => r.key === 'record'),
          rt: Date.now(),
        };
        const src = url + '?' + formatter(logger);
        const loggerString = JSON.stringify(logger);
        const toCompress = LZString.compress(loggerString);
        if (window.navigator.sendBeacon && typeof window.navigator.sendBeacon === 'function') {
          window.navigator.sendBeacon(url, loggerString);
        } else if (src.length < 2083) {
          const img = new Image();
          img.src = src;
        } else {
          const client = new XMLHttpRequest();
          client.open('POST', url, false);
          client.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
          client.send(toCompress);
        }
        DB.clearDB();
      }
    });
  },
};

export default report;
