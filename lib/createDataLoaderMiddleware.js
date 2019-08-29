"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.number.is-integer");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/web.timers");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createDataLoaderMiddleware;

var _findKey = _interopRequireDefault(require("lodash/findKey"));

var _find = _interopRequireDefault(require("lodash/find"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _flattenDeep = _interopRequireDefault(require("lodash/flattenDeep"));

var _get = _interopRequireDefault(require("lodash/get"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function findTaskKey(runningTasksMap, action) {
  return (0, _findKey["default"])(runningTasksMap, function (o) {
    return o.action.type === action.type && (0, _isEqual["default"])(o.action, action);
  });
}

function createDataLoaderMiddleware() {
  var loaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var withArgs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var middlewareOpts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var flattenedLoaders = (0, _flattenDeep["default"])(loaders);
  var currentId = 1;

  var uniqueId = function uniqueId(prefix) {
    currentId += 1;
    return "".concat(prefix).concat(currentId);
  };

  var middleware = function middleware(_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    middleware.runningTasks = {};
    var ctx = Object.assign({}, withArgs, {
      dispatch: dispatch,
      getState: getState
    });
    return function (next) {
      return function (receivedAction) {
        // eslint-disable-next-line no-underscore-dangle
        if (receivedAction._id !== _constants.REDUX_DATALOADER_ACTION_ID) {
          return next(receivedAction);
        }

        return receivedAction.then(function (asyncAction) {
          // dispatch data loader request action
          next(asyncAction);
          var action = asyncAction.meta.action;
          var taskKey = findTaskKey(middleware.runningTasks, action);

          if (taskKey) {
            return middleware.runningTasks[taskKey].promise;
          }

          var taskDescriptor = (0, _find["default"])(flattenedLoaders, function (loader) {
            return loader.supports(action);
          });

          if (!taskDescriptor) {
            throw new Error('No loader for action', action);
          } // Priority: Action Meta Options > TaskDescriptor Options > Middleware Options


          var options = Object.assign({}, middlewareOpts, taskDescriptor.options, (0, _get["default"])(asyncAction, 'meta.options', {}));
          var task = taskDescriptor.newTask(ctx, action);
          var runningTask = task.execute(options);

          if (Number.isInteger(options.ttl) && options.ttl > 0) {
            var key = uniqueId("".concat(action.type, "__"));
            middleware.runningTasks[key] = {
              action: action,
              promise: runningTask
            };

            if (typeof navigator !== 'undefined') {
              setTimeout(function () {
                delete middleware.runningTasks[key];
              }, options.ttl);
            }
          }

          return runningTask;
        });
      };
    };
  };

  return middleware;
}