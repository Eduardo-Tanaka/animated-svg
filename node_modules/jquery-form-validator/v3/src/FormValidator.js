import ShouldValidateInputRule from './ShouldValidateInputRule';

class FormValidator {

  /**
   * @param {jQuery} $form
   * @param {FormValidatorOptions} options
   */
  constructor($form, options) {
    this.$form = $form;
    this.options = options;
    this.shouldValidateInputRule = new ShouldValidateInputRule(this.options);
  }

  validateAll(callback) {
    const $inputs = this.$form.find('input,textarea,select')
        .filter(':not([type="submit"],[type="button"])');
    this.validate($inputs, callback);
  }

  validate($inputs, callback) {
    const validatedRadioButtons = [],
      validationResults = {
        ignored: [],
        valid: [],
        invalid: []
      },
      validationPromises = [invokeCustomValidationCallback(this.$form, this.options)];
    $inputs.each((i, $input) => {
      if (this.shouldValidateInput($input, validatedRadioButtons)) {
        const input = new Input($input);
        validationPromises.push(input.validate());
      } else {
        validationResults.ignored.push($input);
      }
    });
    Promise.all(validationPromises, allResults => {
      allResults.forEach(result => {
        if (result) {
          if (result.ignored) {
            validationResults.ignored.push(result);
          } else if (result.valid) {
            validationResults.valid.push(result);
          } else if (result.invalid) {
            validationResults.invalid.push(result);
          }
        }
      });
      callback(validationResults);
    });
  }

  shouldValidateInput($input, validatedRadioButtons) {
    if (this.shouldValidateInputRule.isSatisfiedBy($input)) {
      const isRadioButton = ['radio', 'checkbox'].indexOf($input.attr('type')) > -1,
        hasValidatedThisRadioButton = validatedRadioButtons.indexOf($input.attr('name')) > -1;

      if (!isRadioButton || !hasValidatedThisRadioButton) {
        if (isRadioButton) {
          validatedRadioButtons.push($input.attr('name'));
        }
        return true;
      }
    }
    return false;
  }
}

/**
 * @param {jQuery} $form
 * @param {FormValidatorOptions} options
 */
const invokeCustomValidationCallback = ($form, options) => {
  return new Promise((resolve, reject) => {
    if (typeof options.onValidate === 'function') {
      const customValidationResult = options.onValidate($form);
      if (customValidationResult) {
        resolve(new ValidationResult(
          false,
          customValidationResult.$element,
          customValidationResult.message
        ));
      } else {
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });
};

export default FormValidator;
