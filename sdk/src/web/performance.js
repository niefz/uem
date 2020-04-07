/**
 * 性能统计
 * @type {Object}
 */
import DB from './lib/db';
import { getCookie } from './lib/utils';

const performanceHandler = {
  init({ type, uid }) {
    if (!window.performance) return;
    this.getPerformanceTiming({ type, uid });
  },
  getPerformanceTiming({ type, uid }) {
    const { performance, location } = window;
    const { timing } = performance;
    const { protocol } = location;
    const {
      // 同一个浏览器上下文的上一个文档卸载(unload)结束时的时间戳。
      // 如果没有上一个文档，这个值会和 fetchStart 相同。
      navigationStart,

      // 上一个页面 unload 事件抛出时的时间戳。
      // 如果没有上一个页面，这个值会返回0。
      unloadEventStart,

      // 和 unloadEventStart 相对应，unload 事件处理完成时的时间戳。
      // 如果没有上一个页面,这个值会返回0。
      unloadEventEnd,

      // 第一个 HTTP 重定向开始时的时间戳。
      // 如果没有重定向，或者重定向中的一个不同源，这个值会返回0.
      redirectStart,

      // 最后一个 HTTP 重定向完成时（也就是说是 HTTP 响应的最后一个比特值接被收到的时间）的时间戳。
      // 如果没有重定向，或者重定向中的一个不同源，这个值会返回0.
      redirectEnd,

      // 浏览器准备好使用 HTTP 请求来获取(fetch)文档的时间戳。
      // 这个时间点会在检查任何应用缓存之前。
      fetchStart,

      // DNS 域名查询开始的时间戳。
      // 如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和 fetchStart 一致。
      domainLookupStart,

      // DNS 域名查询结束的时间戳.
      // 如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和 fetchStart 一致。
      domainLookupEnd,

      // HTTP（TCP） 域名查询结束的时间戳。
      // 如果使用了持续连接(persistent connection)，则返回值等同于 fetchStart 属性的值。
      connectStart,

      // HTTP（TCP） 返回浏览器与服务器之间的连接建立时的时间戳。
      // 如果建立的是持久连接，则返回值等同于 fetchStart 属性的值。
      // 连接建立指的是所有握手和认证过程全部结束。
      connectEnd,

      // HTTPS 返回浏览器与服务器开始安全链接的握手时的时间戳。
      // 如果当前网页不要求安全连接，则返回0。
      secureConnectionStart,

      // 返回浏览器向服务器发出 HTTP 请求时（或开始读取本地缓存时）的时间戳。
      requestStart,

      // 返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）第一个字节时的时间戳。
      // 如果传输层在开始请求之后失败并且连接被重开，该属性将会被数制成新的请求的相对应的发起时间。
      responseStart,

      // 返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的时间戳。
      responseEnd,

      // 返回当前网页 DOM 结构开始解析时（即 Document.readyState 变为 'loading' 且相对应的 readystatechange 事件触发时）的时间戳。
      domLoading,

      // 返回当前网页 DOM 结构结束解析，开始加载内嵌资源时（即 Document.readyState 变为 'interactive' 且相对应的 readystatechange 事件触发时）的时间戳。
      domInteractive,

      // 返回当解析器发送 DOMContentLoaded 事件，即所有需要被执行的脚本已经被解析时的时间戳。
      domContentLoadedEventStart,

      // 返回当所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间戳。
      domContentLoadedEventEnd,

      // 返回当前文档解析完成，即 Document.readyState 变为 'complete' 且相对应的 readystatechange 被触发时的时间戳。
      domComplete,

      // 返回该文档下 load 事件被发送时的时间戳。
      // 如果这个事件还未被发送，它的值将会是0。
      loadEventStart,

      // 返回当 load 事件结束，即加载事件完成时的时间戳。
      // 如果这个事件还未被发送，或者尚未完成，它的值将会是0.
      loadEventEnd,
    } = timing;

    const times = {
      sid: getCookie('x-session-id'),

      uid: getCookie(uid),

      key: 'performance',

      navigationStart,

      unloadEventStart,

      unloadEventEnd,

      redirectStart,

      redirectEnd,

      fetchStart,

      domainLookupStart,

      domainLookupEnd,

      connectStart,

      connectEnd,

      secureConnectionStart,

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

      // 卸载前一个页面耗时
      unload: unloadEventEnd - unloadEventStart || 0,

      // 重定向耗时
      //【原因】拒绝重定向 比如，http://example.com/ 就不该写成 http://example.com
      redirect: redirectEnd - redirectStart || 0,

      // 新页面准备耗时
      ready: fetchStart - navigationStart || 0,

      // DNS 读取缓存耗时
      cache: domainLookupStart - fetchStart || 0,

      //【重要】DNS 查询耗时
      // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch]
      dns: domainLookupEnd - domainLookupStart || 0,

      // TCP 连接耗时
      tcp: connectEnd - connectStart || 0,

      // SSL 安全连接耗时
      ssl: protocol === 'https:' ? connectEnd - secureConnectionStart : 0,

      // ttfb 即 Time To First Byte 网络请求耗时
      // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
      ttfb: responseStart - navigationStart || 0,

      // 数据传输耗时
      transmission: responseEnd - responseStart || 0,

      // dom 解析耗时
      dom: domInteractive - responseEnd || 0,

      // 资源加载耗时
      resource: loadEventStart - domContentLoadedEventEnd || 0,

      // 首包时间
      firstbyte: responseStart - domainLookupStart || 0,

      // First Paint Time 首次渲染时间/白屏时间
      fpt: responseEnd - fetchStart || 0,

      // Time to Interact 首次可交互时间
      tti: domInteractive - fetchStart || 0,

      //【重要】HTML 加载完成耗时， 即 DOM Ready 时间
      domready: domComplete - responseEnd || 0,

      //【重要】页面完全加载耗时
      load: loadEventEnd - navigationStart || 0,

      // 加载类型
      type,

      // happen time
      ht: Date.now(),
    };

    DB.addLog(times);
  },
};

export default performanceHandler;
