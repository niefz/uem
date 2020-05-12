/**
 * 特征统计
 * @type {Object}
 */
import * as platform from 'platform';
import { getCookie, setCookie, uuid, getNetworkType } from './lib/utils';
import report from './report';

const baseHandler = {
  init(opt) {
    // mark session
    const sid = uuid();
    if (!getCookie('x-session-id')) setCookie('x-session-id', sid, window.location.hostname);

    // mark page
    const pid = uuid();
    setCookie('pid', pid, window.location.hostname);

    const { product, name, version, os } = JSON.parse(JSON.stringify(platform));
    const { performance, navigator } = window;
    const { navigation } = performance;
    const { type, redirectCount } = navigation;
    const { userAgent, language, connection } = navigator;
    const { av = '' } = opt;
    const baseInfo = {
      key: 'base',

      // page id
      pid,

      // page
      page: decodeURIComponent(window.location.href),

      // page title
      title: window.document.title,

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
        onchange: connection ? connection.onchange : '',

        // 网络类型
        effectiveType: getNetworkType() || connection ? connection.effectiveType : '未知',

        // 估算的往返时间
        rtt: connection ? connection.rtt : 0,

        // 网络下行速度
        downlink: connection ? connection.downlink : 0,

        // 打开/请求数据保护模式
        saveData: connection ? connection.saveData : false,
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

    report.report(opt, { base: baseInfo }, 'enter');
  },
};

export default baseHandler;
