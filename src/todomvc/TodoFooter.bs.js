'use strict';

var React = require("react");
var ReasonReactRouter = require("reason-react/src/ReasonReactRouter.bs.js");

function push(path, $$event) {
  $$event.preventDefault();
  return ReasonReactRouter.push("#" + path);
}

function TodoFooter(Props) {
  var count = Props.count;
  var completedCount = Props.completedCount;
  var nowShowing = Props.nowShowing;
  var onClearCompleted = Props.onClearCompleted;
  var activeTodoWord = count === 1 ? "item" : "items";
  var clearButton = completedCount > 0 ? React.createElement("button", {
          className: "clear-completed",
          onClick: onClearCompleted
        }, "Clear completed") : null;
  var match;
  switch (nowShowing) {
    case /* AllTodos */0 :
        match = [
          "selected",
          "",
          ""
        ];
        break;
    case /* ActiveTodos */1 :
        match = [
          "",
          "selected",
          ""
        ];
        break;
    case /* CompletedTodos */2 :
        match = [
          "",
          "",
          "selected"
        ];
        break;
    
  }
  return React.createElement("footer", {
              className: "footer"
            }, React.createElement("span", {
                  className: "todo-count"
                }, React.createElement("strong", undefined, String(count)), " " + (activeTodoWord + " left")), React.createElement("ul", {
                  className: "filters"
                }, React.createElement("li", undefined, React.createElement("a", {
                          className: match[0],
                          onClick: (function (param) {
                              return push("", param);
                            })
                        }, "All")), " ", React.createElement("li", undefined, React.createElement("a", {
                          className: match[1],
                          onClick: (function (param) {
                              return push("active", param);
                            })
                        }, "Active")), " ", React.createElement("li", undefined, React.createElement("a", {
                          className: match[2],
                          onClick: (function (param) {
                              return push("completed", param);
                            })
                        }, "Completed"))), clearButton);
}

var make = TodoFooter;

exports.push = push;
exports.make = make;
/* react Not a pure module */
