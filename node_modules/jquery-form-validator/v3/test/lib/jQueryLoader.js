import jsdom from 'jsdom';
import _jQuery from 'jquery';

const jQueryLoader = {
  load: (bodyHtml, headHtml) => {
    const html = '<!doctype html><html><head>'+(headHtml || '')+'</head><body>'+(bodyHtml || '')+'</body></html>';
    const document = new jsdom.JSDOM(html);
    const $ = _jQuery(document.window);
    global.jQuery = $;
    global.document = document;
    global.window = document.window;
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetLeft: {
        get: function() { return parseFloat(window.getComputedStyle(this).marginLeft) || 0; }
      },
      offsetTop: {
        get: function() { return parseFloat(window.getComputedStyle(this).marginTop) || 0; }
      },
      offsetHeight: {
        get: function() {
          return this._offsetHeight || 0;
        },
        set: function (h) {
          this._offsetHeight = h;
        }
      },
      offsetWidth: {
        get: function() {
          return this._offseWidth || 0;
        },
        set: function(w) {
          this._offseWidth = w;
        }
      }
    });
    delete require.cache[require.resolve('../../src/jQuery-plugins')];
    require('../../src/jQuery-plugins');
    return $;
  },
  loadWindow: (bodyHtml, headHtml) => {
    const $ = jQueryLoader.load(bodyHtml, headHtml);
    return $(global.document);
  },
  loadInput: (attr) => {
    const $ = jQueryLoader.load();
    $('<input />', attr).appendTo($('body'));
    return $('input');
  }
};

export default jQueryLoader;
