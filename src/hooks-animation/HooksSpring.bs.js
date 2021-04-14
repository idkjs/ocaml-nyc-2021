'use strict';


var defaultSecondsPerFrame = 1 / 60;

var noWobble = {
  stiffness: 170,
  damping: 26
};

function createState(value) {
  return {
          value: value,
          velocity: 0,
          finalValue: value
        };
}

function stepper($staropt$star, speedup, $staropt$star$1, $staropt$star$2, state) {
  var finalValue = state.finalValue;
  var velocity = state.velocity;
  var value = state.value;
  var secondsPerFrame = $staropt$star !== undefined ? $staropt$star : defaultSecondsPerFrame;
  var precision = $staropt$star$1 !== undefined ? $staropt$star$1 : 0.01;
  var preset = $staropt$star$2 !== undefined ? $staropt$star$2 : noWobble;
  var secondsPerFrame$1 = speedup !== undefined ? secondsPerFrame * speedup : secondsPerFrame;
  var forceSpring = -preset.stiffness * (value - finalValue);
  var forceDamper = -preset.damping * velocity;
  var acceleration = forceSpring + forceDamper;
  var newVelocity = velocity + acceleration * secondsPerFrame$1;
  var newValue = value + newVelocity * secondsPerFrame$1;
  if (Math.abs(newVelocity) < precision && Math.abs(newValue - finalValue) < precision) {
    return {
            value: finalValue,
            velocity: 0.0,
            finalValue: state.finalValue
          };
  } else {
    return {
            value: newValue,
            velocity: newVelocity,
            finalValue: state.finalValue
          };
  }
}

function isFinished(param) {
  if (param.value === param.finalValue) {
    return param.velocity === 0;
  } else {
    return false;
  }
}

function test(param) {
  var _state = {
    value: 0.0,
    velocity: 0.0,
    finalValue: 1.0
  };
  while(true) {
    var state = _state;
    console.log(state);
    if (isFinished(state)) {
      return ;
    }
    _state = stepper(undefined, undefined, undefined, undefined, state);
    continue ;
  };
}

var defaultPrecision = 0.01;

var gentle = {
  stiffness: 120,
  damping: 14
};

var wobbly = {
  stiffness: 180,
  damping: 12
};

var stiff = {
  stiffness: 210,
  damping: 20
};

var defaultPreset = noWobble;

exports.defaultSecondsPerFrame = defaultSecondsPerFrame;
exports.defaultPrecision = defaultPrecision;
exports.noWobble = noWobble;
exports.gentle = gentle;
exports.wobbly = wobbly;
exports.stiff = stiff;
exports.defaultPreset = defaultPreset;
exports.createState = createState;
exports.stepper = stepper;
exports.isFinished = isFinished;
exports.test = test;
/* No side effect */
