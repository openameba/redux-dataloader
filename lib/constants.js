"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REDUX_DATALOADER_ACTION_ID = exports.DEFAULT_OPTIONS = void 0;

var _waitStrategies = require("./waitStrategies");

var DEFAULT_OPTIONS = {
  ttl: 10000,
  // Default TTL: 10s
  retryTimes: 1,
  retryWait: (0, _waitStrategies.fixedWait)(0)
};
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

var REDUX_DATALOADER_ACTION_ID = function REDUX_DATALOADER_ACTION_ID() {};

exports.REDUX_DATALOADER_ACTION_ID = REDUX_DATALOADER_ACTION_ID;