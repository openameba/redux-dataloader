"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFailure = loadFailure;
exports.loadSuccess = loadSuccess;
exports.loadRequest = loadRequest;
exports.LOAD_DATA_FAILURE_ACTION = exports.LOAD_DATA_SUCCESS_ACTION = exports.LOAD_DATA_REQUEST_ACTION = void 0;

var _utils = require("./utils");

var LOAD_DATA_REQUEST_ACTION = '@redux-dataloader/REQUEST';
exports.LOAD_DATA_REQUEST_ACTION = LOAD_DATA_REQUEST_ACTION;
var LOAD_DATA_SUCCESS_ACTION = '@redux-dataloader/SUCCESS';
exports.LOAD_DATA_SUCCESS_ACTION = LOAD_DATA_SUCCESS_ACTION;
var LOAD_DATA_FAILURE_ACTION = '@redux-dataloader/FAILURE';
exports.LOAD_DATA_FAILURE_ACTION = LOAD_DATA_FAILURE_ACTION;

function loadFailure(action, error) {
  return {
    type: LOAD_DATA_FAILURE_ACTION,
    payload: {
      error: (0, _utils.formatError)(error)
    },
    meta: {
      action: action
    },
    error: true
  };
}

function loadSuccess(action, data) {
  return {
    type: LOAD_DATA_SUCCESS_ACTION,
    payload: {
      data: data
    },
    meta: {
      action: action
    }
  };
}
/**
 * Loading action with redux-dataloader
 *
 * @param {Object} action
 * @return {Object} Loading Data Action
 */


function loadRequest(action, options) {
  var result = {
    type: LOAD_DATA_REQUEST_ACTION,
    meta: {
      action: action
    }
  };

  if (options) {
    result.meta.options = options;
  }

  return result;
}