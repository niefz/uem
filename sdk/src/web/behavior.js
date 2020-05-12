/**
 * 埋点统计
 * @type {Object}
 */
import { getXPath, getBoundingClientRect, sliceText, getCookie } from './lib/utils';
import DB from './lib/db';

const behaviorHandler = {
  init() {
    window.document.body.addEventListener('click', function(e) {
      const targetElement = e.target || e.srcElement;
      const nodeName = targetElement.nodeName && targetElement.nodeName.toLocaleLowerCase() || '';
      const text = targetElement.innerText || targetElement.value;
      const xpath = getXPath(targetElement) || '';
      const rect = getBoundingClientRect(targetElement);
      const documentElement = document.documentElement || document.body.parentNode;
      const scrollX = (documentElement && typeof documentElement.scrollLeft == 'number' ? documentElement : document.body).scrollLeft;
      const scrollY = (documentElement && typeof documentElement.scrollTop == 'number' ? documentElement : document.body).scrollTop;
      const pageX = e.pageX || e.clientX + scrollX;
      const pageY = e.pageY || e.clientY + scrollY;

      const behaviorInfo = {
        key: 'behavior',
        pid: getCookie('pid'),
        page: decodeURIComponent(window.location.href),
        title: window.document.title,
        text: sliceText(text),
        nodeName,
        xpath,
        offsetX: ((pageX - rect.left - scrollX) / rect.width).toFixed(6),
        offsetY: ((pageY - rect.top - scrollY) / rect.height).toFixed(6),
        pageX,
        pageY,
        scrollX,
        scrollY,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        ht: Date.now(),
      };

      DB.addLog(behaviorInfo);
    });
  },
};

export default behaviorHandler;
