'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Printf = require("bs-platform/lib/js/printf.js");
var $$String = require("bs-platform/lib/js/string.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var HooksRemoteAction$Reducers = require("./HooksRemoteAction.bs.js");
var HooksSpringAnimation$Reducers = require("./HooksSpringAnimation.bs.js");

var initial = {
  count1: 0,
  count2: 0,
  toggle: false
};

var GlobalState = {
  initial: initial
};

function HooksDemo$Counter1(Props) {
  var state = Props.state;
  var update = Props.update;
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, (function (state) {
                                    return {
                                            count1: state.count1 + 1 | 0,
                                            count2: state.count2,
                                            toggle: state.toggle
                                          };
                                  }));
                    })
                }, "+"), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, (function (state) {
                                    return {
                                            count1: state.count1 - 1 | 0,
                                            count2: state.count2,
                                            toggle: state.toggle
                                          };
                                  }));
                    })
                }, "-"), " counter:" + String(state.count1));
}

var Counter1 = {
  make: HooksDemo$Counter1
};

function HooksDemo$Counter2(Props) {
  var state = Props.state;
  var update = Props.update;
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, (function (state) {
                                    return {
                                            count1: state.count1,
                                            count2: state.count2 + 1 | 0,
                                            toggle: state.toggle
                                          };
                                  }));
                    })
                }, "+"), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, (function (state) {
                                    return {
                                            count1: state.count1,
                                            count2: state.count2 - 1 | 0,
                                            toggle: state.toggle
                                          };
                                  }));
                    })
                }, "-"), " counter:" + String(state.count2));
}

var Counter2 = {
  make: HooksDemo$Counter2
};

function HooksDemo$Toggle(Props) {
  var state = Props.state;
  var update = Props.update;
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(update, (function (state) {
                                    return {
                                            count1: state.count1,
                                            count2: state.count2,
                                            toggle: !state.toggle
                                          };
                                  }));
                    })
                }, "Toggle"), " toggle:" + Pervasives.string_of_bool(state.toggle));
}

var Toggle = {
  make: HooksDemo$Toggle
};

function HooksDemo$GlobalStateExample(Props) {
  var match = React.useReducer((function (state, fn) {
          return Curry._1(fn, state);
        }), initial);
  var dispatch = match[1];
  var state = match[0];
  var update = Curry.__1(dispatch);
  return React.createElement("div", undefined, React.createElement(HooksDemo$Counter1, {
                  state: state,
                  update: update
                }), React.createElement(HooksDemo$Counter2, {
                  state: state,
                  update: update
                }), React.createElement(HooksDemo$Counter2, {
                  state: state,
                  update: update
                }), React.createElement(HooksDemo$Toggle, {
                  state: state,
                  update: update
                }));
}

var GlobalStateExample = {
  make: HooksDemo$GlobalStateExample
};

function HooksDemo$LocalCounter(Props) {
  var match = React.useReducer((function (state, action) {
          if (action) {
            return state - 1 | 0;
          } else {
            return state + 1 | 0;
          }
        }), 0);
  var dispatch = match[1];
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* Incr */0);
                    })
                }, "+"), React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* Decr */1);
                    })
                }, "-"), " counter:" + String(match[0]));
}

var LocalCounter = {
  make: HooksDemo$LocalCounter
};

function HooksDemo$LocalToggle(Props) {
  var match = React.useReducer((function (state, action) {
          return !state;
        }), false);
  var dispatch = match[1];
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* Toggle */0);
                    })
                }, "Toggle"), " toggle:" + Pervasives.string_of_bool(match[0]));
}

var LocalToggle = {
  make: HooksDemo$LocalToggle
};

function HooksDemo$LocalStateExample(Props) {
  return React.createElement("div", undefined, React.createElement(HooksDemo$LocalCounter, {}), React.createElement(HooksDemo$LocalCounter, {}), React.createElement(HooksDemo$LocalCounter, {}), React.createElement(HooksDemo$LocalToggle, {}));
}

var LocalStateExample = {
  make: HooksDemo$LocalStateExample
};

function textOfEvent(e) {
  return e.target.value;
}

function HooksDemo$TextInput(Props) {
  var onChangeOpt = Props.onChange;
  var showTextOpt = Props.showText;
  var initialOpt = Props.initial;
  var onChange = onChangeOpt !== undefined ? onChangeOpt : (function (param) {
        
      });
  var showText = showTextOpt !== undefined ? showTextOpt : (function (x) {
        return x;
      });
  var initial = initialOpt !== undefined ? initialOpt : "";
  var match = React.useReducer((function (_state, action) {
          return action._0;
        }), initial);
  var dispatch = match[1];
  return React.createElement("input", {
              value: Curry._1(showText, match[0]),
              onChange: (function ($$event) {
                  var text = $$event.target.value;
                  Curry._1(dispatch, /* Text */{
                        _0: text
                      });
                  return Curry._1(onChange, text);
                })
            });
}

var TextInput = {
  textOfEvent: textOfEvent,
  make: HooksDemo$TextInput
};

function HooksDemo$Spring(Props) {
  var renderValue = Props.renderValue;
  var initialState_animation = HooksSpringAnimation$Reducers.create(0.0);
  var initialState = {
    animation: initialState_animation,
    value: 0.0,
    target: 1.0
  };
  var match = React.useReducer((function (state, action) {
          if (action) {
            return {
                    animation: state.animation,
                    value: action._0,
                    target: state.target
                  };
          }
          var target = state.target === 0.0 ? 1.0 : 0.0;
          HooksSpringAnimation$Reducers.setFinalValue(target, state.animation);
          return {
                  animation: state.animation,
                  value: state.value,
                  target: target
                };
        }), initialState);
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var arg = function (value) {
            return Curry._1(dispatch, /* Value */{
                        _0: value
                      });
          };
          var arg$1 = state.target;
          var arg$2 = function (param, param$1, param$2, param$3) {
            return function (param$4) {
              return HooksSpringAnimation$Reducers.setOnChange(param, param$1, param$2, param$3, arg, arg$1, param$4);
            };
          };
          Curry._1(arg$2(undefined, undefined, undefined, undefined), state.animation);
          return (function (param) {
                    return HooksSpringAnimation$Reducers.stop(state.animation);
                  });
        }), []);
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return Curry._1(dispatch, /* Click */0);
                    })
                }, "target: " + state.target.toString()), React.createElement("div", undefined, Curry._1(renderValue, state.value)));
}

var Spring = {
  make: HooksDemo$Spring
};

function renderValue(value) {
  return Curry._1(Printf.sprintf(/* Format */{
                  _0: {
                    TAG: /* String_literal */11,
                    _0: "value: ",
                    _1: {
                      TAG: /* Float */8,
                      _0: /* Float_f */0,
                      _1: /* No_padding */0,
                      _2: /* Lit_precision */{
                        _0: 3
                      },
                      _3: /* End_of_format */0
                    }
                  },
                  _1: "value: %.3f"
                }), value);
}

function HooksDemo$SimpleSpring(Props) {
  return React.createElement(HooksDemo$Spring, {
              renderValue: renderValue
            });
}

var SimpleSpring = {
  renderValue: renderValue,
  make: HooksDemo$SimpleSpring
};

function shrinkText(text, value) {
  if (value >= 1.0) {
    return text;
  }
  var len = Math.round(value * text.length);
  return $$String.sub(text, 0, len | 0);
}

function renderValue$1(value) {
  return React.createElement(HooksDemo$TextInput, {
              showText: (function (text) {
                  return shrinkText(text, value);
                }),
              initial: "edit this or click target"
            });
}

function HooksDemo$AnimatedTextInput(Props) {
  return React.createElement(HooksDemo$Spring, {
              renderValue: renderValue$1
            });
}

var AnimatedTextInput = {
  shrinkText: shrinkText,
  renderValue: renderValue$1,
  make: HooksDemo$AnimatedTextInput
};

function textOfEvent$1(e) {
  return e.target.value;
}

function HooksDemo$TextInputRemote(Props) {
  var remoteAction = Props.remoteAction;
  var onChangeOpt = Props.onChange;
  var showTextOpt = Props.showText;
  var initialOpt = Props.initial;
  var onChange = onChangeOpt !== undefined ? onChangeOpt : (function (param) {
        
      });
  var showText = showTextOpt !== undefined ? showTextOpt : (function (x) {
        return x;
      });
  var initial = initialOpt !== undefined ? initialOpt : "";
  var match = React.useReducer((function (_state, action) {
          if (action) {
            return action._0;
          } else {
            return "the text has been reset";
          }
        }), initial);
  var dispatch = match[1];
  React.useEffect((function () {
          var token = HooksRemoteAction$Reducers.subscribe(dispatch, remoteAction);
          return (function (param) {
                    if (token !== undefined) {
                      return HooksRemoteAction$Reducers.unsubscribe(Caml_option.valFromOption(token));
                    }
                    
                  });
        }), []);
  return React.createElement("input", {
              value: Curry._1(showText, match[0]),
              onChange: (function ($$event) {
                  var text = $$event.target.value;
                  Curry._1(dispatch, /* Text */{
                        _0: text
                      });
                  return Curry._1(onChange, text);
                })
            });
}

var TextInputRemote = {
  textOfEvent: textOfEvent$1,
  make: HooksDemo$TextInputRemote
};

function shrinkText$1(text, value) {
  if (value >= 1.0) {
    return text;
  }
  var len = Math.round(value * text.length);
  return $$String.sub(text, 0, len | 0);
}

var remoteAction = HooksRemoteAction$Reducers.create(undefined);

function renderValue$2(value) {
  return React.createElement(HooksDemo$TextInputRemote, {
              remoteAction: remoteAction,
              showText: (function (text) {
                  return shrinkText$1(text, value);
                }),
              initial: "edit this or click target"
            });
}

function HooksDemo$AnimatedTextInputRemote(Props) {
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return HooksRemoteAction$Reducers.send(remoteAction, /* Reset */0);
                    })
                }, "reset text"), React.createElement("div", undefined, "-----"), React.createElement(HooksDemo$Spring, {
                  renderValue: renderValue$2
                }));
}

var AnimatedTextInputRemote = {
  shrinkText: shrinkText$1,
  remoteAction: remoteAction,
  renderValue: renderValue$2,
  make: HooksDemo$AnimatedTextInputRemote
};

function HooksDemo$GrandChild(Props) {
  var remoteAction = Props.remoteAction;
  var match = React.useReducer((function (state, action) {
          if (action) {
            return state - 1 | 0;
          } else {
            return state + 1 | 0;
          }
        }), 0);
  var dispatch = match[1];
  React.useEffect((function () {
          var token = HooksRemoteAction$Reducers.subscribe(dispatch, remoteAction);
          return (function (param) {
                    if (token !== undefined) {
                      return HooksRemoteAction$Reducers.unsubscribe(Caml_option.valFromOption(token));
                    }
                    
                  });
        }), []);
  return React.createElement("div", undefined, "in grandchild state: " + String(match[0]));
}

var GrandChild = {
  make: HooksDemo$GrandChild
};

function HooksDemo$Child(Props) {
  var remoteAction = Props.remoteAction;
  return React.createElement("div", undefined, "in child", React.createElement(HooksDemo$GrandChild, {
                  remoteAction: remoteAction
                }));
}

var Child = {
  make: HooksDemo$Child
};

function HooksDemo$Parent(Props) {
  var state = HooksRemoteAction$Reducers.create(undefined);
  return React.createElement("div", undefined, React.createElement("button", {
                  onClick: (function (param) {
                      return HooksRemoteAction$Reducers.send(state, /* Incr */0);
                    })
                }, "in parent"), React.createElement(HooksDemo$Child, {
                  remoteAction: state
                }));
}

var Parent = {
  make: HooksDemo$Parent
};

var SpringAnimation;

var RemoteAction;

exports.SpringAnimation = SpringAnimation;
exports.RemoteAction = RemoteAction;
exports.GlobalState = GlobalState;
exports.Counter1 = Counter1;
exports.Counter2 = Counter2;
exports.Toggle = Toggle;
exports.GlobalStateExample = GlobalStateExample;
exports.LocalCounter = LocalCounter;
exports.LocalToggle = LocalToggle;
exports.LocalStateExample = LocalStateExample;
exports.TextInput = TextInput;
exports.Spring = Spring;
exports.SimpleSpring = SimpleSpring;
exports.AnimatedTextInput = AnimatedTextInput;
exports.TextInputRemote = TextInputRemote;
exports.AnimatedTextInputRemote = AnimatedTextInputRemote;
exports.GrandChild = GrandChild;
exports.Child = Child;
exports.Parent = Parent;
/* remoteAction Not a pure module */
