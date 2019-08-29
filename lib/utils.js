"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-names");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAction = isAction;
exports.formatError = formatError;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isAction(action) {
  var result = action && _typeof(action) === 'object' && action.type && typeof action.type === 'string';
  return result;
}

function formatError(err) {
  var error;

  if (err instanceof Error) {
    error = err;
  } else if (_typeof(err) === 'object') {
    error = new Error(JSON.stringify(err));
  } else {
    error = new Error(err);
  }

  var result = {};
  Object.getOwnPropertyNames(error).forEach(function (key) {
    result[key] = error[key];
  });
  return result;
}