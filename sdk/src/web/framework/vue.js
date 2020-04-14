/**
 * Vue.js 2.0 framework
 */
import DB from '../lib/db';

function formatComponentName(vm) {
  if (vm.$root === vm) return 'root instance';
  const name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '')
  );
}

export function vueError(cb, Vue) {
  Vue = Vue || window.Vue;

  // quit if Vue isn't on the page
  if (!Vue || !Vue.config) return;

  const _oldOnError = Vue.config.errorHandler;

  Vue.config.errorHandler = function VueErrorHandler(error, vm, info) {
    const {
      message, // 异常信息
      script, // 异常脚本 url
      line, // 异常行号
      column, // 异常列号
      stack // 异常堆栈信息
    } = error;
    const metaData = {};

    // vm and lifecycleHook are not always available
    if (Object.prototype.toString.call(vm) === '[object Object]') {
      metaData.componentName = formatComponentName(vm);
      metaData.propsData = vm.$options.propsData;
    }

    if (typeof info !== 'undefined') {
      metaData.lifecycleHook = info;
    }

    const errorInfo = {
      key: 'error',
      type: 'vue',
      page: window.location.href,
      title: window.document.title,
      message,
      lineno: line,
      colno: column,
      source: script,
      stack,
      ht: Date.now(),
      extra: metaData,
    };

    DB.addLog(errorInfo);

    cb();

    if (typeof _oldOnError === 'function') {
      _oldOnError.call(this, error, vm, info);
    }
  };
}
