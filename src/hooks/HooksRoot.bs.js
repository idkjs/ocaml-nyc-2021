'use strict';

var React = require("react");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");
var HooksPage$Reducers = require("./HooksPage.bs.js");

ReactDOMRe.renderToElementWithId(React.createElement(HooksPage$Reducers.make, {
          message: "Hello!"
        }), "index");

/*  Not a pure module */
