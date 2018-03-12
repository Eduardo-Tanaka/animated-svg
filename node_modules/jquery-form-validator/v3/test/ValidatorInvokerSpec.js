import { expect } from 'chai';
import jQueryLoader from './lib/jQueryLoader';
import ValidatorInvoker from '../src/ValidatorInvoker';
import FormValidatorEvents from '../src/FormValidatorEvents';

describe('ValidatorInvoker', () => {

  it('should pass on the validation result', () => {
    const validatorInvoker = new ValidatorInvoker({
      validatorFunction: (done) => {
        done(true);
      }
    });
    validatorInvoker.validate(result => {
      expect(result.success).to.be.equal(true);
    }, '', jQueryLoader.loadInput());
  });

  /*
  it('should trigger expected events', () => {
    const $input = jQueryLoader.loadInput(),
      validatorInvoker = new ValidatorInvoker({
        validatorFunction: (done) => {
          done(true);
        }
      });

    let hasTriggeredBeforeEvent, hasTriggeredValidationEvent;
    $input
      .on(FormValidatorEvents.onBeforeValidation, () => {
        hasTriggeredBeforeEvent = true;
      })
      .on(FormValidatorEvents.onValidation, () => {
        hasTriggeredValidationEvent = true;
      });

    validatorInvoker.validate(result => {}, '', $input);
    expect(hasTriggeredBeforeEvent).to.be.equal(true);
    expect(hasTriggeredValidationEvent).to.be.equal(true);
  });

  it('should be possible to skip validation', () => {
    const $input = jQueryLoader.loadInput();
    let validatorInvoker = new ValidatorInvoker({
      validatorFunction: (done) => {
        done(true);
      }
    });
    $input.one(FormValidatorEvents.onBeforeValidation, function() {
      $input.valAttr('skipped', 1);
    });
    validatorInvoker.validate(result => {
      expect(result.success).to.be.equal(undefined);
      expect(result.ignored).to.be.equal(true);
    }, '', $input);

    // second time we dont skip the validation
    validatorInvoker.validate(result => {
      expect(result.success).to.be.equal(true);
      expect(result.ignored).to.be.equal(undefined);
    }, '', $input);
  });
  */

});
