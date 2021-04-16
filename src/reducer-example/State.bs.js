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

exports.createButton = createButton;
exports.createImage = createImage;
exports.getElements = getElements;
exports.initial = initial;
/* react Not a pure module */
