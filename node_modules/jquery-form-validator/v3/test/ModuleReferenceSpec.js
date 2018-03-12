import { expect } from 'chai';
import ModuleReference from '../src/ModuleReference';

const MODULE_BASE_DIR_URL = 'https://web.com/modules';

describe('ModuleReference', () => {

  it('should possible to construct using module name', () => {
    const moduleReference = new ModuleReference('testModule', MODULE_BASE_DIR_URL);
    expect(moduleReference.getName()).to.be.equal('testModule');
    expect(moduleReference.getAbsoluteUrl()).to.be.equal(MODULE_BASE_DIR_URL + '/testModule.js');
    expect(moduleReference.getRelativeUrl()).to.be.equal('/modules/testModule.js');
  });

  it('should possible to construct using module script name', () => {
    const moduleReference = new ModuleReference('testModule.js', MODULE_BASE_DIR_URL);
    expect(moduleReference.getName()).to.be.equal('testModule');
    expect(moduleReference.getAbsoluteUrl()).to.be.equal(MODULE_BASE_DIR_URL + '/testModule.js');
    expect(moduleReference.getRelativeUrl()).to.be.equal('/modules/testModule.js');
  });

  it('should possible to construct using url', () => {
    const moduleReference = new ModuleReference(MODULE_BASE_DIR_URL + '/testModule.js', MODULE_BASE_DIR_URL);
    expect(moduleReference.getName()).to.be.equal('testModule');
    expect(moduleReference.getAbsoluteUrl()).to.be.equal(MODULE_BASE_DIR_URL + '/testModule.js');
    expect(moduleReference.getRelativeUrl()).to.be.equal('/modules/testModule.js');
  });

  it('should possible to construct using relative url', () => {
    const moduleReference = new ModuleReference('/modules/testModule.js', MODULE_BASE_DIR_URL);
    expect(moduleReference.getName()).to.be.equal('testModule');
    expect(moduleReference.getAbsoluteUrl()).to.be.equal(MODULE_BASE_DIR_URL + '/testModule.js');
    expect(moduleReference.getRelativeUrl()).to.be.equal('/modules/testModule.js');
  });

});
