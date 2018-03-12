
export default class ModuleReference {
  constructor(name, moduleDirBaseUrl) {
    this.name = normalizeModuleName(name);
    this.moduleDirBaseUrl = moduleDirBaseUrl;
  }
  getRelativeUrl() {
    var match = this.moduleDirBaseUrl.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match[5] + '/' + this.name + '.js';
  }
  getAbsoluteUrl() {
    return this.moduleDirBaseUrl + '/' + this.name + '.js';
  }
  getName() {
    return this.name;
  }
  toString() {
    return this.getAbsoluteUrl();
  }
}

function normalizeModuleName(str) {
  return str.split('/').splice(-1)[0].split('.')[0];
}
