/**
 * 录屏统计
 * @type {Object}
 */
import { record } from 'rrweb';
import DB from './lib/db';
import { getCookie } from './lib/utils';

const recordHandler = {
  init() {
    record({
      emit(e, isCheckout) {
        // isCheckout is a flag to tell you the events has been checkout
        // if (isCheckout) return;
        const recordInfo = {
          key: 'record',
          pid: getCookie('pid'),
          page: decodeURIComponent(window.location.href),
          title: window.document.title,
          event: JSON.stringify(e),
          ht: Date.now(),
        };
        DB.addLog(recordInfo);
      },
      checkoutEveryNms: 5 * 60 * 1000, // checkout every 5 minutes
    });
  },
};

export default recordHandler;
