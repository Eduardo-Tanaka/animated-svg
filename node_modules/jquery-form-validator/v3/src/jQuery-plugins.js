import ModuleManager from './ModuleManager';
import FormValidatorEvents from './FormValidatorEvents';
import FormValidator from './FormValidator';
import FormValidatorOptions from './FormValidatorOptions';

(function($, window, undefined) {

  const $window = $(window),
    moduleManager = ModuleManager.loadViaJquery($, window);

  /**
   * Short hand for fetching/adding/removing element attributes
   * prefixed with 'data-validation-'
   *
   * @param {String} name
   * @param {String|Boolean} [val]
   * @return {String|undefined|jQuery}
   * @protected
   */
  $.fn.valAttr = function (name, val) {
    if (val === undefined) {
      return this.attr('data-validation-' + name);
    } else if (val === false || val === null) {
      return this.removeAttr('data-validation-' + name);
    } else {
      return this.attr('data-validation' + (name ? '-' + name : ''), val);
    }
  };

  /**
   * Alternative method to $.fn.val that also support radio buttons
   * @returns {*|string}
   */
  $.fn.getInputValue = function() {
    const type = this.attr('type');
    if (type === 'radio' || type === 'checkbox') {
      let $form = this.closest('form');
      if (!$form.length) {
        $form = $('body');
      }
      return $form.find('input[name="'+this.attr('name')+'"]').filter(':checked').val() || '';
    } else {
      return this.val() || '';
    }
  };

  /**
   * @param {Function} callback
   * @param {Object} [overridingOptions]
   * @param {Boolean} [displayErrors]
   */
  $.fn.validate = function(callback, overridingOptions, displayErrors) {
    if (moduleManager.isLoading()) {
      $window.one(FormValidatorEvents.validatorsLoaded, () => {
        this.validate(callback, overridingOptions, displayErrors);
      });
    } else {
      const formElements = ['input', 'textarea', 'select'];
      if (formElements.indexOf(this.get(0).nodeName.toLowerCase()) > -1) {
        validateElement(this, callback, overridingOptions, displayErrors);
      } else {
        validateForm(this, callback, overridingOptions, displayErrors);
      }
    }
    return this;
  };

  /**
   * @param {jQuery} $form
   * @param {Function} callback
   * @param {Object} [overridingOptions]
   * @param {Boolean} [displayErrors]
   */
  const validateForm = ($form, callback, overridingOptions, displayErrors) => {
    const options = FormValidatorOptions.newOptionsFromForm($form);
    options.override(overridingOptions);
    new FormValidator($form, options).validateAll(results => {
      handleValidationResult(results, callback, options, displayErrors);
    });
  };

  /**
   * @param {jQuery} $elem
   * @param {Function} callback
   * @param {FormValidatorOptions} overridingOptions
   * @param {Boolean} displayErrors
   */
  const validateElement = ($elem, callback, overridingOptions, displayErrors) => {
    let $form = $elem.closest('form'),
      options;
    if (!$form.length) {
      $form = $elem.parent().parent();
      options = new FormValidatorOptions(overridingOptions);
    } else {
      options = FormValidatorOptions.newOptionsFromForm($form);
      options.override(overridingOptions);
    }
    new FormValidator($form, options).validate($elem, results => {
      handleValidationResult(results, callback, options, displayErrors);
    });
  };

  /**
   * @param {Object} results
   * @param {Function} callback
   * @param {FormValidatorOptions} options
   * @param {Boolean} displayErrors
   */
  const handleValidationResult = (results, callback, options, displayErrors) => {
    if (options.addValidClassOnAll && displayErrors) {
      results.ignored.forEach(result => {
        result.input.display('valid');
      });
    }
    if (displayErrors) {
      results.valid.forEach(input => {
        input.display('valid');
      });
      results.invalid.forEach(input => {
        input.display('invalid', result.errorMessage);
      });
    }
    callback(results.invalid.length === 0);
  };

})(jQuery, window);
