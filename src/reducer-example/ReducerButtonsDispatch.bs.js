'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Random = require("bs-platform/lib/js/random.js");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Key$Reducers = require("../utils/Key.bs.js");
var AnimateHeight$Reducers = require("../hooks-animation/AnimateHeight.bs.js");
var AnimatedButton$Reducers = require("../hooks-animation/AnimatedButton.bs.js");
var HooksAnimation$Reducers = require("../hooks-animation/HooksAnimation.bs.js");
var ImageTransition$Reducers = require("./ImageTransition.bs.js");
var HooksRemoteAction$Reducers = require("../hooks-animation/HooksRemoteAction.bs.js");
var ImageGalleryAnimation$Reducers = require("../hooks-animation/ImageGalleryAnimation.bs.js");

function initial(param) {
  return {
          act: (function (_action) {
              
            }),
          randomAnimation: HooksAnimation$Reducers.create(undefined),
          items: /* [] */0
        };
}

function getElements(param) {
  return Belt_List.toArray(Belt_List.mapReverse(param.items, (function (x) {
                    return x.element;
                  })));
}

function createButton(removeFromList, animateMount, number) {
  var rActionButton = HooksRemoteAction$Reducers.create(undefined);
  var rActionHeight = HooksRemoteAction$Reducers.create(undefined);
  var key = Key$Reducers.gen(undefined);
  var onClose = function (param) {
    return HooksRemoteAction$Reducers.send(rActionHeight, {
                TAG: /* Close */2,
                _0: (function (param) {
                    return Curry._1(removeFromList, rActionHeight);
                  })
              });
  };
  var tmp = {
    text: "Button#" + String(number),
    rAction: rActionButton,
    onClose: onClose,
    key: key
  };
  if (animateMount !== undefined) {
    tmp.animateMount = Caml_option.valFromOption(animateMount);
  }
  var element = React.createElement(AnimateHeight$Reducers.make, {
        rAction: rActionHeight,
        targetHeight: AnimatedButton$Reducers.targetHeight,
        children: React.createElement(AnimatedButton$Reducers.make, tmp),
        key: key
      });
  return {
          element: element,
          rActionButton: rActionButton,
          rActionHeight: rActionHeight,
          closing: false
        };
}

function createImage(animateMount, number) {
  var key = Key$Reducers.gen(undefined);
  var rActionButton = HooksRemoteAction$Reducers.create(undefined);
  var tmp = {
    initialImage: number,
    key: Key$Reducers.gen(undefined)
  };
  if (animateMount !== undefined) {
    tmp.animateMount = Caml_option.valFromOption(animateMount);
  }
  var imageGalleryAnimation = React.createElement(ImageGalleryAnimation$Reducers.make, tmp);
  var rActionHeight = HooksRemoteAction$Reducers.create(undefined);
  var element = React.createElement(AnimateHeight$Reducers.make, {
        rAction: rActionHeight,
        targetHeight: ImageTransition$Reducers.ImageTransition.displayHeight,
        children: imageGalleryAnimation,
        key: key
      });
  return {
          element: element,
          rActionButton: rActionButton,
          rActionHeight: rActionHeight,
          closing: false
        };
}

var State = {
  createButton: createButton,
  createImage: createImage,
  getElements: getElements,
  initial: initial
};

function runAll(action, state) {
  return Belt_List.forEach(state.items, (function (param) {
                return HooksRemoteAction$Reducers.send(param.rActionButton, action);
              }));
}

function make(Props) {
  var showAllButtons = Props.showAllButtons;
  var self = function (key) {
    return React.createElement(make, {
                showAllButtons: showAllButtons,
                key: key
              });
  };
  var match = React.useState(function () {
        return initial(undefined);
      });
  var setState = match[1];
  var state = match[0];
  var match$1 = React.useReducer((function (param, action) {
          if (typeof action === "number") {
            switch (action) {
              case /* AddSelf */0 :
                  React.createElement(make, {
                        showAllButtons: showAllButtons
                      });
                  var key = Key$Reducers.gen(undefined);
                  var rActionButton = HooksRemoteAction$Reducers.create(undefined);
                  var rActionHeight = HooksRemoteAction$Reducers.create(undefined);
                  var element = React.createElement(AnimateHeight$Reducers.make, {
                        rAction: rActionHeight,
                        targetHeight: 500,
                        children: self(key),
                        key: key
                      });
                  var item = {
                    element: element,
                    rActionButton: rActionButton,
                    rActionHeight: rActionHeight,
                    closing: false
                  };
                  return Curry._1(setState, (function (param) {
                                return {
                                        act: state.act,
                                        randomAnimation: state.randomAnimation,
                                        items: {
                                          hd: item,
                                          tl: state.items
                                        }
                                      };
                              }));
              case /* DecrementAllButtons */1 :
                  return runAll(/* Unclick */2, state);
              case /* IncrementAllButtons */2 :
                  return runAll(/* Click */0, state);
              case /* CloseAllButtons */3 :
                  return runAll(/* Close */4, state);
              case /* RemoveItem */4 :
                  var firstItemNotClosing = Belt_List.getBy(state.items, (function (item) {
                          return item.closing === false;
                        }));
                  if (firstItemNotClosing === undefined) {
                    return ;
                  }
                  var onBeginClosing = (function (param) {
                      firstItemNotClosing.closing = true;
                      
                    });
                  var onClose = (function (param) {
                      return Curry._1(state.act, {
                                  TAG: /* FilterOutItem */4,
                                  _0: firstItemNotClosing.rActionHeight
                                });
                    });
                  return HooksRemoteAction$Reducers.send(firstItemNotClosing.rActionHeight, {
                              TAG: /* BeginClosing */1,
                              _0: onBeginClosing,
                              _1: onClose
                            });
              case /* ResetAllButtons */5 :
                  return runAll(/* Reset */1, state);
              case /* ReverseItemsAnimation */6 :
                  var onStopClose = function (param) {
                    return Curry._1(state.act, {
                                TAG: /* ReverseWithSideEffects */6,
                                _0: (function (param) {
                                    return Curry._1(state.act, {
                                                TAG: /* OpenHeight */7,
                                                _0: undefined
                                              });
                                  })
                              });
                  };
                  return Curry._1(state.act, {
                              TAG: /* CloseHeight */5,
                              _0: onStopClose
                            });
              case /* ToggleRandomAnimation */7 :
                  if (HooksAnimation$Reducers.isActive(state.randomAnimation)) {
                    return HooksAnimation$Reducers.stop(state.randomAnimation);
                  } else {
                    return HooksAnimation$Reducers.start(state.randomAnimation);
                  }
              
            }
          } else {
            switch (action.TAG | 0) {
              case /* SetAct */0 :
                  var act = action._0;
                  console.log("SetAct(act)", act);
                  console.log("SetAct(act)", state);
                  return Curry._1(setState, (function (param) {
                                return {
                                        act: act,
                                        randomAnimation: state.randomAnimation,
                                        items: state.items
                                      };
                              }));
              case /* AddButton */1 :
                  var animateMount = action._0;
                  console.log("animateMount", animateMount);
                  var removeFromList = function (rActionHeight) {
                    console.log("rActionHeight", rActionHeight);
                    return Curry._1(state.act, {
                                TAG: /* FilterOutItem */4,
                                _0: rActionHeight
                              });
                  };
                  console.log("state", state);
                  return Curry._1(setState, (function (param) {
                                return {
                                        act: state.act,
                                        randomAnimation: state.randomAnimation,
                                        items: {
                                          hd: createButton(removeFromList, animateMount, Belt_List.length(state.items)),
                                          tl: state.items
                                        }
                                      };
                              }));
              case /* AddButtonFirst */2 :
                  var animateMount$1 = action._0;
                  console.log("animateMount", animateMount$1);
                  var removeFromList$1 = function (rActionHeight) {
                    console.log("rActionHeight", rActionHeight);
                    return Curry._1(state.act, {
                                TAG: /* FilterOutItem */4,
                                _0: rActionHeight
                              });
                  };
                  console.log("state", state);
                  return Curry._1(setState, (function (param) {
                                return {
                                        act: state.act,
                                        randomAnimation: state.randomAnimation,
                                        items: Pervasives.$at(state.items, {
                                              hd: createButton(removeFromList$1, animateMount$1, Belt_List.length(state.items)),
                                              tl: /* [] */0
                                            })
                                      };
                              }));
              case /* AddImage */3 :
                  var animateMount$2 = action._0;
                  return Curry._1(setState, (function (param) {
                                return {
                                        act: state.act,
                                        randomAnimation: state.randomAnimation,
                                        items: {
                                          hd: createImage(animateMount$2, Belt_List.length(state.items)),
                                          tl: state.items
                                        }
                                      };
                              }));
              case /* FilterOutItem */4 :
                  var rAction = action._0;
                  var filter = function (item) {
                    return item.rActionHeight !== rAction;
                  };
                  return Curry._1(setState, (function (param) {
                                return {
                                        act: state.act,
                                        randomAnimation: state.randomAnimation,
                                        items: Belt_List.keep(state.items, filter)
                                      };
                              }));
              case /* CloseHeight */5 :
                  var onStop = action._0;
                  var len = Belt_List.length(state.items);
                  var count = {
                    contents: len
                  };
                  var onClose$1 = function (param) {
                    count.contents = count.contents - 1 | 0;
                    if (count.contents === 0 && onStop !== undefined) {
                      return Curry._1(onStop, undefined);
                    }
                    
                  };
                  return Belt_List.forEach(state.items, (function (item) {
                                return HooksRemoteAction$Reducers.send(item.rActionHeight, {
                                            TAG: /* Close */2,
                                            _0: onClose$1
                                          });
                              }));
              case /* ReverseWithSideEffects */6 :
                  Curry._1(setState, (function (param) {
                          return {
                                  act: state.act,
                                  randomAnimation: state.randomAnimation,
                                  items: Belt_List.reverse(state.items)
                                };
                        }));
                  return Curry._1(action._0, undefined);
              case /* OpenHeight */7 :
                  var onStop$1 = action._0;
                  var len$1 = Belt_List.length(state.items);
                  var count$1 = {
                    contents: len$1
                  };
                  var onClose$2 = function (param) {
                    count$1.contents = count$1.contents - 1 | 0;
                    if (count$1.contents === 0 && onStop$1 !== undefined) {
                      return Curry._1(onStop$1, undefined);
                    }
                    
                  };
                  return Belt_List.forEach(state.items, (function (item) {
                                return HooksRemoteAction$Reducers.send(item.rActionHeight, {
                                            TAG: /* Open */0,
                                            _0: onClose$2
                                          });
                              }));
              
            }
          }
        }), undefined);
  var dispatch = match$1[1];
  React.useEffect((function () {
          var callback = function () {
            var match = Random.$$int(6);
            switch (match) {
              case 0 :
                  break;
              case 1 :
                  break;
              case 2 :
              case 3 :
                  break;
              case 4 :
                  break;
              case 5 :
                  break;
              default:
                throw {
                      RE_EXN_ID: "Assert_failure",
                      _1: [
                        "ReducerButtonsDispatch.re",
                        308,
                        17
                      ],
                      Error: new Error()
                    };
            }
            Curry._1(dispatch, {
                  TAG: /* AddButton */1,
                  _0: true
                });
            return /* Continue */0;
          };
          Curry._1(dispatch, {
                TAG: /* SetAct */0,
                _0: dispatch
              });
          HooksAnimation$Reducers.setCallback(state.randomAnimation, callback);
          return (function (param) {
                    return HooksAnimation$Reducers.stop(state.randomAnimation);
                  });
        }), []);
  var button = function (repeatOpt, hideOpt, txt, action) {
    var repeat = repeatOpt !== undefined ? repeatOpt : 1;
    var hide = hideOpt !== undefined ? hideOpt : false;
    if (hide) {
      return null;
    } else {
      return React.createElement("div", {
                  className: "exampleButton large",
                  style: {
                    width: "220px"
                  },
                  onClick: (function (_e) {
                      for(var _for = 1; _for <= repeat; ++_for){
                        Curry._1(state.act, action);
                      }
                      
                    })
                }, txt);
    }
  };
  var hide = !showAllButtons;
  return React.createElement("div", {
              className: "componentBox"
            }, React.createElement("div", {
                  className: "componentColumn"
                }, "Control:", button(undefined, undefined, "Add Button", {
                      TAG: /* AddButton */1,
                      _0: true
                    }), button(undefined, undefined, "Add Image", {
                      TAG: /* AddImage */3,
                      _0: true
                    }), button(undefined, undefined, "Add Button On Top", {
                      TAG: /* AddButtonFirst */2,
                      _0: true
                    }), button(undefined, undefined, "Remove Item", /* RemoveItem */4), button(100, hide, "Add 100 Buttons On Top", {
                      TAG: /* AddButtonFirst */2,
                      _0: false
                    }), button(100, hide, "Add 100 Images", {
                      TAG: /* AddImage */3,
                      _0: false
                    }), button(undefined, undefined, "Click all the Buttons", /* IncrementAllButtons */2), button(undefined, hide, "Unclick all the Buttons", /* DecrementAllButtons */1), button(undefined, undefined, "Close all the Buttons", /* CloseAllButtons */3), button(10, hide, "Click all the Buttons 10 times", /* IncrementAllButtons */2), button(undefined, hide, "Reset all the Buttons' states", /* ResetAllButtons */5), button(undefined, undefined, "Reverse Items", /* ReverseItemsAnimation */6), button(undefined, undefined, "Random Animation " + (
                      HooksAnimation$Reducers.isActive(state.randomAnimation) ? "ON" : "OFF"
                    ), /* ToggleRandomAnimation */7), button(undefined, undefined, "Add Self", /* AddSelf */0)), React.createElement("div", {
                  className: "componentColumn",
                  style: {
                    width: "500px"
                  }
                }, React.createElement("div", undefined, "Items:" + String(Belt_List.length(state.items))), getElements(state)));
}

var ImageTransition = ImageTransition$Reducers.ImageTransition;

exports.ImageTransition = ImageTransition;
exports.State = State;
exports.runAll = runAll;
exports.make = make;
/* react Not a pure module */
