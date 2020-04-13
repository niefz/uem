/**
 * 异常统计
 * @type {Object}
 */
import { vueError } from './framework/vue';
import DB from './lib/db';
import { getCookie } from './lib/utils';

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
    window.onerror = function(message, source, lineno, colno, error) {
      setTimeout(() => {
        const errorInfo = {
          sid: getCookie('x-session-id'),
          uid: getCookie(opt.uid),
          key: 'error',
          page: window.location.href,
          message,
          lineno,
          colno,
          source,
          stack: error && error.stack ? error.stack : null,
          ht: Date.now(),
          type: 'javascript',
        };

        DB.addLog(errorInfo);
      }, 0);
    };

    /**
     * 资源加载错误
     */
    window.addEventListener('error', function(e) {
      if (e) {
        const targetElement = e.target || e.srcElement;

        if (targetElement === window) return;

        const { localName, src, href } = targetElement;
        const errorInfo = {
          sid: getCookie('x-session-id'),
          uid: getCookie(opt.uid),
          key: 'error',
          page: window.location.href,
          message: `${localName} load error`,
          source: src || href,
          ht: Date.now(),
          type: 'resource',
        };

        DB.addLog(errorInfo);
      }
    }, true);

    /**
     * Uncaught (in promise)
     */
    window.addEventListener('unhandledrejection', function(e) {
      if (e) {
        const { reason } = e;
        const { message, stack } = reason;

        const errorInfo = {
          sid: getCookie('x-session-id'),
          uid: getCookie(opt.uid),
          key: 'error',
          page: window.location.href,
          message,
          stack,
          ht: Date.now(),
          type: 'promise',
        };

        DB.addLog(errorInfo);
      }
    });

    // vue error
    vueError(opt);
  },
};

export default errorHandler;
