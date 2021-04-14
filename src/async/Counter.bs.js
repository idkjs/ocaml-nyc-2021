'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");

function Counter(Props) {
  var match = React.useReducer((function (state, action) {
          return {
                  count: state.count + 1 | 0
                };
        }), {
        count: 0
      });
  var dispatch = match[1];
  React.useEffect((function () {
          var intervalId = setInterval((function (param) {
                  return Curry._1(dispatch, /* Tick */0);
                }), 1000);
          return (function (param) {
                    clearInterval(intervalId);
                    
                  });
        }), []);
  return React.createElement("div", undefined, String(match[0].count));
}

var make = Counter;

exports.make = make;
/* react Not a pure module */
