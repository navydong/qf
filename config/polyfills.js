'use strict';

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
require('whatwg-fetch');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// 解决兼容插入
if(String.prototype.startsWith == undefined){
  const startsWith = require('core-js/library/fn/string/starts-with')
  Object.defineProperty(String.prototype, 'startsWith', startsWith)
}
if(Array.prototype.includes == undefined){
  const includes = require('core-js/library/fn/array/includes')
  Object.defineProperty(Array.prototype, 'includes', includes)
}