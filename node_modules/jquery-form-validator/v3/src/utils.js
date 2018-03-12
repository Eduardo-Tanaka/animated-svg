
/**
 * A split function alá the "Robustness Principle". The delimiter can be any
 * of the characters space, comma, dash or pipe.
 * @param {String} str
 * @param {Boolean} [allowSpaceAsDelimiter] Defaults to "true"
 * @returns {Array}
 */
const split = (str, allowSpaceAsDelimiter) => {
  allowSpaceAsDelimiter = allowSpaceAsDelimiter === undefined || allowSpaceAsDelimiter === true;

  const pattern = '[,|'+(allowSpaceAsDelimiter ? '\\s':'')+'-]\\s*',
    values = [],
    regex = new RegExp(pattern, 'g');

  if (str) {
    str.split(regex).forEach(stringPart => {
      if (stringPart.trim().length) {
        values.push(stringPart);
      }
    });
  }
  return values;
};

/**
 *
 */
const warn = () => {

};

/**
 * @param val
 * @param dateFormat
 * @param addMissingLeadingZeros
 * @returns {*}
 */
const parseDate = (val, dateFormat, addMissingLeadingZeros) => {
  var divider = dateFormat.replace(/[a-zA-Z]/gi, '').substring(0, 1),
    regexp = '^',
    formatParts = dateFormat.split(divider || null),
    matches, day, month, year;

  $.each(formatParts, function (i, part) {
    regexp += (i > 0 ? '\\' + divider : '') + '(\\d{' + part.length + '})';
  });

  regexp += '$';

  if (addMissingLeadingZeros) {
    var newValueParts = [];
    $.each(val.split(divider), function(i, part) {
      if(part.length === 1) {
        part = '0'+part;
      }
      newValueParts.push(part);
    });
    val = newValueParts.join(divider);
  }

  matches = val.match(new RegExp(regexp));
  if (matches === null) {
    return false;
  }

  var findDateUnit = function (unit, formatParts, matches) {
    for (var i = 0; i < formatParts.length; i++) {
      if (formatParts[i].substring(0, 1) === unit) {
        return $.formUtils.parseDateInt(matches[i + 1]);
      }
    }
    return -1;
  };

  month = findDateUnit('m', formatParts, matches);
  day = findDateUnit('d', formatParts, matches);
  year = findDateUnit('y', formatParts, matches);

  if ((month === 2 && day > 28 && (year % 4 !== 0 || year % 100 === 0 && year % 400 !== 0)) ||
    (month === 2 && day > 29 && (year % 4 === 0 || year % 100 !== 0 && year % 400 === 0)) ||
    month > 12 || month === 0) {
    return false;
  }
  if ((this.isShortMonth(month) && day > 30) || (!this.isShortMonth(month) && day > 31) || day === 0) {
    return false;
  }

  return [year, month, day];
};

export default {
  split: split,
  parseDate: parseDate,
  warn: warn
};
