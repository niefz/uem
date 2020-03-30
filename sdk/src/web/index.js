import { domReady, loaded } from './lib/utils';
import baseHandler from './base';
import performanceHandler from './performance';
import resourceHandler from './resource';
import errorHandler from './error';
import apiHandler from './api';
import spaHandler from './spa';
import behaviorHandler from './behavior';
import consoleHandler from './console';
import recordHandler from './record';
import report from './report';

const { config } = window.Performance || {};

const options = Object.assign({
  // 上报地址
  url: 'https://uem.midea.com/r.png',

  // 是否上报页面性能
  enableSpeed: true,

  // 是否上报页面资源
  enableResource: true,

  // 是否上报错误信息
  enableError: true,

  // 是否上报接口性能
  enableHook: true,

  // 是否上报单页面
  enableSPA: true,

  // 是否埋点
  enableBehavior: true,

  // 是否追踪 console 内容，包括 error, warn, log, info, debug, assert
  enableConsole: false,

  // 是否录屏
  enableRecord: true,

  // 是否关联应用监控
  enableTrace: false,

  // 是否自动上报
  autoReport: true,
}, config);

// 初始化
baseHandler.init(options);

// dom ready
domReady(() => {
  // 页面性能
  if (options.enableSpeed) performanceHandler.init({ type: 'domready' });

  // 埋点
  if (options.enableBehavior) behaviorHandler.init();
});

// page load
loaded(() => {
  // 性能
  if (options.enableSpeed) performanceHandler.init({ type: 'loaded' });

  // 资源
  if (options.enableResource) resourceHandler.init();
});

// 异常错误
if (options.enableError) errorHandler.init();

// 接口
if (options.enableHook) apiHandler.init(options);

// 单页面
if (options.enableSPA) spaHandler.init();

// 追踪 console 内容，包括 error, warn, log, info, debug, assert
if (options.enableConsole) consoleHandler.init();

// 录屏
if (options.enableRecord) recordHandler.init();

// 日志上报
if (options.autoReport) report.init({ url: options.url });
