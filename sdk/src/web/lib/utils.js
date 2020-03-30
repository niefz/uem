/**
 * 读取 cookie
 * @param name
 * @returns {*}
 */
export const getCookie = (name) => {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const cookie = document.cookie.match(reg);
  if (cookie) {
    return encodeURIComponent(cookie[2]);
  }
  return null;
};

/**
 * uuid
 */
export const uuid = () => {
  let timestamp = Date.now();
  if (window.performance && window.performance.now) timestamp += performance.now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (timestamp + Math.random() * 16) % 16 | 0;
    timestamp = Math.floor(timestamp / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

/**
 * 设置 cookie
 * @param name
 * @param value
 * @param domain
 * @param path
 */
export const setCookie = (name, value, domain, path = '/') => {
  document.cookie = `${name}=${value}; domain=${domain}; path=${path}`;
};

/**
 * dom 加载完毕
 * @param callback
 */
export const domReady = (callback) => {
  const { timing } = window.performance;
  let timer;
  let check = () => {
    if (timing.domInteractive) {
      timer = null;
      callback();
    } else {
      timer = setTimeout(check, 100);
    }
  };
  window.addEventListener('DOMContentLoaded', check, false);
};

/**
 * 页面完全加载
 * @param callback
 */
export const loaded = (callback) => {
  const { timing } = window.performance;
  let timer;
  let check = () => {
    if (timing.loadEventEnd) {
      timer = null;
      callback();
    } else {
      timer = setTimeout(check, 100);
    }
  };
  window.addEventListener('load', check, false);
};

/**
 * 参数格式化
 * @param data
 * @returns {string}
 */
export const formatter = (data) => {
  let arr = [];
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      arr.push(`${key}=${data[key]}`);
    }
  }
  return arr.join('&');
};

/**
 * 网络类型
 * @returns {string}
 */
export const getNetworkType = () => {
  let networkType;
  const ua = window.navigator.userAgent;
  if (/NetType/.test(ua)) {
    const network = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
    const networkStr = network.toLowerCase().replace('nettype/', '');
    switch (networkStr) {
      case 'wifi':
        networkType = 'wifi';
        break;
      case '4g':
        networkType = '4g';
        break;
      case '3g':
        networkType = '3g';
        break;
      case '3gnet':
        networkType = '3g';
        break;
      case '2g':
        networkType = '2g';
        break;
      default:
        networkType = 'other';
    }
  }
  return networkType;
};

const getLocalNamePath = (element) => {
  const xpath = [];
  let preCount = 0;
  let sib = element.previousSibling;

  while (sib) {
    sib.localName === element.localName && preCount++;
    sib = sib.previousSibling;
  }

  if (preCount === 0) {
    xpath.unshift(element.localName);
  } else {
    xpath.unshift(`${element.localName}:nth-of-type(${preCount + 1})`);
  }

  return xpath;
};

/**
 * xpath
 * @param element
 * @returns {any}
 */
export const getXPath = (element) => {
  try {
    const allNodes = document.getElementsByTagName('*');
    const xpath = [];
    for (; element && element.nodeType === 1; element = element.parentNode) {
      if (element.hasAttribute('id')) {
        let idCount = 0;
        for (let n = 0; n < allNodes.length; n++) {
          allNodes[n].hasAttribute('id') && allNodes[n].id === element.id && idCount++;
          if (idCount > 1) break;
        }
        if (idCount === 1) {
          xpath.unshift(`#${element.getAttribute('id')}`);
          break;
        } else {
          xpath.unshift(...getLocalNamePath(element));
        }
      } else {
        xpath.unshift(...getLocalNamePath(element));
      }
    }
    return xpath.length ? xpath.join('>') : null;
  } catch (err) {
    throw err;
  }
};

/**
 * BoundingClientRect
 * @param elm
 * @returns {{top: number, left: number, width: number, height: number}}
 */
export const getBoundingClientRect = (elm) => {
  const rect = elm.getBoundingClientRect();
  const width = rect.width || rect.right - rect.left;
  const height = rect.height || rect.bottom - rect.top;
  return {
    width,
    height,
    left: rect.left,
    top: rect.top,
  };
};

/**
 * 文本超长处理
 * @param text
 * @param limit
 * @returns {string}
 */
export const sliceText = (text = '', limit = 15) => {
  const len = text.length;
  if (len > limit * 2) {
    return `${text.substring(0, limit)}...${text.substring(len - limit, len)}`;
  }
  return text;
};
