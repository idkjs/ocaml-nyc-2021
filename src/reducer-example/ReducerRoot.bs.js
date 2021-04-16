'use strict';

var React = require("react");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");
var AnimationExample$Reducers = require("./AnimationExample.bs.js");

ReactDOMRe.renderToElementWithId(React.createElement("div", undefined, React.createElement(AnimationExample$Reducers.make, {
              showAllButtons: false
            })), "index");

/*  Not a pure module */
