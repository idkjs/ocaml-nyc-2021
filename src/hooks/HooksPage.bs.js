'use strict';

var React = require("react");

function handleClick(_event) {
  console.log("clicked!");
  
}

function HooksPage(Props) {
  var message = Props.message;
  React.useEffect(function () {
        console.log("Hey!");
        
      });
  return React.createElement("button", {
              onClick: handleClick
            }, message);
}

var make = HooksPage;

exports.handleClick = handleClick;
exports.make = make;
/* react Not a pure module */
