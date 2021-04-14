'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var HooksRemoteAction$Reducers = require("./HooksRemoteAction.bs.js");
var HooksSpringAnimation$Reducers = require("./HooksSpringAnimation.bs.js");

function pxI(i) {
  return String(i) + "px";
}

function pxF(v) {
  return String(v | 0) + "px";
}

function AnimateHeight(Props) {
  var rAction = Props.rAction;
  var targetHeight = Props.targetHeight;
  var children = Props.children;
  var match = React.useState(function () {
        return {
                height: 0,
                animation: HooksSpringAnimation$Reducers.create(0)
              };
      });
  var setState = match[1];
  var state = match[0];
  var animate = function (finalValue, onStop) {
    var arg = Caml_option.some(onStop);
    var arg$1 = function (h) {
      return Curry._1(setState, (function (param) {
                    return {
                            height: h,
                            animation: state.animation
                          };
                  }));
    };
    var arg$2 = finalValue;
    var arg$3 = function (param, param$1) {
      return Curry._6(HooksSpringAnimation$Reducers.setOnChange, param, param$1, 10, arg, arg$1, arg$2);
    };
    return Curry._1(arg$3(undefined, undefined), state.animation);
  };
  var match$1 = React.useReducer((function (param, action) {
          switch (action.TAG | 0) {
            case /* Open */0 :
                animate(targetHeight, action._0);
                return state;
            case /* BeginClosing */1 :
                var onBeginClosing = action._0;
                if (onBeginClosing !== undefined) {
                  Curry._1(onBeginClosing, undefined);
                }
                animate(0, action._1);
                return state;
            case /* Close */2 :
                animate(0, action._0);
                return state;
            case /* Animate */3 :
                animate(action._0, action._1);
                return state;
            case /* Height */4 :
                var v = action._0;
                Curry._1(setState, (function (param) {
                        return {
                                height: v,
                                animation: state.animation
                              };
                      }));
                return state;
            
          }
        }), state);
  var dispatch = match$1[1];
  React.useEffect((function () {
          HooksRemoteAction$Reducers.subscribe(dispatch, rAction);
          return (function (param) {
                    return Curry._1(dispatch, {
                                TAG: /* Animate */3,
                                _0: targetHeight,
                                _1: undefined
                              });
                  });
        }), [state]);
  return React.createElement("div", {
              style: {
                height: String(state.height | 0) + "px",
                overflow: "hidden"
              }
            }, children);
}

var SpringAnimation;

var Animation;

var make = AnimateHeight;

exports.SpringAnimation = SpringAnimation;
exports.Animation = Animation;
exports.pxI = pxI;
exports.pxF = pxF;
exports.make = make;
/* react Not a pure module */
