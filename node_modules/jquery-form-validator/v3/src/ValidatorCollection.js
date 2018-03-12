import ValidatorInvoker from './ValidatorInvoker';

class ValidatorCollection {

  constructor() {
    this.validators = {};
  }

  addValidator(validator, module) {
    if (!this.validators[validator.name]) {
      this.validators[validator.name] = [];
    }
    this.validators[validator.name].push({
      validatorInvoker: new ValidatorInvoker(validator),
      module:module
    });
  }

  /**
   * @param {String} validationRule
   * @return {ValidatorInvoker}
   */
  resolveValidator(validationRule) {
    const parts = validationRule.split('/'),
      rule = parts.length == 1 ? parts[0] : parts[1],
      module = parts.length == 1 ? false: parts[0];

    let resolvedValidator = null;
    if (rule in this.validators) {
      if (!module) {
        resolvedValidator = this.validators[rule][0].validatorInvoker;
      } else {
        this.validators[rule].every(obj => {
          if (obj.module == module) {
            resolvedValidator = obj.validatorInvoker
          } else {
            return true;
          }
        });
      }
    }
    return resolvedValidator;
  }

}

/**
 * @param {jQuery} $
 * @returns {ValidatorCollection}
 */
ValidatorCollection.loadViaJquery = ($) => {
  $.formUtils = $.formUtils || {};
  if (!$.formUtils.validatorCollection) {
    $.formUtils.validatorCollection = new ValidatorCollection();
  }
  return $.formUtils.validatorCollection;
};

export default ValidatorCollection;
