"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _retryit = _interopRequireDefault(require("retryit"));

var _actions = require("./actions");

var _utils = require("./utils");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Task =
/*#__PURE__*/
function () {
  function Task(context, monitoredAction) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Task);

    if (!(0, _utils.isAction)(monitoredAction)) {
      throw new Error('action must be a plain object');
    }

    this.context = Object.assign({}, context, {
      action: monitoredAction
    });
    this.params = Object.assign({}, {
      success: function success(_ref) {
        var action = _ref.action;
        throw new Error('success() is not implemented', action.type);
      },
      error: function error(_ref2) {
        var action = _ref2.action;
        throw new Error('error() is not implemented', action.type);
      },
      loading: function loading(_ref3) {
        var action = _ref3.action;
        return action;
      },
      shouldFetch: function shouldFetch() {
        return true;
      },
      fetch: function fetch(_ref4) {
        var action = _ref4.action;
        throw new Error('Not implemented', action);
      }
    }, params);
  }

  _createClass(Task, [{
    key: "execute",
    value: function execute() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var opts = Object.assign({}, _constants.DEFAULT_OPTIONS, options);
      var context = this.context;
      var dispatch = context.dispatch;
      var _this$params = this.params,
          success = _this$params.success,
          error = _this$params.error,
          loading = _this$params.loading,
          shouldFetch = _this$params.shouldFetch,
          fetch = _this$params.fetch;
      var disableInternalAction = options.disableInternalAction;

      if (!shouldFetch(context)) {
        if (!disableInternalAction) {
          var successAction = (0, _actions.loadSuccess)(context.action);
          dispatch(successAction);
        }

        return Promise.resolve();
      }

      dispatch(loading(context)); // Retry

      return (0, _retryit["default"])({
        times: opts.retryTimes,
        interval: opts.retryWait
      }, function () {
        return Promise.resolve(fetch(context));
      }).then(function (result) {
        var successAction = success(context, result);

        if (!disableInternalAction) {
          dispatch((0, _actions.loadSuccess)(context.action, result));
        }

        return dispatch(successAction);
      })["catch"](function (err) {
        var errorAction = error(context, err);

        if (!disableInternalAction) {
          dispatch((0, _actions.loadFailure)(context.action, err));
        }

        return dispatch(errorAction);
      });
    }
  }]);

  return Task;
}();

exports["default"] = Task;