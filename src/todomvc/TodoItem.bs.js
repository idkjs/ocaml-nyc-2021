'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var $$String = require("bs-platform/lib/js/string.js");

function TodoItem(Props) {
  var todo = Props.todo;
  var editing = Props.editing;
  var onDestroy = Props.onDestroy;
  var onSave = Props.onSave;
  var onEdit = Props.onEdit;
  var onToggle = Props.onToggle;
  var onCancel = Props.onCancel;
  var submitHelper = function (state) {
    var nonEmptyValue = $$String.trim(state.editText);
    if (nonEmptyValue === "") {
      Curry._1(onDestroy, undefined);
      return state;
    }
    Curry._1(onSave, nonEmptyValue);
    return {
            editText: nonEmptyValue,
            editing: state.editing,
            editFieldRef: state.editFieldRef
          };
  };
  var match = React.useReducer((function (state, action) {
          if (typeof action === "number") {
            if (action === /* Edit */0) {
              return {
                      editText: todo.title,
                      editing: state.editing,
                      editFieldRef: state.editFieldRef
                    };
            } else {
              return submitHelper(state);
            }
          }
          if (action.TAG !== /* KeyDown */0) {
            if (state.editing) {
              return {
                      editText: action._0,
                      editing: state.editing,
                      editFieldRef: state.editFieldRef
                    };
            } else {
              return state;
            }
          }
          var match = action._0;
          if (match !== 13) {
            if (match !== 27) {
              return state;
            } else {
              Curry._1(onCancel, undefined);
              return {
                      editText: todo.title,
                      editing: state.editing,
                      editFieldRef: state.editFieldRef
                    };
            }
          } else {
            return submitHelper(state);
          }
        }), {
        editText: todo.title,
        editing: editing,
        editFieldRef: {
          contents: undefined
        }
      });
  var dispatch = match[1];
  var editFieldRef = React.useRef(null);
  var className = $$String.concat(" ", {
        hd: todo.completed ? "completed" : "",
        tl: {
          hd: editing ? "editing" : "",
          tl: /* [] */0
        }
      });
  return React.createElement("li", {
              className: className
            }, React.createElement("div", {
                  className: "view"
                }, React.createElement("input", {
                      className: "toggle",
                      checked: todo.completed,
                      type: "checkbox",
                      onChange: (function (param) {
                          return Curry._1(onToggle, undefined);
                        })
                    }), React.createElement("label", {
                      onDoubleClick: (function (_event) {
                          Curry._1(onEdit, undefined);
                          return Curry._1(dispatch, /* Edit */0);
                        })
                    }, todo.title), React.createElement("button", {
                      className: "destroy",
                      onClick: (function (param) {
                          return Curry._1(onDestroy, undefined);
                        })
                    })), React.createElement("input", {
                  ref: editFieldRef,
                  className: "edit",
                  value: match[0].editText,
                  onKeyDown: (function ($$event) {
                      return Curry._1(dispatch, {
                                  TAG: /* KeyDown */0,
                                  _0: $$event.which
                                });
                    }),
                  onBlur: (function (_event) {
                      return Curry._1(dispatch, /* Submit */1);
                    }),
                  onChange: (function ($$event) {
                      return Curry._1(dispatch, {
                                  TAG: /* Change */1,
                                  _0: $$event.target.value
                                });
                    })
                }));
}

var make = TodoItem;

exports.make = make;
/* react Not a pure module */
