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
    const { performance, location } = window;
    const { protocol } = location;
    const [PerformanceNavigationTiming] = performance.getEntriesByType('navigation');
    const {
      startTime,
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
      domInteractive,
      domContentLoadedEventStart,
      domContentLoadedEventEnd,
      domComplete,
      loadEventStart,
      loadEventEnd,
    } = PerformanceNavigationTiming;

    const times = {
      key: 'performance',
      navigationStart: startTime,
      redirectStart,
      unloadEventStart,
      unloadEventEnd,
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
      domInteractive,
      domContentLoadedEventStart,
      domContentLoadedEventEnd,
      domComplete,
      loadEventStart,
      loadEventEnd,

      // 卸载前一个页面耗时
      unload: unloadEventEnd - unloadEventStart,

      // 重定向耗时
      //【原因】拒绝重定向 比如，http://example.com/ 就不该写成 http://example.com
      redirect: redirectEnd - redirectStart,

      // 新页面准备耗时
      ready: fetchStart,

      // DNS 读取缓存耗时
      cache: domainLookupStart,

      //【重要】DNS 查询耗时
      // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch]
      dns: domainLookupEnd - domainLookupStart,

      // TCP 连接耗时
      tcp: connectEnd - connectStart,

      // SSL 安全连接耗时
      ssl: protocol === 'https:' ? connectEnd - secureConnectionStart : 0,

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
      domready: domContentLoadedEventEnd - fetchStart,

      //【重要】页面完全加载耗时
      load: loadEventStart - fetchStart,

      // 加载类型
      type,

      // happen time
      ht: Date.now(),

      // page id
      pid: getCookie('pid'),

      // page href
      page: window.location.href,

      // page title
      title: window.document.title,
    };

    DB.addLog(times);
  },
};

export default performanceHandler;
