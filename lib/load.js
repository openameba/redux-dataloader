"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = load;

var _actions = require("./actions");

var _utils = require("./utils");

var _constants = require("./constants");

function load(action) {
  if (!(0, _utils.isAction)(action)) {
    throw new Error('action must be object', action);
  }

  var asyncAction = new Promise(function (resolve) {
    resolve((0, _actions.loadRequest)(action));
  }); // eslint-disable-next-line no-underscore-dangle

  asyncAction._id = _constants.REDUX_DATALOADER_ACTION_ID;
  return asyncAction;
}