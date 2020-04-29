/**
 * Vue.js 2.0 framework
 */
import DB from '../lib/db';
import report from '../report';

function formatComponentName(vm) {
  if (vm.$root === vm) return 'root instance';
  const name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '')
  );
}

export function vuePlugin(Vue) {
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

    const [lineno = 0, colno = 0] = stack
      .replace(`${name}: ${message}`, '')
      .split('\n') // 以换行分割信息
      .map((v) => v
        .replace(/^\s*|\s*$/g, '')
        .replace(/\w.+[js&|]:|\)$/g, '')
        .split(':')
      )[1];

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
      page: window.location.href,
      title: window.document.title,
      message: `${name}: ${message}`,
      lineno,
      colno,
      source: vm.$options ? vm.$options.__file : '',
      stack,
      ht: Date.now(),
      extra: metaData,
    };

    DB.addLog(errorInfo);

    report.reportLog(this.config);

    if (typeof _oldOnError === 'function') {
      _oldOnError.call(this, error, vm, info);
    }
  };
}
