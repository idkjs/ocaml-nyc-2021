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

function AnimatedButton$Text(Props) {
  var text = Props.text;
  return React.createElement("button", undefined, text);
}

var $$Text = {
  make: AnimatedButton$Text
};

function AnimatedButton(Props) {
  var textOpt = Props.text;
  var rAction = Props.rAction;
  var animateMountOpt = Props.animateMount;
  var onClose = Props.onClose;
  var text = textOpt !== undefined ? textOpt : "Button";
  var animateMount = animateMountOpt !== undefined ? animateMountOpt : true;
  var match = React.useState(function () {
        return {
                animation: HooksSpringAnimation$Reducers.create(250),
                width: 250,
                size: /* Small */0,
                clickCount: 0,
                actionCount: 0
              };
      });
  var setState = match[1];
  var state = match[0];
  var match$1 = React.useReducer((function (param, action) {
          if (typeof action === "number") {
            switch (action) {
              case /* Click */0 :
                  Curry._1(setState, (function (param) {
                          return {
                                  animation: state.animation,
                                  width: state.width,
                                  size: state.size,
                                  clickCount: state.clickCount + 1 | 0,
                                  actionCount: state.actionCount + 1 | 0
                                };
                        }));
                  return state;
              case /* Reset */1 :
                  Curry._1(setState, (function (param) {
                          return {
                                  animation: state.animation,
                                  width: state.width,
                                  size: state.size,
                                  clickCount: 0,
                                  actionCount: state.actionCount + 1 | 0
                                };
                        }));
                  return state;
              case /* Unclick */2 :
                  Curry._1(setState, (function (param) {
                          return {
                                  animation: state.animation,
                                  width: state.width,
                                  size: state.size,
                                  clickCount: state.clickCount - 1 | 0,
                                  actionCount: state.actionCount + 1 | 0
                                };
                        }));
                  return state;
              case /* ToggleSize */3 :
                  Curry._1(setState, (function (param) {
                          return {
                                  animation: state.animation,
                                  width: state.width,
                                  size: state.size === /* Small */0 ? /* Large */1 : /* Small */0,
                                  clickCount: state.clickCount,
                                  actionCount: state.actionCount
                                };
                        }));
                  return state;
              case /* Close */4 :
                  var arg = Caml_option.some(onClose);
                  var arg$1 = function (w) {
                    return Curry._1(setState, (function (param) {
                                  return {
                                          animation: state.animation,
                                          width: w | 0,
                                          size: state.size,
                                          clickCount: state.clickCount,
                                          actionCount: state.actionCount
                                        };
                                }));
                  };
                  var arg$2 = 50;
                  var arg$3 = function (param) {
                    return Curry._6(HooksSpringAnimation$Reducers.setOnChange, param, 0.3, 10, arg, arg$1, arg$2);
                  };
                  Curry._1(arg$3(undefined), state.animation);
                  return state;
              
            }
          } else {
            var width = action._0;
            Curry._1(setState, (function (param) {
                    return {
                            animation: state.animation,
                            width: width,
                            size: state.size,
                            clickCount: state.clickCount,
                            actionCount: state.actionCount
                          };
                  }));
            return state;
          }
        }), state);
  var dispatch = match$1[1];
  React.useEffect((function () {
          HooksRemoteAction$Reducers.subscribe(dispatch, rAction);
          if (animateMount) {
            Curry._1(dispatch, /* ToggleSize */3);
          }
          return (function (param) {
                    return HooksSpringAnimation$Reducers.stop(state.animation);
                  });
        }), [state]);
  var buttonLabel = function (state) {
    return text + (" clicks:" + (String(state.clickCount) + (" actions:" + String(state.actionCount))));
  };
  return React.createElement("div", {
              className: "exampleButton large",
              style: {
                width: String(state.width) + "px"
              },
              onClick: (function (_e) {
                  return Curry._1(dispatch, /* Click */0);
                })
            }, React.createElement(AnimatedButton$Text, {
                  text: buttonLabel(state)
                }));
}

var targetHeight = 30;

var closeWidth = 50;

var smallWidth = 250;

var largeWidth = 450;

var make = AnimatedButton;

exports.pxI = pxI;
exports.pxF = pxF;
exports.$$Text = $$Text;
exports.targetHeight = targetHeight;
exports.closeWidth = closeWidth;
exports.smallWidth = smallWidth;
exports.largeWidth = largeWidth;
exports.make = make;
/* react Not a pure module */
