import utils from './utils';
import FormValidatorEvents from './FormValidatorEvents';

class InputValidator {

  /**
   * @param {ValidatorCollection} validatorCollection
   * @param {FormValidatorOptions} options
   * @param {FormValidatorDialogs} dialogs,
   * @param {jQuery} $form
   */
  constructor(validatorCollection, options, dialogs, $form) {
    this.validatorCollection = validatorCollection;
    this.options = options;
    this.$form = $form;
    this.dialogs = dialogs;
  }

  /**
   * @param {jQuery} $input
   * @param {String} eventContext
   * @returns {Promise}
   */
  validate($input, eventContext) {
    return new Promise((resolve, reject) => {
      try {
        this._doValidate($input, eventContext, resolve);
      } catch (err) {
        reject(err);
      }
    });
  }

  _doValidate($input, eventContext, resolve) {
    let hasFailedValidation = false,
      hasSuccessfulValidation = false,
      errorMessage = '';

    const validationRules = utils.split($input.attr('data-validation'));
    if (validationRules.length && !this._skipValidation($input)) {
      this._invokeValidators($input, eventContext, () => {
        if (!hasFailedValidation) {
          return validationRules.length ? validationRules.splice(0, 1)[0] : null;
        }
      }, result => {
        if (result.invalid) {
          hasFailedValidation = true;
          errorMessage = result.errorMessage;
        } else if (result.success) {
          hasSuccessfulValidation = true;
        }
      });
    }

    if (hasSuccessfulValidation) {
      this._triggerAfterValidationCallbacks($input, true);
      resolve({success: true});
    } else if (hasFailedValidation) {
      this._triggerAfterValidationCallbacks($input, false, errorMessage);
      resolve({failed: true, message: errorMessage});
    } else {
      resolve({ignored: true});
    }
  }

  /**
   * Makes it possible to skip the validation using code, outside of this plugin
   * @param $input
   * @returns {Boolean}
   * @private
   */
  _skipValidation($input) {
    $input
      .valAttr('skipped', false)
      .trigger(
        FormValidatorEvents.onBeforeValidation,
        [$input.getInputValue(), this.dialogs, this.options]
      );
    return $input.valAttr('skipped') ? true:false;
  }

  /**
   * @param {jQuery} $input
   * @param {Boolean} isValid
   * @param {String} [errorMessage]
   * @private
   */
  _triggerAfterValidationCallbacks($input, isValid, errorMessage) {
    $input.trigger(FormValidatorEvents.onValidation, [isValid]);
    if (typeof this.options.onElementValidate === 'function') {
      this.options.onElementValidate(isValid, $input, this.$form, errorMessage);
    }
  }

  /**
   * @param {jQuery} $input
   * @param {String} eventContext
   * @param {Function} popFromQueueCallback
   * @param {Function} finishedValidationCallback
   * @private
   */
  _invokeValidators($input, eventContext, popFromQueueCallback, finishedValidationCallback) {
    const validationRule = popFromQueueCallback();
    if (validationRule) {
      const validatorInvoker = this.validatorCollection.resolveValidator(validationRule);
      if (!validatorInvoker) {
        utils.warn(`Unknown validator ${validationRule}...`);
        finishedValidationCallback({ignored: true});
      } else {
        validatorInvoker.validate(
          (result) => {
            finishedValidationCallback(result);
            this._invokeValidators($input, eventContext, popFromQueueCallback, finishedValidationCallback);
          },
          $input.getInputValue(),
          $input,
          this.dialogs,
          this.options,
          this.$form,
          eventContext
        );
      }
    }
  }
}

export default InputValidator;
