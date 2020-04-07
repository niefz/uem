/**
 * 录屏统计
 * @type {Object}
 */
import { record } from 'rrweb';
import DB from './lib/db';
import { getCookie } from './lib/utils';

const recordHandler = {
  init(opt) {
    record({
      emit(e, isCheckout) {
        // isCheckout is a flag to tell you the events has been checkout
        if (isCheckout) return;
        DB.addLog({
          sid: getCookie('x-session-id'),
          uid: getCookie(opt.uid),
          key: 'record',
          event: e,
          ht: Date.now(),
        });
      },
      checkoutEveryNms: 5 * 60 * 1000, // checkout every 5 minutes
    });
  },
};

export default recordHandler;
