export default class ValidatorInvoker {

  constructor(validator) {
    this.validator = validator;
  }

  validate(callback, value, $input, lang, options, $form, eventContext) {
    this.validator.validatorFunction((success) => {
      if (success === true) {
        callback({success: true});
      } else if (success === false) {
        callback({invalid: true, errorMessage: 'lorem....'});
      } else {
        callback({ignored: true});
      }
    }, value, $input, lang, options, $form, eventContext);
  }
}
