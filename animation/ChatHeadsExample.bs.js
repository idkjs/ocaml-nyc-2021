'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Key$ReasonReactExample = require("../utils/Key.bs.js");
var Spring$ReasonReactExample = require("./Spring.bs.js");
var ChatHead$ReasonReactExample = require("./ChatHead.bs.js");
var RemoteAction$ReasonReactExample = require("./RemoteAction.bs.js");
var SpringAnimation$ReasonReactExample = require("./SpringAnimation.bs.js");

function createControl(param) {
  return {
          rAction: RemoteAction$ReasonReactExample.create(undefined),
          animX: SpringAnimation$ReasonReactExample.create(0),
          animY: SpringAnimation$ReasonReactExample.create(0)
        };
}

function ChatHeadsExample(Props) {
  var imageGallery = Props.imageGallery;
  var match = React.useState(function () {
        var controls = Belt_Array.makeBy(6, (function (param) {
                return createControl(undefined);
              }));
        var chatHeads = Belt_Array.makeBy(6, (function (i) {
                return React.createElement(ChatHead$ReasonReactExample.make, {
                            rAction: Caml_array.get(controls, i).rAction,
                            headNum: i,
                            imageGallery: imageGallery,
                            key: Key$ReasonReactExample.gen(undefined)
                          });
              }));
        return {
                controls: controls,
                chatHeads: chatHeads
              };
      });
  var state = match[0];
  React.useEffect((function () {
          var controls = state.controls;
          Belt_Array.forEachWithIndex(controls, (function (i, param) {
                  var setOnChange = function (isX, afterChange) {
                    var control = Caml_array.get(controls, i);
                    var animation = isX ? control.animX : control.animY;
                    var arg = function (v) {
                      RemoteAction$ReasonReactExample.send(control.rAction, isX ? ({
                                TAG: /* MoveX */0,
                                _0: v
                              }) : ({
                                TAG: /* MoveY */1,
                                _0: v
                              }));
                      return Curry._1(afterChange, v);
                    };
                    var arg$1 = function (param, param$1) {
                      return Curry._5(SpringAnimation$ReasonReactExample.setOnChange, Spring$ReasonReactExample.gentle, 2, param, param$1, arg);
                    };
                    return Curry._2(arg$1(undefined, undefined), undefined, animation);
                  };
                  var isLastHead = i === 5;
                  var afterChangeX = function (x) {
                    if (isLastHead) {
                      return ;
                    } else {
                      return SpringAnimation$ReasonReactExample.setFinalValue(x, Caml_array.get(controls, i + 1 | 0).animX);
                    }
                  };
                  var afterChangeY = function (y) {
                    if (isLastHead) {
                      return ;
                    } else {
                      return SpringAnimation$ReasonReactExample.setFinalValue(y, Caml_array.get(controls, i + 1 | 0).animY);
                    }
                  };
                  setOnChange(true, afterChangeX);
                  return setOnChange(false, afterChangeY);
                }));
          var onMove = function (e) {
            var x = e.pageX;
            var y = e.pageY;
            SpringAnimation$ReasonReactExample.setFinalValue(x, Caml_array.get(controls, 0).animX);
            return SpringAnimation$ReasonReactExample.setFinalValue(y, Caml_array.get(controls, 0).animY);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("touchmove", onMove);
          return (function (param) {
                    return Belt_Array.forEach(controls, (function (param) {
                                  SpringAnimation$ReasonReactExample.stop(param.animX);
                                  return SpringAnimation$ReasonReactExample.stop(param.animY);
                                }));
                  });
        }), [state]);
  return React.createElement("div", undefined, state.chatHeads);
}

var numHeads = 6;

var make = ChatHeadsExample;

exports.numHeads = numHeads;
exports.createControl = createControl;
exports.make = make;
/* react Not a pure module */
