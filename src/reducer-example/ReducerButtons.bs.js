'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Key$Reducers = require("../utils/Key.bs.js");
var AnimateHeight$Reducers = require("../hooks-animation/AnimateHeight.bs.js");
var AnimatedButton$Reducers = require("../hooks-animation/AnimatedButton.bs.js");
var HooksAnimation$Reducers = require("../hooks-animation/HooksAnimation.bs.js");
var ImageTransition$Reducers = require("./ImageTransition.bs.js");
var HooksRemoteAction$Reducers = require("../hooks-animation/HooksRemoteAction.bs.js");
var ImageGalleryAnimation$Reducers = require("../hooks-animation/ImageGalleryAnimation.bs.js");

function initial(param) {
  return {
          act: (function (_action) {
              
            }),
          randomAnimation: HooksAnimation$Reducers.create(undefined),
          items: /* [] */0
        };
}

function getElements(param) {
  return Belt_List.toArray(Belt_List.mapReverse(param.items, (function (x) {
                    return x.element;
                  })));
}

function createButton(removeFromList, animateMount, number) {
  var rActionButton = HooksRemoteAction$Reducers.create(undefined);
  var rActionHeight = HooksRemoteAction$Reducers.create(undefined);
  var key = Key$Reducers.gen(undefined);
  var onClose = function (param) {
    return HooksRemoteAction$Reducers.send(rActionHeight, {
                TAG: /* Close */2,
                _0: (function (param) {
                    return Curry._1(removeFromList, rActionHeight);
                  })
              });
  };
  var tmp = {
    text: "Button#" + String(number),
    rAction: rActionButton,
    onClose: onClose,
    key: key
  };
  if (animateMount !== undefined) {
    tmp.animateMount = Caml_option.valFromOption(animateMount);
  }
  var element = React.createElement(AnimateHeight$Reducers.make, {
        rAction: rActionHeight,
        targetHeight: AnimatedButton$Reducers.targetHeight,
        children: React.createElement(AnimatedButton$Reducers.make, tmp),
        key: key
      });
  return {
          element: element,
          rActionButton: rActionButton,
          rActionHeight: rActionHeight,
          closing: false
        };
}

function createImage(animateMount, number) {
  var key = Key$Reducers.gen(undefined);
  var rActionButton = HooksRemoteAction$Reducers.create(undefined);
  var tmp = {
    initialImage: number,
    key: Key$Reducers.gen(undefined)
  };
  if (animateMount !== undefined) {
    tmp.animateMount = Caml_option.valFromOption(animateMount);
  }
  var imageGalleryAnimation = React.createElement(ImageGalleryAnimation$Reducers.make, tmp);
  var rActionHeight = HooksRemoteAction$Reducers.create(undefined);
  var element = React.createElement(AnimateHeight$Reducers.make, {
        rAction: rActionHeight,
        targetHeight: ImageTransition$Reducers.ImageTransition.displayHeight,
        children: imageGalleryAnimation,
        key: key
      });
  return {
          element: element,
          rActionButton: rActionButton,
          rActionHeight: rActionHeight,
          closing: false
        };
}

var State = {
  createButton: createButton,
  createImage: createImage,
  getElements: getElements,
  initial: initial
};

function runAll(action, items) {
  return Belt_List.forEach(items, (function (param) {
                return HooksRemoteAction$Reducers.send(param.rActionButton, action);
              }));
}

function make(Props) {
  var showAllButtons = Props.showAllButtons;
  var self = function (key) {
    return React.createElement(make, {
                showAllButtons: showAllButtons,
                key: key
              });
  };
  var match = React.useState(function () {
        return initial(undefined);
      });
  var setState = match[1];
  var state = match[0];
  var handleAddSelf = function (param) {
    var key = Key$Reducers.gen(undefined);
    var rActionButton = HooksRemoteAction$Reducers.create(undefined);
    var rActionHeight = HooksRemoteAction$Reducers.create(undefined);
    var element = React.createElement(AnimateHeight$Reducers.make, {
          rAction: rActionHeight,
          targetHeight: 500,
          children: null,
          key: key
        }, "Items:" + String(Belt_List.length(state.items)), self(key));
    var item = {
      element: element,
      rActionButton: rActionButton,
      rActionHeight: rActionHeight,
      closing: false
    };
    return Curry._1(setState, (function (param) {
                  return {
                          act: state.act,
                          randomAnimation: state.randomAnimation,
                          items: {
                            hd: item,
                            tl: state.items
                          }
                        };
                }));
  };
  var button = function (repeatOpt, hideOpt, txt, fn) {
    var repeat = repeatOpt !== undefined ? repeatOpt : 1;
    var hide = hideOpt !== undefined ? hideOpt : false;
    if (hide) {
      return null;
    } else {
      return React.createElement("div", {
                  className: "exampleButton large",
                  style: {
                    width: "220px"
                  },
                  onClick: (function (_e) {
                      for(var _for = 1; _for <= repeat; ++_for){
                        Curry._1(state.act, fn);
                      }
                      
                    })
                }, txt);
    }
  };
  return React.createElement("div", {
              className: "componentBox"
            }, React.createElement("div", {
                  className: "componentColumn"
                }, "Control:", button(undefined, undefined, "Add Self", handleAddSelf(undefined))), React.createElement("div", {
                  className: "componentColumn",
                  style: {
                    width: "500px"
                  }
                }, React.createElement("div", undefined, "Items:" + String(Belt_List.length(state.items))), getElements(state)));
}

var ImageTransition = ImageTransition$Reducers.ImageTransition;

exports.ImageTransition = ImageTransition;
exports.State = State;
exports.runAll = runAll;
exports.make = make;
/* react Not a pure module */
