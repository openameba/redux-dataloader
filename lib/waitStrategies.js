"use strict";

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.parse-int");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixedWait = fixedWait;
exports.exponentialWait = exponentialWait;
exports.fibonacciWait = fibonacciWait;
exports.incrementingWait = incrementingWait;
exports.randomWait = randomWait;

/**
 * @fileOverview WaitStrategy creators inspired by [guava-retrying](https://github.com/rholder/guava-retrying)
 * @name waitStrategies.js
 * @license MIT
 */

/**
 * Returns a wait strategy that sleeps a fixed amount of time before retrying (in millisecond).
 */
function fixedWait() {
  var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function () {
    return interval;
  };
}
/**
 * Returns a strategy which sleeps for an exponential amount of time after the first failed attempt,
 * and in exponentially incrementing amounts after each failed attempt up to the maximumTime.
 */


function exponentialWait() {
  var multiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;
  return function (count) {
    var next = multiplier * Math.pow(2, count); // eslint-disable-line no-restricted-properties

    return next > max ? max : next;
  };
}
/**
 * Returns a strategy which sleeps for an increasing amount of time after the first failed attempt
 * and in Fibonacci increments after each failed attempt up to the maximumTime.
 */


function fibonacciWait() {
  var multiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;
  var cache = {
    1: 1 * multiplier,
    2: 1 * multiplier
  };

  var fabonacci = function fabonacci(count) {
    var n = count < 1 ? 1 : count;

    if (typeof cache[n] === 'number') {
      return cache[n] > max ? max : cache[n];
    }

    var result = fabonacci(n - 1) + fabonacci(n - 2);
    cache[n] = result > max ? max : result;
    return cache[n];
  };

  return fabonacci;
}
/**
 * Returns a strategy that sleeps a fixed amount of time after the first failed attempt
 * and in incrementing amounts of time after each additional failed attempt.
 */


function incrementingWait() {
  var initialSleepTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var increment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.MAX_VALUE;
  return function (count) {
    var n = count < 1 ? 0 : count - 1;
    var next = initialSleepTime + n * increment;
    return next > max ? max : next;
  };
}
/**
 * Returns a strategy that sleeps a random amount of time before retrying.
 */


function randomWait() {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function () {
    return parseInt(min + (max - min) * Math.random(), 10);
  };
}