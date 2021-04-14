'use strict';

var React = require("react");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");
var Reanimate$ReasonReactExample = require("./Reanimate.bs.js");

ReactDOMRe.renderToElementWithId(React.createElement(Reanimate$ReasonReactExample.ComponentGallery.make, {}), "index");

/*  Not a pure module */
