'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");

function dogs(json) {
  var __x = Json_decode.field("message", (function (param) {
          return Json_decode.array(Json_decode.string, param);
        }), json);
  return Belt_Array.map(__x, (function (dog) {
                return dog;
              }));
}

var Decode = {
  dogs: dogs
};

function FetchExample(Props) {
  var match = React.useReducer((function (_state, action) {
          if (typeof action === "number") {
            if (action !== 0) {
              return /* Error */1;
            } else {
              return /* Loading */0;
            }
          } else {
            return /* Loaded */{
                    _0: action._0
                  };
          }
        }), /* Loading */0);
  var dispatch = match[1];
  var state = match[0];
  var dogsFetch = function (param) {
    fetch("https://dog.ceo/api/breeds/list").then(function (prim) {
              return prim.json();
            }).then(function (json) {
            var dogs$1 = dogs(json);
            return Promise.resolve(Curry._1(dispatch, /* DogsFetched */{
                            _0: dogs$1
                          }));
          }).catch(function (_err) {
          return Promise.resolve(Curry._1(dispatch, /* DogsFailedToFetch */1));
        });
    
  };
  React.useEffect((function () {
          dogsFetch(undefined);
          Curry._1(dispatch, /* DogsFetch */0);
          
        }), []);
  if (typeof state === "number") {
    if (state !== 0) {
      return React.createElement("div", undefined, "An error occurred!");
    } else {
      return React.createElement("div", undefined, "Loading...");
    }
  } else {
    return React.createElement("div", undefined, React.createElement("h1", undefined, "Dogs"), React.createElement("p", undefined, "Source: "), React.createElement("a", {
                    href: "https://dog.ceo"
                  }, "https://dog.ceo"), React.createElement("ul", undefined, Belt_Array.map(state._0, (function (dog) {
                          return React.createElement("li", {
                                      key: dog
                                    }, dog);
                        }))));
  }
}

var make = FetchExample;

exports.Decode = Decode;
exports.make = make;
/* react Not a pure module */
