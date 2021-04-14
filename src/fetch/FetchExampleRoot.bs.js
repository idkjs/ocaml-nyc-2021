'use strict';

var React = require("react");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");
var FetchExample$Reducers = require("./FetchExample.bs.js");

ReactDOMRe.renderToElementWithId(React.createElement(FetchExample$Reducers.make, {}), "index");

/*  Not a pure module */
