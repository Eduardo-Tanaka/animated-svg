
export default class ShouldValidateInputRule {

  /**
   * @param {FormValidatorOptions} options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @param {jQuery} $input
   * @returns {Boolean}
   */
  isSatisfiedBy($input) {
    let isSatisfied = true,
      commands = [
        this._ignoreBecauseInputIsHidden,
        this._ignoreBecauseInputIsConfiguredToBeIgnorde,
        this._ignoreBecauseInputIsOptional,
        this._ignoreBecauseInputIsMissingValidationRules
      ];
    commands.every(command => {
      isSatisfied = command.call(this, $input) !== true;
      return isSatisfied;
    });
    return isSatisfied;
  }

  _ignoreBecauseInputIsHidden($input) {
    return ($input.attr('hidden') || !$input.is(':visible')) && !this.options.validateHiddenInputs;
  }

  _ignoreBecauseInputIsConfiguredToBeIgnorde($input) {
    return (this.options.ignore || []).indexOf($input.attr('name')) > -1;
  }

  _ignoreBecauseInputIsOptional($input) {
    return $input.valAttr('optional') === 'true' && !$input.getInputValue();
  }

  _ignoreBecauseInputIsMissingValidationRules($input) {
    return !$input.valAttr();
  }
}
