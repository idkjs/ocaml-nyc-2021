'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

function defaultCallback() {
  return /* Stop */{
          _0: undefined
        };
}

function create(param) {
  return {
          id: undefined,
          callback: defaultCallback
        };
}

function onAnimationFrame(animation, param) {
  if (animation.id === undefined) {
    return ;
  }
  var match = animation.callback();
  if (!match) {
    animation.id = Caml_option.some(requestAnimationFrame(function (param) {
              return onAnimationFrame(animation, param);
            }));
    return ;
  }
  var onStop = match._0;
  if (onStop !== undefined) {
    animation.id = undefined;
    return Curry._1(onStop, undefined);
  } else {
    animation.id = undefined;
    return ;
  }
}

function start(animation) {
  animation.id = Caml_option.some(requestAnimationFrame(function (param) {
            return onAnimationFrame(animation, param);
          }));
  
}

function stop(animation) {
  var id = animation.id;
  if (id !== undefined) {
    cancelAnimationFrame(Caml_option.valFromOption(id));
    animation.id = undefined;
    return ;
  }
  
}

function setCallback(animation, callback) {
  stop(animation);
  animation.callback = callback;
  
}

function isActive(animation) {
  return animation.id !== undefined;
}

exports.create = create;
exports.isActive = isActive;
exports.setCallback = setCallback;
exports.start = start;
exports.stop = stop;
/* No side effect */
