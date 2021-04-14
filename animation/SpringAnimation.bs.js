'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Spring$ReasonReactExample = require("./Spring.bs.js");
var Animation$ReasonReactExample = require("./Animation.bs.js");

function create(initialValue) {
  var animation = Animation$ReasonReactExample.create(undefined);
  var state = Spring$ReasonReactExample.createState(initialValue);
  return {
          animation: animation,
          state: state
        };
}

function setOnChange(preset, speedup, precision, onStopOpt, onChange, finalValue, a) {
  var onStop = onStopOpt !== undefined ? Caml_option.valFromOption(onStopOpt) : undefined;
  var callback = function () {
    a.state = Spring$ReasonReactExample.stepper(undefined, speedup, precision, preset, a.state);
    var isFinished = Spring$ReasonReactExample.isFinished(a.state);
    Curry._1(onChange, a.state.value);
    if (isFinished) {
      return /* Stop */{
              _0: onStop
            };
    } else {
      return /* Continue */0;
    }
  };
  Animation$ReasonReactExample.stop(a.animation);
  Animation$ReasonReactExample.setCallback(a.animation, callback);
  if (finalValue === undefined) {
    return ;
  }
  var init = a.state;
  a.state = {
    value: init.value,
    velocity: init.velocity,
    finalValue: finalValue
  };
  return Animation$ReasonReactExample.start(a.animation);
}

function setFinalValue(finalValue, a) {
  Animation$ReasonReactExample.stop(a.animation);
  var init = a.state;
  a.state = {
    value: init.value,
    velocity: init.velocity,
    finalValue: finalValue
  };
  return Animation$ReasonReactExample.start(a.animation);
}

function stop(a) {
  return Animation$ReasonReactExample.stop(a.animation);
}

exports.create = create;
exports.setOnChange = setOnChange;
exports.setFinalValue = setFinalValue;
exports.stop = stop;
/* No side effect */
