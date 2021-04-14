'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var ChatHeadsExample$ReasonReactExample = require("./ChatHeadsExample.bs.js");

function ChatHeadsExampleStarter(Props) {
  var match = React.useState(function () {
        return /* StartMessage */0;
      });
  var actionIsState = match[1];
  switch (match[0]) {
    case /* StartMessage */0 :
        return React.createElement("div", undefined, React.createElement("div", undefined, React.createElement("button", {
                            onClick: (function (_e) {
                                return Curry._1(actionIsState, (function (param) {
                                              return /* ChatHeads */1;
                                            }));
                              })
                          }, "Start normal chatheads")), React.createElement("button", {
                        onClick: (function (_e) {
                            return Curry._1(actionIsState, (function (param) {
                                          return /* ImageGalleryHeads */2;
                                        }));
                          })
                      }, "Start image gallery chatheads"));
    case /* ChatHeads */1 :
        return React.createElement(ChatHeadsExample$ReasonReactExample.make, {
                    imageGallery: false
                  });
    case /* ImageGalleryHeads */2 :
        return React.createElement(ChatHeadsExample$ReasonReactExample.make, {
                    imageGallery: true
                  });
    
  }
}

var make = ChatHeadsExampleStarter;

exports.make = make;
/* react Not a pure module */
