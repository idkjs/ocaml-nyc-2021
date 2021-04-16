'use strict';

var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Px$Reducers = require("../utils/Px.bs.js");

var displayHeightString = Px$Reducers.i(200);

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
          Px$Reducers.f(width),
          Px$Reducers.f(left1),
          Px$Reducers.f(left2)
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
  console.log("ImageRender called");
  console.log("ImageRender args: ", phase, image1, image2);
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

exports.ImageTransition = ImageTransition;
/* displayHeightString Not a pure module */
