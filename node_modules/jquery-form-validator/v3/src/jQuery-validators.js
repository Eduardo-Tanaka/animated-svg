import ModuleManager from './ModuleManager';
import ValidatorCollection from './ValidatorCollection';
import utils from './utils';

(function($) {

  const moduleManager = ModuleManager.loadViaJquery($, window),
    validatorCollection = ValidatorCollection.loadViaJquery($);

  $.formUtils.registerModule = function(module, validators) {
    (validators || []).forEach(validator => {
      validatorCollection.addValidator(validator, module);
    });
    moduleManager.registerLoadedModule(module);
  };

  $.formUtils.registerLoadedModule = function(module, validators) {
    // todo: make deprecated
    $.formUtils.registerModule(module, validators);
  };

  $.formUtils.addValidator = function(validator, module) {
    // todo: make deprecated
    const originalValidatorFunc = validator.validatorFunction;
    validator.validatorFunction = (done, value, $input, options, lang, $form, eventContext) => {
      done(originalValidatorFunc(value, $input, options, lang, $form, eventContext));
    };
    validatorCollection.addValidator(validator, module || '__unknown')
  };

  const coreValidators = [];

  /*
   * Validate email
   */
  coreValidators.push({
    name: 'email',
    validatorFunction: function (done, email) {

      var emailParts = email.toLowerCase().split('@'),
        localPart = emailParts[0],
        domain = emailParts[1],
        isValidEmail = false;

      if (localPart && domain) {

        if( localPart.indexOf('"') === 0 ) {
          var len = localPart.length;
          localPart = localPart.replace(/\"/g, '');
          if( localPart.length !== (len-2) ) {
            done(false); // It was not allowed to have more than two apostrophes
          }
        }

        validatorCollection.resolveValidator('domain').validate(
          (result) => {
            done(
              result.success === true &&
              localPart.indexOf('.') !== 0 &&
              localPart.substring(localPart.length-1, localPart.length) !== '.' &&
              localPart.indexOf('..') === -1 &&
              !(/[^\w\+\.\-\#\-\_\~\!\$\&\'\(\)\*\+\,\;\=\:]/.test(localPart))
            );
          },
          emailParts[1]
        );
      }

      done(isValidEmail);
    },
    errorMessage: '',
    errorMessageKey: 'badEmail'
  });

  /*
   * Validate domain name
   */
  coreValidators.push({
    name: 'domain',
    validatorFunction: function (done, val) {
      done(
        val.length > 0 &&
        val.length <= 253 && // Including sub domains
        !(/[^a-zA-Z0-9]/.test(val.slice(-2))) && !(/[^a-zA-Z0-9]/.test(val.substr(0, 1))) && !(/[^a-zA-Z0-9\.\-]/.test(val)) &&
        val.split('..').length === 1 &&
        val.split('.').length > 1
      );
    },
    errorMessage: '',
    errorMessageKey: 'badDomain'
  });

  /*
   * Validate required
   */
  coreValidators.push({
    name: 'required',
    validatorFunction: function (done, val, $el, config, language, $form) {
      var isValid = false;
      switch ($el.attr('type')) {
        case 'checkbox':
          isValid = $el.is(':checked');
          break;
        case 'radio':
          isValid = $form.find('input[name="' + $el.attr('name') + '"]').filter(':checked').length > 0;
          break;
        default:
          isValid = $.trim(val) !== '';
          break;
      }
      done(isValid);
    },
    errorMessage: '',
    errorMessageKey: function(config) {
      if (config.errorMessagePosition === 'top' || typeof config.errorMessagePosition === 'function') {
        return 'requiredFields';
      }
      else {
        return 'requiredField';
      }
    }
  });

  /*
   * Validate length range
   */
  coreValidators.push({
    name: 'length',
    validatorFunction: function (done, val, $el, conf, lang) {
      var lengthAllowed = $el.valAttr('length'),
        type = $el.attr('type');

      if (lengthAllowed === undefined) {
        alert('Please add attribute "data-validation-length" to ' + $el[0].nodeName + ' named ' + $el.attr('name'));
        done(null);
      }

      // check if length is above min, below max or within range.
      var len = type === 'file' && $el.get(0).files !== undefined ? $el.get(0).files.length : val.length,
        lengthCheckResults = $.formUtils.numericRangeCheck(len, lengthAllowed),
        checkResult;

      switch (lengthCheckResults[0]) {   // outside of allowed range
        case 'out':
          this.errorMessage = lang.lengthBadStart + lengthAllowed + lang.lengthBadEnd;
          checkResult = false;
          break;
        // too short
        case 'min':
          this.errorMessage = lang.lengthTooShortStart + lengthCheckResults[1] + lang.lengthBadEnd;
          checkResult = false;
          break;
        // too long
        case 'max':
          this.errorMessage = lang.lengthTooLongStart + lengthCheckResults[1] + lang.lengthBadEnd;
          checkResult = false;
          break;
        // ok
        default:
          checkResult = true;
      }

      done(checkResult);
    },
    errorMessage: '',
    errorMessageKey: ''
  });

  /*
   * Validate url
   */
  coreValidators.push({
    name: 'url',
    validatorFunction: function (done, url) {
      // written by Scott Gonzalez: http://projects.scottsplayground.com/iri/
      // - Victor Jonsson added support for arrays in the url ?arg[]=sdfsdf
      // - General improvements made by Stéphane Moureau <https://github.com/TraderStf>

      var urlFilter = /^(https?|ftp):\/\/((((\w|-|\.|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])(\w|-|\.|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])(\w|-|\.|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/(((\w|-|\.|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/((\w|-|\.|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|\[|\]|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#(((\w|-|\.|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
      if (urlFilter.test(url)) {
        var domain = url.split('://')[1],
          domainSlashPos = domain.indexOf('/');

        if (domainSlashPos > -1) {
          domain = domain.substr(0, domainSlashPos);
        }

        validatorCollection.resolveValidator('domain').validate(
          (result) => {
            done(result.success === true);
          },
          domain
        );
      }
      done(false);
    },
    errorMessage: '',
    errorMessageKey: 'badUrl'
  });

  /*
   * Validate number (floating or integer)
   */
  coreValidators.push({
    name: 'number',
    validatorFunction: function (done, val, $el, conf) {
      if (val !== '') {
        var allowing = $el.valAttr('allowing') || '',
          decimalSeparator = $el.valAttr('decimal-separator') || conf.decimalSeparator,
          allowsRange = false,
          begin, end,
          steps = $el.valAttr('step') || '',
          allowsSteps = false,
          sanitize = $el.attr('data-sanitize') || '',
          isFormattedWithNumeral = sanitize.match(/(^|[\s])numberFormat([\s]|$)/i);

        if (isFormattedWithNumeral) {
          if (!window.numeral) {
            throw new ReferenceError('The data-sanitize value numberFormat cannot be used without the numeral' +
              ' library. Please see Data Validation in http://www.formvalidator.net for more information.');
          }
          //Unformat input first, then convert back to String
          if (val.length) {
            val = String(numeral().unformat(val));
          }
        }

        if (allowing.indexOf('number') === -1) {
          allowing += ',number';
        }

        if (allowing.indexOf('negative') === -1 && val.indexOf('-') === 0) {
          done(false);
        }
        if (allowing.indexOf('range') > -1) {
          begin = parseFloat(allowing.substring(allowing.indexOf('[') + 1, allowing.indexOf(';')));
          end = parseFloat(allowing.substring(allowing.indexOf(';') + 1, allowing.indexOf(']')));
          allowsRange = true;
        }
        if (steps !== '') {
          allowsSteps = true;
        }
        if (decimalSeparator === ',') {
          if (val.indexOf('.') > -1) {
            done(false);
          }
          // Fix for checking range with floats using ,
          val = val.replace(',', '.');
        }
        if (val.replace(/[0-9-]/g, '') === '' && (!allowsRange || (val >= begin && val <= end)) && (!allowsSteps || (val % steps === 0))) {
          done(true);
        }
        if (allowing.indexOf('float') > -1 && val.match(new RegExp('^([0-9-]+)\\.([0-9]+)$')) !== null && (!allowsRange || (val >= begin && val <= end)) && (!allowsSteps || (val % steps === 0))) {
          done(true);
        }
      }
      done(false);
    },
    errorMessage: '',
    errorMessageKey: 'badInt'
  });

  /*
   * Validate alpha numeric
   */
  coreValidators.push({
    name: 'alphanumeric',
    validatorFunction: function (done, val, $el, conf, language) {
      var patternStart = '^([a-zA-Z0-9',
        patternEnd = ']+)$',
        additionalChars = $el.valAttr('allowing'),
        pattern = '',
        hasSpaces = false;

      if (additionalChars) {
        pattern = patternStart + additionalChars + patternEnd;
        var extra = additionalChars.replace(/\\/g, '');
        if (extra.indexOf(' ') > -1) {
          hasSpaces = true;
          extra = extra.replace(' ', '');
          extra += language.andSpaces || $.formUtils.LANG.andSpaces;
        }

        if(language.badAlphaNumericAndExtraAndSpaces && language.badAlphaNumericAndExtra) {
          if(hasSpaces) {
            this.errorMessage = language.badAlphaNumericAndExtraAndSpaces + extra;
          } else {
            this.errorMessage = language.badAlphaNumericAndExtra + extra + language.badAlphaNumericExtra;
          }
        } else {
          this.errorMessage = language.badAlphaNumeric + language.badAlphaNumericExtra + extra;
        }
      } else {
        pattern = patternStart + patternEnd;
        this.errorMessage = language.badAlphaNumeric;
      }

      done(new RegExp(pattern).test(val));
    },
    errorMessage: '',
    errorMessageKey: ''
  });

  /*
   * Validate against regexp
   */
  coreValidators.push({
    name: 'custom',
    validatorFunction: function (done,val, $el) {
      done(new RegExp($el.valAttr('regexp')).test(val));
    },
    errorMessage: '',
    errorMessageKey: 'badCustomVal'
  });

  /*
   * Validate date
   */
  coreValidators.push({
    name: 'date',
    validatorFunction: function (date, $el, conf) {
      var dateFormat = $el.valAttr('format') || conf.dateFormat || 'yyyy-mm-dd',
        addMissingLeadingZeros = $el.valAttr('require-leading-zero') === 'false';
      done(utils.parseDate(date, dateFormat, addMissingLeadingZeros) !== false);
    },
    errorMessage: '',
    errorMessageKey: 'badDate'
  });


  /*
   * Validate group of checkboxes, validate qty required is checked
   * written by Steve Wasiura : http://stevewasiura.waztech.com
   * element attrs
   *    data-validation="checkbox_group"
   *    data-validation-qty="1-2"  // min 1 max 2
   *    data-validation-error-msg="chose min 1, max of 2 checkboxes"
   */
  coreValidators.push({
    name: 'checkbox_group',
    validatorFunction: function (done, val, $el, conf, lang, $form) {
      var isValid = true,
      // get name of element. since it is a checkbox group, all checkboxes will have same name
        elname = $el.attr('name'),
      // get checkboxes and count the checked ones
        $checkBoxes = $('input[type=checkbox][name^="' + elname + '"]', $form),
        checkedCount = $checkBoxes.filter(':checked').length,
      // get el attr that specs qty required / allowed
        qtyAllowed = $el.valAttr('qty');

      if (qtyAllowed === undefined) {
        var elementType = $el.get(0).nodeName;
        utils.warn('Attribute "data-validation-qty" is missing from ' + elementType + ' named ' + $el.attr('name'));
      }

      // call Utility function to check if count is above min, below max, within range etc.
      var qtyCheckResults = $.formUtils.numericRangeCheck(checkedCount, qtyAllowed);

      // results will be array, [0]=result str, [1]=qty int
      switch (qtyCheckResults[0]) {
        // outside allowed range
        case 'out':
          this.errorMessage = lang.groupCheckedRangeStart + qtyAllowed + lang.groupCheckedEnd;
          isValid = false;
          break;
        // below min qty
        case 'min':
          this.errorMessage = lang.groupCheckedTooFewStart + qtyCheckResults[1] + (lang.groupCheckedTooFewEnd || lang.groupCheckedEnd);
          isValid = false;
          break;
        // above max qty
        case 'max':
          this.errorMessage = lang.groupCheckedTooManyStart + qtyCheckResults[1] + (lang.groupCheckedTooManyEnd || lang.groupCheckedEnd);
          isValid = false;
          break;
        // ok
        default:
          isValid = true;
      }

      if (!isValid) {
        var _triggerOnBlur = function() {
          $checkBoxes.unbind('click', _triggerOnBlur);
          // todo: change this...
          $checkBoxes.filter('*[data-validation]').validateInputOnBlur(lang, conf, false, 'blur');
        };
        $checkBoxes.bind('click', _triggerOnBlur);
      }

      done(isValid);
    }
    //   errorMessage : '', // set above in switch statement
    //   errorMessageKey: '' // not used
  });

  $.formUtils.registerModule('__core', coreValidators);

})(jQuery);
