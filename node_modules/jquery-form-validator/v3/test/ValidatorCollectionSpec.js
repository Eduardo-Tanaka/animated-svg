import { expect } from 'chai';
import ValidatorCollection from '../src/ValidatorCollection';

describe('ValidatorCollection', () => {

  const validatorCollection = new ValidatorCollection();

  before(() => {
    validatorCollection.addValidator({name: 'test'}, 'testModule');
    validatorCollection.addValidator({name: 'test2'}, 'testModule');
    validatorCollection.addValidator({name: 'validatorNameCollision', errorMessage:'x'}, 'testModule');
    validatorCollection.addValidator({name: 'validatorNameCollision', errorMessage:'y'}, 'otherModule');
  });

  it ('should not crash when unable to resolve validator', () => {
    expect(validatorCollection.resolveValidator('blaha')).to.be.equal(null);
    expect(validatorCollection.resolveValidator('testModule/blaha')).to.be.equal(null);
    expect(validatorCollection.resolveValidator('unknownModule/test')).to.be.equal(null);
  });

  it ('should be possible to resolve validator with module uri', () => {
    let validator = validatorCollection.resolveValidator('testModule/test');
    expect(validator).to.be.an('object');
    expect(validator.name).to.be.equal('test');
    validator = validatorCollection.resolveValidator('testModule/test2');
    expect(validator).to.be.an('object');
    expect(validator.name).to.be.equal('test2');
  });

  it ('should be possible to resolve validator using only module name', () => {
    let validator = validatorCollection.resolveValidator('test');
    expect(validator).to.be.an('object');
    expect(validator.name).to.be.equal('test');
    validator = validatorCollection.resolveValidator('test2');
    expect(validator).to.be.an('object');
    expect(validator.name).to.be.equal('test2');
  });

  it ('should be possible to resolve validators having colliding name', () => {
    let validator = validatorCollection.resolveValidator('validatorNameCollision');
    expect(validator).to.be.an('object');
    expect(validator.name).to.be.equal('validatorNameCollision');
    expect(validator.errorMessage).to.be.equal('x');
    validator = validatorCollection.resolveValidator('otherModule/validatorNameCollision');
    expect(validator).to.be.an('object');
    expect(validator.name).to.be.equal('validatorNameCollision');
    expect(validator.errorMessage).to.be.equal('y');
  });

});
