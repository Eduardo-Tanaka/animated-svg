import utils from './utils';
import ModuleReference from './ModuleReference';
import FormValidatorEvents from './FormValidatorEvents';

export default class ModuleManager {

  /**
   * @param {jQuery} $eventEmitter - Should only be used as an event emitter
   * @param {Function} [moduleLoader]
   */
  constructor($eventEmitter, moduleLoader) {
    this.$eventEmitter = $eventEmitter;
    this.loading = false;
    this.loadedModules = [];
    this.loadModuleFunc = moduleLoader || defaultModuleLoadingFuncUsingScriptTag;
  }

  /**
   * @param {ModuleReference} moduleReference
   * @returns {Promise}
   */
  loadModule(moduleReference) {
    return new Promise((resolve, reject) => {
      if (this.hasLoaded(moduleReference)) {
        resolve();
      } else {
        this.loadModuleFunc(moduleReference, resolve);
      }
    });
  }

  /**
   * @param {String} moduleName
   */
  registerLoadedModule(moduleName) {
    this.loadedModules.push(new ModuleReference(moduleName).getName());
  }

  /**
   * @param {ModuleReference} moduleReference
   * @returns {boolean}
   */
  hasLoaded(moduleReference) {
    return this.loadedModules.indexOf(moduleReference.getName()) > -1;
  }

  /**
   * @returns {boolean}
   */
  isLoading() {
    return this.loading;
  }

  /**
   * @param {String} moduleDeclarations
   * @param {String} moduleDirBaseUrl
   * @returns {Promise}
   */
  loadModules(moduleDeclarations, moduleDirBaseUrl) {
    if (this.isLoading()) {
      return this.loadedModules(moduleDeclarations, moduleDirBaseUrl);
    } else {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const modulePromises = [];
        utils.split(moduleDeclarations).forEach(moduleName => {
          modulePromises.push(this.loadModule(new ModuleReference(moduleName, moduleDirBaseUrl)))
        });
        Promise.all(modulePromises).then(() => {
          this.loading = false;
          this.$eventEmitter.trigger(FormValidatorEvents.validatorsLoaded);
          resolve();
        }).catch(reject);
      });
    }
  }
}

/**
 * @param {jQuery} $
 * @param {Window} window
 * @returns {ModuleManager}
 */
ModuleManager.loadViaJquery = ($, window) => {
  $.formUtils = $.formUtils || {};
  if (!$.formUtils.moduleManager) {
    $.formUtils.moduleManager = new ModuleManager($(window));
  }
  return $.formUtils.moduleManager;
};

/**
 * @param {ModuleReference} moduleReference
 * @param {Function} callback
 */
const defaultModuleLoadingFuncUsingScriptTag = (moduleReference, callback) => {
  const scriptElement = document.createElement('SCRIPT'),
    rootHtmlElement = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];

  if (typeof define === 'function' && define.amd) {
    // @todo Determine whether or not "define" should be sniffed out or be a configuration option
    require(moduleReference.getRelativeUrl(), callback);
  } else {
    // Load the script
    scriptElement.type = 'text/javascript';
    scriptElement.onload = callback;
    scriptElement.src = moduleReference.getAbsoluteUrl();
    scriptElement.onerror = function() {
      utils.warn('Unable to load form validation module '+scriptUrl, true);
      callback();
    };
    scriptElement.onreadystatechange = function () {
      // IE 7 fix
      if (this.readyState === 'complete' || this.readyState === 'loaded') {
        callback();
        // Handle memory leak in IE
        this.onload = null;
        this.onreadystatechange = null;
      }
    };
    rootHtmlElement.appendChild(scriptElement);
  }
};
