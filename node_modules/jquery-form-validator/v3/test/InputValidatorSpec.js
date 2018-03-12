import { expect } from 'chai';
import jQueryLoader from './lib/jQueryLoader';
import InputValidator from '../src/InputValidator';
import ValidatorCollection from '../src/ValidatorCollection';
import FormValidatorOptions from '../src/FormValidatorOptions';

let validators,
  $,
  $form;

describe('InputValidator', () => {

  before(() => {
    validators = new ValidatorCollection();
    validators.addValidator({
      name: 'required',
      validatorFunction: (done, value) => {
        done(value ? true : false);
      }
    }, 'testModule');

    $ = jQueryLoader.load('<form></form>');
    $form = $('form');
  });
/*
  it('should be possible to validate inputs without validation rule', done  => {
    const validator = new InputValidator(validators, new FormValidatorOptions(), null, $form),
      $input = $('<input />').appendTo($form);
      validator.validate($input, 'blur')
        .then(result => {
          expect(result.ignored).to.be.equal(true);
          done();
        })
        .catch(done);
  });

  it('should be possible to validate inputs with unknown validation rules without crashing', done  => {
    const validator = new InputValidator(validators, new FormValidatorOptions(), null, $form),
      $input = $('<input data-validation="blaha" />').appendTo($form);
      validator.validate($input, 'blur')
        .then(result => {
          expect(result.ignored).to.be.equal(true);
          done();
        })
        .catch(done);
  });
*/
  it('should be possible to validate inputs with a known validation rule', done  => {
    const $input = jQueryLoader.loadInput({'data-validation': 'required'}),
      validator = new InputValidator(validators, new FormValidatorOptions(), null, $input.closest('form'));

      validator.validate($input, 'blur')
        .then(result => {
          console.log(result);
          expect(result.ignored).to.be.equal(undefined);
          expect(result.invalid).to.be.equal(true);
          done();
        })
        .catch(done);
  });

  /*
  it('should be possible to validate optional inputs', () =>  {

  });
*/
});
