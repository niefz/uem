/**
 * console 统计
 * @type {Object}
 */
import DB from './lib/db';
import { getCookie } from './lib/utils';

const consoleHandler = {
  init() {
    if (!window.console) return;

    let level;
    const _console = window.console;

    for (let array = ['debug', 'info', 'warn', 'log', 'error', 'assert'], i = 0; i < array.length; i++) {
      level = array[i];
      if (typeof _console[level] === 'function') {
        window.console[level] = function() {
          const consoleInfo = {
            key: 'console',
            pid: getCookie('pid'),
            page: decodeURIComponent(window.location.href),
            title: window.document.title,
            level,
            message: [].slice.call(arguments),
            ht: Date.now(),
          };

          DB.addLog(consoleInfo);
        };
      }
    }
  },
};

export default consoleHandler;
