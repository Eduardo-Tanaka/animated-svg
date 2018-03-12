import FormValidatorEvents from './FormValidatorEvents';
import ModuleManager from './ModuleManager';
import FormValidatorOptions from './FormValidatorOptions';
import ValidatorCollection from './ValidatorCollection';

(function($, window) {

  const moduleManager = ModuleManager.loadViaJquery($, window);

  /**
   * @param {Object} [overridingOptions]
   */
  $.validate = function(overridingOptions) {
    const options = new FormValidatorOptions(overridingOptions),
      $forms = $(options.form);
    moduleManager.loadModules(options.modules, options.modulePath || resolveModuleBaseDirUrl())
      .then(() => {
        if (typeof options.onModulesLoaded == 'function') {
          options.onModulesLoaded();
        }
        setupFormSubmitValidation($forms, options);
        setupIndividualInputValidation($forms, options);
      })
      .catch(err => {
        throw err;
      });
  };

  /**
   * @param {jQuery} $forms
   * @param {FormValidatorOptions} options
   */
  const setupFormSubmitValidation = ($forms, options) => {
    $forms.each(() => {
      const $form = $(this);
      options.attach($form);
      $form
        .trigger(FormValidatorEvents.formValidationSetup, [options])
        .off('submit.validate')
        .on('submit.validate', formValidationSubmitHandler);
    });
  };

  /**
   * @param {jQuery} $forms
   * @param {FormValidatorOptions} options
   */
  const setupIndividualInputValidation = ($forms, options) => {
    let $inputs;
    if (options.validationEvent) {
      $inputs = $forms.find('[data-validation]');
    } else {
      $inputs = $forms.find('[data-validation][data-validation-event]');
    }
    $inputs.each(() => {
      const $input = (this),
        event = $input.valAttr('event') || options.validationEvent;
      $input
        .off(event + '.validate')
        .on(event + '.validate', inputValidationHandler);
    })
  };

  /**
   * @returns {boolean}
   */
  const formValidationSubmitHandler = () => {
    const $form = $(this),
      options = FormValidatorOptions.newOptionsFromForm($form);

    $form.validate((isValid) => {
      if (isValid) {
        if (typeof options.onSuccess === 'function') {
          options.onSuccess($form);
        }
        this.submit();
      } else {
        if (typeof options.onError === 'function') {
          options.onError($form);
        }
      }
    }, {}, true);
    return false;
  };

  const inputValidationHandler = () => {
    $(this).validate()
  };

  /**
   * @returns {string}
   */
  const resolveModuleBaseDirUrl = () => {
    let moduleBaseDirUrl = '';
    $('script[src*="form-validator"]').each(() => {
      var isScriptFromPluginNodeModulesDirectory = this.src.split('form-validator')[1].split('node_modules').length > 1;
      if (!isScriptFromPluginNodeModulesDirectory) {
        moduleBaseDirUrl = this.src.substr(0, this.src.lastIndexOf('/')) + '/';
        if (moduleBaseDirUrl === '/') {
          moduleBaseDirUrl = '';
        }
        return false;
      }
    });
    if (!moduleBaseDirUrl) {
      throw new Error('Unable to resolve url of validator modules');
    }
    return moduleBaseDirUrl;
  };

})(jQuery, window);
