'use strict';

var React = require("react");

function Button(Props) {
  var hideOpt = Props.hide;
  var title = Props.title;
  var hide = hideOpt !== undefined ? hideOpt : false;
  if (hide) {
    return null;
  } else {
    return React.createElement("div", {
                className: "exampleButton large",
                style: {
                  width: "220px"
                },
                onClick: (function (e) {
                    console.log(e);
                    
                  })
              }, title);
  }
}

var make = Button;

exports.make = make;
/* react Not a pure module */
