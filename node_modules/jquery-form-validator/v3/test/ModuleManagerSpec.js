import { expect } from 'chai';
import jQueryLoader from './lib/jQueryLoader';
import jsdom from 'jsdom';
import _jQuery from 'jquery';
import ModuleManager from '../src/ModuleManager';
import ModuleReference from '../src/ModuleReference';
import FormValidatorEvents from '../src/FormValidatorEvents';

const moduleRef = new ModuleReference('test', 'path');
let moduleManager,
  $window;

describe('ModuleManager', () => {

  beforeEach(() => {
    $window = jQueryLoader.loadWindow();
    moduleManager = new ModuleManager($window, (moduleReference, callback) => {
      setTimeout(() => {
        moduleManager.registerLoadedModule(moduleReference.getName());
        callback();
      }, 500);
    });
  });

  it('should be possible to load a module using reference', done => {
    expect(moduleManager.hasLoaded(moduleRef)).to.be.equal(false);
    moduleManager.loadModule(moduleRef).then(() => {
      expect(moduleManager.hasLoaded(moduleRef)).to.be.equal(true);
      done();
    }).catch(done);
  });

  it('should be possible to load modules using a comma separated string with module names', done => {
    expect(moduleManager.hasLoaded(moduleRef)).to.be.equal(false);
    moduleManager.loadModules(moduleRef.getName()+', otherTest', 'pathSomeWhere').then(() => {
      expect(moduleManager.hasLoaded(moduleRef)).to.be.equal(true);
      done();
    }).catch(done);
  });

  it('should dispatch expected events when loading modules', done => {
    let hasDispatchEvent = false;
    $window.on(FormValidatorEvents.validatorsLoaded, () => {
      hasDispatchEvent = true;
    });
    moduleManager.loadModules(moduleRef.getName()+', otherTest', 'pathSomeWhere').then(() => {
      if (!hasDispatchEvent) {
        throw new Error(`Event "${FormValidatorEvents.validatorsLoaded}" was never dispatched`, 0);
      }
      done();
    }).catch(done);
  });

  it('should dispatch expected events when loading modules already loaded', done => {
    moduleManager.registerLoadedModule(moduleRef.getName());
    let hasDispatchEvent = false;
    $window.on(FormValidatorEvents.validatorsLoaded, () => {
      hasDispatchEvent = true;
    });
    moduleManager.loadModules(moduleRef.getName(), 'pathSomeWhere').then(() => {
      if (!hasDispatchEvent) {
        throw new Error(`Event "${FormValidatorEvents.validatorsLoaded}" was not dispatch when trying to load an already registered module`, 0);
      }
      done();
    }).catch(done);
  });

  it('should dispatch expected events even when no modules gets loaded', done => {
    let hasDispatchEvent = false;
    $window.on(FormValidatorEvents.validatorsLoaded, () => {
      hasDispatchEvent = true;
    });
    moduleManager.loadModules('', 'pathSomeWhere').then(() => {
      if (!hasDispatchEvent) {
        throw new Error(`Event "${FormValidatorEvents.validatorsLoaded}" was never dispatched`, 0);
      }
      done();
    }).catch(done);
  });

  it('should be possible to get a singleton instance using jQuery', () => {
    const $ = jQueryLoader.load(),
      moduleManager = ModuleManager.loadViaJquery($, document);

    moduleManager.monkey = 'patched';

    const otherModuleManager = ModuleManager.loadViaJquery($, document);
    expect(otherModuleManager.monkey).to.be.equal('patched');
  });

});
