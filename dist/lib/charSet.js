'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('babel-runtime/core-js/math/log2');

var _log2 = _interopRequireDefault(_log);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lcm = require('./lcm');

var _lcm2 = _interopRequireDefault(_lcm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CharSet = function () {
  function CharSet(chars, ndxFn) {
    (0, _classCallCheck3.default)(this, CharSet);

    this.chars = chars;
    this.ndxFn = ndxFn;
    this.len = chars.length;
    this.entropyPerChar = Math.floor((0, _log2.default)(this.len));

    if (this.entropyPerChar != (0, _log2.default)(this.len)) {
      throw new Error('EntropyString only supports CharSets with a power of 2 characters');
    }

    this.charsPerChunk = (0, _lcm2.default)(this.entropyPerChar, 8) / this.entropyPerChar;
  }

  (0, _createClass3.default)(CharSet, [{
    key: 'use',
    value: function use(chars) {
      var len = chars.length;
      // Ensure correct number of characters
      if (len != this.len) {
        throw new Error('Invalid character count');
      }

      // Ensure no repeated characters
      for (var i = 0; i < len; i++) {
        var c = chars.charAt(i);
        for (var j = i + 1; j < len; j++) {
          if (c === chars.charAt(j)) {
            throw new Error('Characters not unique');
          }
        }
      }

      this.chars = chars;
    }
  }]);
  return CharSet;
}();

var charSet64 = new CharSet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", _ndx64);
var charSet32 = new CharSet("2346789bdfghjmnpqrtBDFGHJLMNPQRT", _ndx32);
var charSet16 = new CharSet("0123456789abcdef", _ndx16);
var charSet8 = new CharSet("01234567", _ndx8);
var charSet4 = new CharSet("ATCG", _ndx4);
var charSet2 = new CharSet("01", _ndx2);

var isValid = function isValid(charSet) {
  return charSet instanceof CharSet;
};

var _ndx64 = function _ndx64(chunk, slice, bytes) {
  return _ndxGen(chunk, slice, bytes, 6);
};

var _ndx32 = function _ndx32(chunk, slice, bytes) {
  return _ndxGen(chunk, slice, bytes, 5);
};

var _ndx16 = function _ndx16(chunk, slice, bytes) {
  return (bytes[chunk] << 4 * slice & 0xff) >> 4;
};

var _ndx8 = function _ndx8(chunk, slice, bytes) {
  return _ndxGen(chunk, slice, bytes, 3);
};

var _ndx4 = function _ndx4(chunk, slice, bytes) {
  return (bytes[chunk] << 2 * slice & 0xff) >> 6;
};

var _ndx2 = function _ndx2(chunk, slice, bytes) {
  return (bytes[chunk] << slice & 0xff) >> 7;
};

var _ndxGen = function _ndxGen(chunk, slice, bytes, bitsPerSlice) {
  var bitsPerByte = 8;
  var slicesPerChunk = (0, _lcm2.default)(bitsPerSlice, bitsPerByte) / bitsPerByte;

  var bNum = chunk * slicesPerChunk;

  var rShift = bitsPerByte - bitsPerSlice;

  var lOffset = Math.floor(slice * bitsPerSlice / bitsPerByte);
  var lShift = slice * bitsPerSlice % bitsPerByte;

  var ndx = (bytes[bNum + lOffset] << lShift & 0xff) >> rShift;

  var rOffset = Math.ceil(slice * bitsPerSlice / bitsPerByte);
  var rShiftIt = ((rOffset + 1) * bitsPerByte - (slice + 1) * bitsPerSlice) % bitsPerByte;
  if (rShift < rShiftIt) {
    ndx += bytes[bNum + rOffset] >> rShiftIt;
  }
  return ndx;
};

exports.default = {
  charSet64: charSet64,
  charSet32: charSet32,
  charSet16: charSet16,
  charSet8: charSet8,
  charSet4: charSet4,
  charSet2: charSet2,
  isValid: isValid
};