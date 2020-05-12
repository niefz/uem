/**
 * Vue.js 2.0 framework
 */
import DB from '../lib/db';
import { getCookie } from '../lib/utils';

function formatComponentName(vm) {
  if (vm.$root === vm) return 'root instance';
  const name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '')
  );
}

function vuePlugin(Vue) {
  Vue = Vue || window.Vue;

  // quit if Vue isn't on the page
  if (!Vue || !Vue.config) return;

  const _oldOnError = Vue.config.errorHandler;

  Vue.config.errorHandler = (error, vm, info) => {
    const {
      message, // 异常信息
      name, // 异常名称
      stack // 异常堆栈信息
    } = error;
    const metaData = {};

    const [source] = stack
      .replace(`${name}: ${message}`, '')
      .replace(/^\s*|\s*$/g, '')
      .split('\n') // 以换行分割信息
      .map((v) => v
        .replace(/^\s*|\s*$/g, '')
        .replace(/\w.+[(]|[)]$/g, '')
      );

    const [number] = source
      .match(/(\d+)(?::(\d+))?\s*$/i);

    const [lineno = 0, colno = 0] = number
      .split(':');

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
      type: 'javascript',
      pid: getCookie('pid'),
      page: decodeURIComponent(window.location.href),
      title: window.document.title,
      message: `${name}: ${message}`,
      lineno,
      colno,
      source,
      stack: stack.toString(),
      ht: Date.now(),
      extra: metaData,
    };

    DB.addLog(errorInfo);

    if (typeof _oldOnError === 'function') {
      _oldOnError.call(this, error, vm, info);
    }
  };
}

window.vuePlugin = vuePlugin;
