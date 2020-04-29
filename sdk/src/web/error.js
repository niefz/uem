/**
 * 异常统计
 * @type {Object}
 */
import DB from './lib/db';
import report from './report';

export const errorHandler = {
  init(opt) {
    /**
     * JS 错误
     * @param {string} message 错误信息
     * @param {string} source 发生错误的脚本URL
     * @param {number} lineno 发生错误的行号
     * @param {number} colno 发生错误的列号
     * @param {object} error Error 对象
     */
    window.onerror = (message, source, lineno, colno, error) => {
      if (message === 'Script error.' || !source) return;
      setTimeout(() => {
        lineno = lineno || (window.event && window.event.errorCharacter) || 0;
        const errorInfo = {
          key: 'error',
          type: 'javascript',
          page: window.location.href,
          title: window.document.title,
          message,
          lineno,
          colno,
          source,
          stack: error && error.stack ? error.stack.toString() : error,
          ht: Date.now(),
        };
        DB.addLog(errorInfo);
        this.report(opt);
      }, 0);
    };

    /**
     * 资源加载错误
     */
    window.addEventListener('error', (e) => {
      const { target, srcElement } = e;
      const targetElement = target || srcElement;
      if (targetElement === window) return;
      const { src, href } = targetElement;
      const errorInfo = {
        key: 'error',
        type: 'resource',
        page: window.location.href,
        title: window.document.title,
        message: e.message,
        lineno: e.lineno,
        colno: e.colno,
        source: src || href,
        stack: e.error.stack.toString(),
        ht: Date.now(),
      };
      DB.addLog(errorInfo);
      this.report(opt);
    }, true);

    /**
     * Uncaught (in promise)
     */
    window.addEventListener('unhandledrejection', (e) => {
      const errorInfo = {
        key: 'error',
        type: 'promise',
        page: window.location.href,
        title: window.document.title,
        message: e.reason.message,
        lineno: 0,
        colno: 0,
        source: e.reason.config ? e.reason.config.url : '',
        stack: e.reason.stack.toString(),
        ht: Date.now(),
      };
      DB.addLog(errorInfo);
      this.report(opt);
    });

    // Script error
    const originAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      const wrappedListener = function(...args) {
        try {
          return listener.apply(this, args);
        } catch (err) {
          const errorInfo = {
            key: 'error',
            type: 'javascript',
            page: window.location.href,
            title: window.document.title,
            message: err.message,
            lineno: 0,
            colno: 0,
            source: '',
            stack: err.stack.toString(),
            ht: Date.now(),
          };
          DB.addLog(errorInfo);
          this.report(opt);
          throw err;
        }
      };
      return originAddEventListener.call(this, type, wrappedListener, options);
    };
  },
  report(opt) {
    report.reportLog(opt);
  },
};

export default errorHandler;
