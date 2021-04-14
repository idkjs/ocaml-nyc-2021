'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var $$String = require("bs-platform/lib/js/string.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var ReactDOMRe = require("reason-react/src/legacy/ReactDOMRe.bs.js");
var ReasonReactRouter = require("reason-react/src/ReasonReactRouter.bs.js");
var TodoItem$Reducers = require("./TodoItem.bs.js");
var TodoFooter$Reducers = require("./TodoFooter.bs.js");

var localStorageNamespace = "reason-react-todos";

function saveLocally(todos) {
  var stringifiedTodos = JSON.stringify(todos);
  if (stringifiedTodos !== undefined) {
    localStorage.setItem(localStorageNamespace, stringifiedTodos);
    return ;
  }
  
}

function urlToShownPage(hash) {
  switch (hash) {
    case "active" :
        return /* ActiveTodos */1;
    case "completed" :
        return /* CompletedTodos */2;
    default:
      return /* AllTodos */0;
  }
}

function App$Top(Props) {
  var todos = localStorage.getItem(localStorageNamespace);
  var todos$1 = todos !== null ? JSON.parse(todos) : /* [] */0;
  var match = React.useReducer((function (state, action) {
          if (typeof action === "number") {
            switch (action) {
              case /* NewTodoEnterKeyDown */0 :
                  var nonEmptyValue = $$String.trim(state.newTodo);
                  if (nonEmptyValue === "") {
                    return state;
                  }
                  var todos = Pervasives.$at(state.todos, {
                        hd: {
                          id: Date.now().toString(),
                          title: nonEmptyValue,
                          completed: false
                        },
                        tl: /* [] */0
                      });
                  saveLocally(todos);
                  return {
                          nowShowing: state.nowShowing,
                          editing: state.editing,
                          newTodo: "",
                          todos: todos
                        };
              case /* NewTodoOtherKeyDown */1 :
                  return state;
              case /* ClearCompleted */2 :
                  var todos$1 = Belt_List.keep(state.todos, (function (todo) {
                          return !todo.completed;
                        }));
                  saveLocally(todos$1);
                  return {
                          nowShowing: state.nowShowing,
                          editing: state.editing,
                          newTodo: state.newTodo,
                          todos: todos$1
                        };
              case /* Cancel */3 :
                  return {
                          nowShowing: state.nowShowing,
                          editing: undefined,
                          newTodo: state.newTodo,
                          todos: state.todos
                        };
              
            }
          } else {
            switch (action.TAG | 0) {
              case /* Navigate */0 :
                  return {
                          nowShowing: action._0,
                          editing: state.editing,
                          newTodo: state.newTodo,
                          todos: state.todos
                        };
              case /* ChangeTodo */1 :
                  return {
                          nowShowing: state.nowShowing,
                          editing: state.editing,
                          newTodo: action._0,
                          todos: state.todos
                        };
              case /* Save */2 :
                  var text = action._1;
                  var todoToSave = action._0;
                  var todos$2 = Belt_List.map(state.todos, (function (todo) {
                          if (Caml_obj.caml_equal(todo, todoToSave)) {
                            return {
                                    id: todo.id,
                                    title: text,
                                    completed: todo.completed
                                  };
                          } else {
                            return todo;
                          }
                        }));
                  saveLocally(todos$2);
                  return {
                          nowShowing: state.nowShowing,
                          editing: undefined,
                          newTodo: state.newTodo,
                          todos: todos$2
                        };
              case /* Edit */3 :
                  return {
                          nowShowing: state.nowShowing,
                          editing: action._0.id,
                          newTodo: state.newTodo,
                          todos: state.todos
                        };
              case /* Destroy */4 :
                  var todo = action._0;
                  var todos$3 = Belt_List.keep(state.todos, (function (candidate) {
                          return candidate !== todo;
                        }));
                  saveLocally(todos$3);
                  return {
                          nowShowing: state.nowShowing,
                          editing: state.editing,
                          newTodo: state.newTodo,
                          todos: todos$3
                        };
              case /* Toggle */5 :
                  var todoToToggle = action._0;
                  var todos$4 = Belt_List.map(state.todos, (function (todo) {
                          if (Caml_obj.caml_equal(todo, todoToToggle)) {
                            return {
                                    id: todo.id,
                                    title: todo.title,
                                    completed: !todo.completed
                                  };
                          } else {
                            return todo;
                          }
                        }));
                  saveLocally(todos$4);
                  return {
                          nowShowing: state.nowShowing,
                          editing: state.editing,
                          newTodo: state.newTodo,
                          todos: todos$4
                        };
              case /* ToggleAll */6 :
                  var checked = action._0;
                  var todos$5 = Belt_List.map(state.todos, (function (todo) {
                          return {
                                  id: todo.id,
                                  title: todo.title,
                                  completed: checked
                                };
                        }));
                  saveLocally(todos$5);
                  return {
                          nowShowing: state.nowShowing,
                          editing: state.editing,
                          newTodo: state.newTodo,
                          todos: todos$5
                        };
              
            }
          }
        }), {
        nowShowing: urlToShownPage(ReasonReactRouter.dangerouslyGetInitialUrl(undefined).hash),
        editing: undefined,
        newTodo: "",
        todos: todos$1
      });
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var token = ReasonReactRouter.watchUrl(function (url) {
                return Curry._1(dispatch, {
                            TAG: /* Navigate */0,
                            _0: urlToShownPage(url.hash)
                          });
              });
          return (function (param) {
                    return ReasonReactRouter.unwatchUrl(token);
                  });
        }), []);
  var todos$2 = state.todos;
  var editing = state.editing;
  var __x = Belt_List.keep(todos$2, (function (todo) {
          var match = state.nowShowing;
          switch (match) {
            case /* AllTodos */0 :
                return true;
            case /* ActiveTodos */1 :
                return !todo.completed;
            case /* CompletedTodos */2 :
                return todo.completed;
            
          }
        }));
  var todoItems = Belt_List.map(__x, (function (todo) {
          var editing$1 = editing !== undefined ? editing === todo.id : false;
          return React.createElement(TodoItem$Reducers.make, {
                      todo: todo,
                      editing: editing$1,
                      onDestroy: (function (_event) {
                          return Curry._1(dispatch, {
                                      TAG: /* Destroy */4,
                                      _0: todo
                                    });
                        }),
                      onSave: (function (text) {
                          return Curry._1(dispatch, {
                                      TAG: /* Save */2,
                                      _0: todo,
                                      _1: text
                                    });
                        }),
                      onEdit: (function (_event) {
                          return Curry._1(dispatch, {
                                      TAG: /* Edit */3,
                                      _0: todo
                                    });
                        }),
                      onToggle: (function (_event) {
                          return Curry._1(dispatch, {
                                      TAG: /* Toggle */5,
                                      _0: todo
                                    });
                        }),
                      onCancel: (function (_event) {
                          return Curry._1(dispatch, /* Cancel */3);
                        }),
                      key: todo.id
                    });
        }));
  var todosLength = Belt_List.length(todos$2);
  var completedCount = Belt_List.length(Belt_List.keep(todos$2, (function (todo) {
              return todo.completed;
            })));
  var activeTodoCount = todosLength - completedCount | 0;
  var footer;
  var exit = 0;
  if (activeTodoCount !== 0 || completedCount !== 0) {
    exit = 1;
  } else {
    footer = null;
  }
  if (exit === 1) {
    footer = React.createElement(TodoFooter$Reducers.make, {
          count: activeTodoCount,
          completedCount: completedCount,
          nowShowing: state.nowShowing,
          onClearCompleted: (function (_event) {
              return Curry._1(dispatch, /* ClearCompleted */2);
            })
        });
  }
  var main = todosLength === 0 ? null : React.createElement("section", {
          className: "main"
        }, React.createElement("input", {
              className: "toggle-all",
              checked: activeTodoCount === 0,
              type: "checkbox",
              onChange: (function ($$event) {
                  var checked = $$event.target.checked;
                  return Curry._1(dispatch, {
                              TAG: /* ToggleAll */6,
                              _0: checked
                            });
                })
            }), React.createElement("ul", {
              className: "todo-list"
            }, Belt_List.toArray(todoItems)));
  return React.createElement("div", undefined, React.createElement("header", {
                  className: "header"
                }, React.createElement("h1", undefined, "todos"), React.createElement("input", {
                      className: "new-todo",
                      autoFocus: true,
                      placeholder: "What needs to be done?",
                      value: state.newTodo,
                      onKeyDown: (function ($$event) {
                          if ($$event.keyCode === 13) {
                            $$event.preventDefault();
                            return Curry._1(dispatch, /* NewTodoEnterKeyDown */0);
                          } else {
                            return Curry._1(dispatch, /* NewTodoOtherKeyDown */1);
                          }
                        }),
                      onChange: (function ($$event) {
                          return Curry._1(dispatch, {
                                      TAG: /* ChangeTodo */1,
                                      _0: $$event.target.value
                                    });
                        })
                    })), main, footer);
}

var Top = {
  urlToShownPage: urlToShownPage,
  make: App$Top
};

ReactDOMRe.renderToElementWithClassName(React.createElement(App$Top, {}), "todoapp");

exports.localStorageNamespace = localStorageNamespace;
exports.saveLocally = saveLocally;
exports.Top = Top;
/*  Not a pure module */
