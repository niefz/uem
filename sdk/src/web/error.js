/**
 * 异常统计
 * @type {Object}
 */
import { vuePlugin } from './framework/vue';
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
      setTimeout(() => {
        const errorInfo = {
          key: 'error',
          type: 'javascript',
          page: window.location.href,
          title: window.document.title,
          message,
          lineno,
          colno,
          source,
          stack: error && error.stack ? error.stack : error,
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

      const { localName, src, href } = targetElement;
      const errorInfo = {
        key: 'error',
        type: 'resource',
        page: window.location.href,
        title: window.document.title,
        message: `${localName} is load error`,
        stack: 'resource is not found',
        source: src || href,
        lineno: 0,
        colno: 0,
        ht: Date.now(),
      };

      DB.addLog(errorInfo);

      this.report(opt);
    }, true);

    /**
     * Uncaught (in promise)
     */
    window.addEventListener('unhandledrejection', (e) => {
      const { reason, detail } = e;
      const errorInfo = {
        key: 'error',
        type: 'promise',
        page: window.location.href,
        title: window.document.title,
        message: reason ? reason : detail && detail.reason ? detail.reason : e,
        stack: 'promise is error',
        lineno: 0,
        colno: 0,
        ht: Date.now(),
      };

      DB.addLog(errorInfo);

      this.report(opt);
    });

    // vue error
    vuePlugin(this.report(opt));
  },
  report(opt) {
    report.reportLog(opt);
  },
};

export default errorHandler;
