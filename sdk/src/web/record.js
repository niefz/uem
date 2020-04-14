/**
 * 录屏统计
 * @type {Object}
 */
import { record } from 'rrweb';
import DB from './lib/db';

const recordHandler = {
  init() {
    record({
      emit(e, isCheckout) {
        // isCheckout is a flag to tell you the events has been checkout
        if (isCheckout) return;
        DB.addLog({
          key: 'record',
          page: window.location.href,
          title: window.document.title,
          event: e,
          ht: Date.now(),
        });
      },
      checkoutEveryNms: 5 * 60 * 1000, // checkout every 5 minutes
    });
  },
};

export default recordHandler;
