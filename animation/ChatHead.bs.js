'use strict';

var React = require("react");
var RemoteAction$ReasonReactExample = require("./RemoteAction.bs.js");
var ImageGalleryAnimation$ReasonReactExample = require("../hooks-animation/ImageGalleryAnimation.bs.js");

function pxI(i) {
  return String(i) + "px";
}

function pxF(v) {
  return String(v | 0) + "px";
}

function ChatHead(Props) {
  var rAction = Props.rAction;
  var headNum = Props.headNum;
  var imageGallery = Props.imageGallery;
  var match = React.useReducer((function (state, action) {
          if (action.TAG === /* MoveX */0) {
            return {
                    x: action._0,
                    y: state.y
                  };
          } else {
            return {
                    x: state.x,
                    y: action._0
                  };
          }
        }), {
        x: 0,
        y: 0
      });
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          RemoteAction$ReasonReactExample.subscribe(dispatch, rAction);
          
        }), []);
  var left = String(state.x - 25 | 0) + "px";
  var top = String(state.y - 25 | 0) + "px";
  if (imageGallery) {
    return React.createElement("div", {
                className: "chat-head-image-gallery",
                style: {
                  left: left,
                  top: top,
                  zIndex: String(-headNum | 0)
                }
              }, React.createElement(ImageGalleryAnimation$ReasonReactExample.make, {
                    initialImage: headNum
                  }));
  } else {
    return React.createElement("div", {
                className: "chat-head chat-head-" + String(headNum % 6),
                style: {
                  left: left,
                  top: top,
                  zIndex: String(-headNum | 0)
                }
              });
  }
}

var make = ChatHead;

exports.pxI = pxI;
exports.pxF = pxF;
exports.make = make;
/* react Not a pure module */
