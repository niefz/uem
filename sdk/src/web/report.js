/**
 * 日志上报
 * @param data
 * @param url
 */
import sizeof from 'sizeof';
// import LZString from 'lz-string';
import DB from './lib/db';
import { getCookie, loaded, convertToUrlParams } from './lib/utils';

const report = {
  init(opt) {
    // 页面加载时，自动触发上报
    loaded(() => {
      this.reportLog(opt, 'loaded');
    });

    // 页面后台运行时，自动触发上报
    window.document.addEventListener('visibilitychange', () => {
      if (window.document.visibilityState === 'hidden') {
        this.reportLog(opt, 'visibilitychange');
      }
    }, false);

    // 页面卸载时，自动触发上报
    window.addEventListener('beforeunload', (event) => {
      // event.preventDefault();
      this.reportLog(opt, 'leave');
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
      const boolean = result.length || type === 'leave';
      if (boolean) {
        const logger = {
          performance: result.filter(r => r.key === 'performance'),
          resource: result.filter(r => r.key === 'resource'),
          spa: result.filter(r => r.key === 'spa'),
          error: result.filter(r => r.key === 'error'),
          api: result.filter(r => r.key === 'api'),
          behavior: result.filter(r => r.key === 'behavior'),
          console: result.filter(r => r.key === 'console'),
          record: result.filter(r => r.key === 'record'),
        };
        this.report(opt, logger, type);
      }
    });
  },
  report(opt, data, type) {
    const { url, aid, uid } = opt;
    const logger = {
      type,
      aid,
      sid: getCookie('x-session-id') || '',
      uid: getCookie(uid) || 'anonymous',
      rt: Date.now(),
      ...data,
    };
    const loggerString = JSON.stringify(logger);
    const size = sizeof.sizeof(logger);
    // const toCompress = LZString.compress(loggerString);
    const src = url + '?' + convertToUrlParams(JSON.parse(loggerString));
    if (window.navigator.sendBeacon && typeof window.navigator.sendBeacon === 'function' && size < 65536) {
      this.sendBeacon(url, loggerString);
    // } else if (src.length < 2083) {
    //   const img = new Image();
    //   img.src = src;
    } else {
      this.post(url, loggerString);
    }
    if (type === 'enter') return;
    DB.clearDB();
  },
  sendBeacon(url, data) {
    const headers = {
      type: 'text/plain; charset=utf-8',
    };
    const blob = new Blob([data], headers);
    window.navigator.sendBeacon(url, blob);
  },
  post(url, data) {
    const client = new XMLHttpRequest();
    client.open('POST', url, false);
    client.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
    client.send(data);
  }
};

export default report;
