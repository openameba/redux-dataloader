"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createLoader;

var _TaskDescriptor = _interopRequireDefault(require("./TaskDescriptor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Create a new TaskDescriptor
 *
 * @param {string|object|function} pattern pattern to match action
 * @param {object} params parameters
 * @param {object} options options
 * @returns {TaskDescriptor} a descriptor object for creating data loader
 */
function createLoader(pattern, params, options) {
  return new _TaskDescriptor["default"](pattern, params, options);
}