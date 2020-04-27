/**
 * 特征统计
 * @type {Object}
 */
import * as platform from 'platform';
import { getCookie, setCookie, uuid, getNetworkType } from './lib/utils';
import DB from './lib/db';

const baseHandler = {
  init(opt) {

    // mark session
    if (!getCookie('x-session-id')) setCookie('x-session-id', uuid(), window.location.hostname);

    // mark page
    setCookie('pid', uuid(), window.location.hostname);

    const { product, name, version, os } = JSON.parse(JSON.stringify(platform));
    const { performance, navigator } = window;
    const { navigation } = performance;
    const { type, redirectCount } = navigation;
    const { userAgent, language, connection } = navigator;
    const { onchange, effectiveType, rtt, downlink, saveData } = connection;
    const { av = '' } = opt;

    const base = {
      key: 'base',

      // page
      page: window.location.href,

      // page title
      title: window.document.title,

      // page referrer
      referrer: window.document.referrer,

      // app version
      av,

      // sdk version
      sv: require('../../package').version,

      // environment
      env: {
        // device name
        deviceName: product || navigator.platform,

        // browser name
        bn: name,

        // browser version
        bv: version,

        // platform
        os: os,

        // userAgent
        ua: userAgent,

        // language
        language,
      },

      // network
      network: {
        // 有值代表网络状态变更
        onchange,

        // 网络类型
        effectiveType: getNetworkType() || effectiveType,

        // 估算的往返时间
        rtt,

        // 网络下行速度
        downlink,

        // 打开/请求数据保护模式
        saveData,
      },

      // navigation
      navigation: {
        // 加载来源
        // 0 通过点击链接、地址栏输入、表单提交、脚本操作等方式加载
        // 1 通过重新加载按钮或 location.reload() 方法加载
        // 2 通过前进或后退按钮加载
        // 255 其他来源加载
        type,

        // 重定向次数
        redirectCount,
      },

      // happen time
      ht: Date.now(),
    };

    DB.addLog(base);
  },
};

export default baseHandler;
