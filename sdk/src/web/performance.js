/**
 * 性能统计
 * @type {Object}
 */
import DB from './lib/db';
import { getCookie } from './lib/utils';

const performanceHandler = {
  init({ type }) {
    if (!window.performance) return;
    this.getPerformanceTiming({ type });
  },
  getPerformanceTiming({ type }) {
    const {
      performance,
      mozPerformance,
      msPerformance,
      webkitPerformance,
      location,
    } = window;
    const { protocol } = location;
    const { timing } = performance || mozPerformance || msPerformance || webkitPerformance;
    const {
      navigationStart,
      unloadEventStart,
      unloadEventEnd,
      redirectStart,
      redirectEnd,
      fetchStart,
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      secureConnectionStart,
      connectEnd,
      requestStart,
      responseStart,
      responseEnd,
      domLoading,
      domInteractive,
      domContentLoadedEventStart,
      domContentLoadedEventEnd,
      domComplete,
      loadEventStart,
      loadEventEnd,
    } = timing;

    const times = {
      key: 'performance',
      navigationStart: 0,
      redirectStart: redirectStart ? redirectStart - navigationStart : 0,
      unloadEventStart: unloadEventStart ? unloadEventStart - navigationStart : 0,
      unloadEventEnd: unloadEventEnd ? unloadEventEnd - navigationStart : 0,
      redirectEnd: redirectEnd ? redirectEnd - navigationStart : 0,
      fetchStart: fetchStart ? fetchStart - navigationStart : 0,
      domainLookupStart: domainLookupStart ? domainLookupStart - fetchStart : 0,
      domainLookupEnd: domainLookupEnd ? domainLookupEnd - fetchStart : 0,
      connectStart: connectStart ? connectStart - fetchStart : 0,
      secureConnectionStart: secureConnectionStart ? secureConnectionStart - fetchStart : 0,
      connectEnd: connectEnd ? connectEnd - fetchStart : 0,
      requestStart: requestStart ? requestStart - fetchStart : 0,
      responseStart: responseStart ? responseStart - fetchStart : 0,
      responseEnd: responseEnd ? responseEnd - fetchStart : 0,
      domLoading: domLoading ? domLoading - fetchStart : 0,
      domInteractive: domInteractive ? domInteractive - fetchStart : 0,
      domContentLoadedEventStart: domContentLoadedEventStart ? domContentLoadedEventStart - fetchStart : 0,
      domContentLoadedEventEnd: domContentLoadedEventEnd ? domContentLoadedEventEnd - fetchStart : 0,
      domComplete: domComplete ? domComplete - fetchStart : 0,
      loadEventStart: loadEventStart ? loadEventStart - fetchStart : 0,
      loadEventEnd: loadEventEnd ? loadEventEnd - fetchStart : 0,

      // 卸载前一个页面耗时
      unload: unloadEventEnd - unloadEventStart,

      // 重定向耗时
      //【原因】拒绝重定向 比如，http://example.com/ 就不该写成 http://example.com
      redirect: redirectEnd - redirectStart,

      // 新页面准备耗时
      ready: fetchStart - navigationStart,

      // DNS 读取缓存耗时
      cache: domainLookupStart - fetchStart,

      //【重要】DNS 查询耗时
      // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch]
      dns: domainLookupEnd - domainLookupStart,

      // TCP 连接耗时
      tcp: connectEnd - connectStart,

      // SSL 安全连接耗时
      ssl: protocol === 'https:' && secureConnectionStart ? connectEnd - secureConnectionStart : 0,

      // ttfb 首字节 即 Time To First Byte 网络请求耗时
      // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
      ttfb: responseStart - requestStart,

      // 数据传输耗时
      transmission: responseEnd - responseStart,

      // dom 解析耗时
      dom: domInteractive - responseEnd,

      // 资源加载耗时
      resource: loadEventStart - domContentLoadedEventEnd,

      // 首包时间
      firstbyte: responseStart - domainLookupStart,

      // First Paint Time 首次渲染时间/白屏时间
      fpt: responseEnd - fetchStart,

      // Time to Interact 首次可交互时间
      tti: domInteractive - fetchStart,

      //【重要】HTML 加载完成耗时， 即 DOM Ready 时间
      domready: domContentLoadedEventEnd ? domContentLoadedEventEnd - fetchStart : 0,

      //【重要】页面完全加载耗时
      load: loadEventStart ? loadEventStart - fetchStart : 0,

      // 加载类型
      type,

      // happen time
      ht: Date.now(),

      // page id
      pid: getCookie('pid'),

      // page href
      page: decodeURIComponent(window.location.href),

      // page title
      title: window.document.title,
    };

    DB.addLog(times);
  },
};

export default performanceHandler;
