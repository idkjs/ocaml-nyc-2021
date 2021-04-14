'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var HooksSpringAnimation$Reducers = require("./HooksSpringAnimation.bs.js");

function pxI(i) {
  return String(i) + "px";
}

function pxF(v) {
  return String(v | 0) + "px";
}

var displayHeightString = String(200) + "px";

var sizes = [
  [
    500,
    350
  ],
  [
    800,
    600
  ],
  [
    800,
    400
  ],
  [
    700,
    500
  ],
  [
    200,
    650
  ],
  [
    600,
    600
  ]
];

var displayWidths = Belt_Array.map(sizes, (function (param) {
        return Caml_int32.div(Math.imul(param[0], 200), param[1]);
      }));

function getWidth(i) {
  return Caml_array.get(displayWidths, (i + 6 | 0) % 6);
}

function interpolate(width1, width2, phase) {
  var width1$1 = width1;
  var width2$1 = width2;
  var width = width1$1 * (1 - phase) + width2$1 * phase;
  var left1 = -(width1$1 * phase);
  var left2 = left1 + width1$1;
  return [
          String(width | 0) + "px",
          String(left1 | 0) + "px",
          String(left2 | 0) + "px"
        ];
}

function renderImage(left, i) {
  var src = "./" + (String((i + 6 | 0) % 6) + ".jpg");
  console.log("src: " + src);
  return React.createElement("img", {
              className: "photo-inner",
              style: {
                height: displayHeightString,
                left: left
              },
              src: "./" + (String((i + 6 | 0) % 6) + ".jpg")
            });
}

function render(phase, image1, image2) {
  var width1 = getWidth(image1);
  var width2 = getWidth(image2);
  var match = interpolate(width1, width2, phase);
  return React.createElement("div", undefined, React.createElement("div", {
                  className: "photo-outer",
                  style: {
                    height: displayHeightString,
                    width: match[0]
                  }
                }, renderImage(match[1], image1), renderImage(match[2], image2)));
}

var ImageTransition = {
  render: render,
  displayHeight: 200
};

function ImageGalleryAnimation(Props) {
  var initialImageOpt = Props.initialImage;
  var animateMountOpt = Props.animateMount;
  var initialImage = initialImageOpt !== undefined ? initialImageOpt : 0;
  var animateMount = animateMountOpt !== undefined ? animateMountOpt : true;
  var match = React.useReducer((function (state, action) {
          if (action) {
            return {
                    animation: state.animation,
                    cursor: action._0,
                    targetImage: state.targetImage
                  };
          } else {
            HooksSpringAnimation$Reducers.setFinalValue(state.targetImage, state.animation);
            return {
                    animation: state.animation,
                    cursor: state.cursor,
                    targetImage: state.targetImage + 1 | 0
                  };
          }
        }), {
        animation: HooksSpringAnimation$Reducers.create(initialImage),
        cursor: initialImage,
        targetImage: initialImage
      });
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var arg = function (cursor) {
            return Curry._1(dispatch, /* SetCursor */{
                        _0: cursor
                      });
          };
          var arg$1 = function (param, param$1, param$2) {
            return Curry._5(HooksSpringAnimation$Reducers.setOnChange, param, param$1, 0.05, param$2, arg);
          };
          Curry._2(arg$1(undefined, undefined, undefined), undefined, state.animation);
          if (animateMount) {
            Curry._1(dispatch, /* Click */0);
          }
          return (function (param) {
                    return HooksSpringAnimation$Reducers.stop(state.animation);
                  });
        }), [state]);
  var cursor = state.cursor;
  var image = cursor | 0;
  var phase = cursor - image;
  return React.createElement("div", {
              onClick: (function (_e) {
                  return Curry._1(dispatch, /* Click */0);
                })
            }, render(phase, image, image + 1 | 0));
}

var SpringAnimation;

var Spring;

var Animation;

var RemoteAction;

var make = ImageGalleryAnimation;

exports.SpringAnimation = SpringAnimation;
exports.Spring = Spring;
exports.Animation = Animation;
exports.RemoteAction = RemoteAction;
exports.pxI = pxI;
exports.pxF = pxF;
exports.ImageTransition = ImageTransition;
exports.make = make;
/* displayHeightString Not a pure module */
