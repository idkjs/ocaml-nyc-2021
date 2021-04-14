'use strict';

var React = require("react");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");
var Counter$Reducers = require("./Counter.bs.js");

ReactDOMRe.renderToElementWithId(React.createElement(Counter$Reducers.make, {}), "index");

/*  Not a pure module */
