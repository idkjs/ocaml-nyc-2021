'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var HooksSpring$Reducers = require("./HooksSpring.bs.js");
var HooksAnimation$Reducers = require("./HooksAnimation.bs.js");

function create(initialValue) {
  var animation = HooksAnimation$Reducers.create(undefined);
  var state = HooksSpring$Reducers.createState(initialValue);
  return {
          animation: animation,
          state: state
        };
}

function setOnChange(preset, speedup, precision, onStopOpt, onChange, finalValue, a) {
  var onStop = onStopOpt !== undefined ? Caml_option.valFromOption(onStopOpt) : undefined;
  var callback = function () {
    a.state = HooksSpring$Reducers.stepper(undefined, speedup, precision, preset, a.state);
    var isFinished = HooksSpring$Reducers.isFinished(a.state);
    Curry._1(onChange, a.state.value);
    if (isFinished) {
      return /* Stop */{
              _0: onStop
            };
    } else {
      return /* Continue */0;
    }
  };
  HooksAnimation$Reducers.stop(a.animation);
  HooksAnimation$Reducers.setCallback(a.animation, callback);
  if (finalValue === undefined) {
    return ;
  }
  var init = a.state;
  a.state = {
    value: init.value,
    velocity: init.velocity,
    finalValue: finalValue
  };
  return HooksAnimation$Reducers.start(a.animation);
}

function setFinalValue(finalValue, a) {
  HooksAnimation$Reducers.stop(a.animation);
  var init = a.state;
  a.state = {
    value: init.value,
    velocity: init.velocity,
    finalValue: finalValue
  };
  return HooksAnimation$Reducers.start(a.animation);
}

function stop(a) {
  return HooksAnimation$Reducers.stop(a.animation);
}

exports.create = create;
exports.setOnChange = setOnChange;
exports.setFinalValue = setFinalValue;
exports.stop = stop;
/* No side effect */
