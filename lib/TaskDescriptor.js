"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _Task = _interopRequireDefault(require("./Task"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskDescriptor =
/*#__PURE__*/
function () {
  function TaskDescriptor(pattern, params) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, TaskDescriptor);

    this.pattern = pattern;
    this.params = params;
    this.options = Object.assign({}, _constants.DEFAULT_OPTIONS, options);

    if (this.options.retryTimes < 1) {
      this.options.retryTimes = 1;
    }
  }

  _createClass(TaskDescriptor, [{
    key: "supports",
    value: function supports(action) {
      switch (_typeof(this.pattern)) {
        case 'object':
          return (0, _isEqual["default"])(this.pattern, action);

        case 'function':
          return this.pattern(action) === true;

        default:
          return this.pattern === action.type;
      }
    }
  }, {
    key: "newTask",
    value: function newTask(context, action) {
      return new _Task["default"](context, action, this.params);
    }
  }]);

  return TaskDescriptor;
}();

exports["default"] = TaskDescriptor;