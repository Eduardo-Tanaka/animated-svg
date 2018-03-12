import { expect } from 'chai';
import jQueryLoader from './lib/jQueryLoader';
import FormValidatorOptions from '../src/FormValidatorOptions';

describe('FormValidatorOptions', () => {

  it('should be possible to override default options', () => {
    const options = new FormValidatorOptions({
      something: 'hello',
      addValidClassOnAll: true
    });
    expect(options.something).to.be.equal('hello');
    expect(options.form).to.be.equal('form');
    expect(options.addValidClassOnAll).to.be.equal(true);
    options.override({
      something: 'test',
      addValidClassOnAll: false,
      form: '#some-form'
    });
    expect(options.something).to.be.equal('test');
    expect(options.form).to.be.equal('#some-form');
    expect(options.addValidClassOnAll).to.be.equal(false);
  });

  it('should be possible to attach to a form element', () => {

    const $ = jQueryLoader.load('<form></form>'),
      $form = $('form');

    new FormValidatorOptions({
      something: 'hello',
      addValidClassOnAll: true
    }).attach($form);

    const options = new FormValidatorOptions();
    expect(options.something).to.be.equal(undefined);
    expect(options.addValidClassOnAll).to.be.equal(false);
    options.applyOptionsAttachedToForm($form);
    expect(options.something).to.be.equal('hello');
    expect(options.addValidClassOnAll).to.be.equal(true);
  });

});
