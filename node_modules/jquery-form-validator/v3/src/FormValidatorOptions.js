
class FormValidatorOptions {

  /**
   * @param {Object} [overridingOptions]
   */
  constructor(overridingOptions) {
    this.form = 'form';
    this.ignore = [];
    this.modules = '';
    this.onModulesLoaded = null;
    this.onSuccess = false;
    this.onError = false;
    this.modulePath = null;
    this.onValidate = null;
    this.validateHiddenInputs = false;
    this.validationEvent = 'blur';

    //this.validateOnEvent = 'blur';
    //this.validateOnBlur = true;
    this.addValidClassOnAll = false;
    this.onElementValidate = false;
    this.validateCheckboxRadioOnClick = true;
    this.showHelpOnFocus = true;
    this.addSuggestions = true;
    this.language = false;

    this.override(overridingOptions);
  }

  override(overridingOptions) {
    const classFunctions = ['attach', 'applyOptionsAttachedToForm', 'constructor'];
    for (const key in (overridingOptions || {})) {
      if (classFunctions.indexOf(key) == -1) {
        this[key] = overridingOptions[key];
      }
    }
  }

  /**
   * @param {jQuery} $form
   */
  attach($form) {
    $form.get(0).jQueryFormValidatorOptions = this;
  }

  /**
   * @param {jQuery} $form
   */
  applyOptionsAttachedToForm($form) {
    this.override($form.get(0).jQueryFormValidatorOptions);
  }
}

/**
 * @param {jQuery} $form
 * @returns {FormValidatorOptions}
 */
FormValidatorOptions.newOptionsFromForm = ($form) => {
  const options = new FormValidatorOptions();
  options.applyOptionsAttachedToForm($form);
  return options;
};

export default FormValidatorOptions;
