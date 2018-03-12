import { expect } from 'chai';
import jQueryLoader from './lib/jQueryLoader';
import util from 'util';
import ShouldValidateInputRule from '../src/ShouldValidateInputRule';
import FormValidatorOptions from '../src/FormValidatorOptions';

let $input;

describe('ShouldValidateInputRule', () => {

  before(() => {
    $input = jQueryLoader.loadInput({name: 'monkey'});
  });

  it ('should ignore inputs that is missing validation', () => {
    expect(invokeRule({}, {}, false)).to.be.equal(false);
    expect(invokeRule({})).to.be.equal(true);
  });

  it ('should ignore hidden inputs', () => {
    expect(invokeRule({hidden:'hidden'})).to.be.equal(false);
    expect(invokeRule({style:'display: none'})).to.be.equal(false);
    expect(invokeRule({hidden:'hidden'}, {validateHiddenInputs: true})).to.be.equal(true);
    expect(invokeRule({style:'display: none'}, {validateHiddenInputs: true})).to.be.equal(true);
  });

  it ('should ignore inputs added to ignore list in plugin options', () => {
    expect(invokeRule({name:'something'}, {ignore: 'something'})).to.be.equal(false);
    expect(invokeRule({name:'something'}, {ignore: 'else'})).to.be.equal(true);
  });

  it ('should ignore inputs that are optional', () => {
    expect(invokeRule({'data-validation-optional':'true'})).to.be.equal(false);
    expect(invokeRule({'data-validation-optional':'true', 'value': '123'})).to.be.equal(true);
  });

});


const invokeRule = (inputAttr, overridingOptions, addValidationRule) => {
  const options = new FormValidatorOptions(overridingOptions),
    rule = new ShouldValidateInputRule(options);
  if (!inputAttr.type) {
    inputAttr.type = 'text';
  }
  if (addValidationRule !== false) {
    inputAttr[options.validationRuleAttribute] = 'required';
  }

  hackJsDomElementToSupportOffsetWidth($input, inputAttr);

  const attr = $input.get(0).attributes;
  for (let i=0; i < attr.length; i++) {
    $input.removeAttr(attr[i].name);
  }
  Object.keys(inputAttr).forEach(name => {
    $input.attr(name, inputAttr[name]);
  });
  return rule.isSatisfiedBy($input);
};

const hackJsDomElementToSupportOffsetWidth = ($input, inputAttr) => {
  if (inputAttr.style === 'display: none') {
    $input[0].offsetWidth = 0;
    $input[0].offsetHeight = 0;
  } else {
    $input[0].offsetWidth = 20;
    $input[0].offsetHeight = 20;
  }
};
