/**
 * 单页面统计
 * @type {Object}
 */
// import 'custom-event-polyfill';
import DB from './lib/db';
import { setCookie, uuid } from './lib/utils';

const spaHandler = {
  init(options) {
    // history aop
    function aop(type) {
      const source = window.history[type];
      return function() {
        const event = new CustomEvent(type);
        event.arguments = arguments;
        window.dispatchEvent(event);
        return source.apply(this, arguments);
      };
    }

    window.history.pushState = aop('pushState');
    window.history.replaceState = aop('replaceState');

    window.addEventListener('hashchange', (event) => {
      this.handler(event, options);
    });
    window.addEventListener('pushState', (event) => {
      this.handler(event, options);
    }, true);
    window.addEventListener('replaceState', (event) => {
      this.handler(event, options);
    });
  },
  handler(event, options) {
    // replaceState
    if (event.type === 'replaceState') return;

    // mark page
    const pid = uuid();
    setCookie('pid', pid, window.location.hostname);

    setTimeout(() => {
      const spaInfo = {
        key: 'spa',
        pid,
        page: decodeURIComponent(window.location.href),
        title: event.target.document.title,
        ht: Date.now(),
      };
      DB.addLog(spaInfo);
    }, 100);
  },
};

export default spaHandler;
