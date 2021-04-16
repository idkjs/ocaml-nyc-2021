'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
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

function initialState(param) {
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

function runAll(action, state) {
  return Belt_List.forEach(state.items, (function (param) {
                return HooksRemoteAction$Reducers.send(param.rActionButton, action);
              }));
}

function showButtons(self, action, state) {
  if (typeof action === "number") {
    switch (action) {
      case /* AddSelf */0 :
          var key = Key$Reducers.gen(undefined);
          var rActionButton = HooksRemoteAction$Reducers.create(undefined);
          var rActionHeight = HooksRemoteAction$Reducers.create(undefined);
          var element = React.createElement(AnimateHeight$Reducers.make, {
                rAction: rActionHeight,
                targetHeight: 500,
                children: Curry._2(self, key, undefined),
                key: key
              });
          var item = {
            element: element,
            rActionButton: rActionButton,
            rActionHeight: rActionHeight,
            closing: false
          };
          return {
                  act: state.act,
                  randomAnimation: state.randomAnimation,
                  items: {
                    hd: item,
                    tl: state.items
                  }
                };
      case /* DecrementAllButtons */1 :
          runAll(/* Unclick */2, state);
          return state;
      case /* IncrementAllButtons */2 :
          runAll(/* Click */0, state);
          return state;
      case /* CloseAllButtons */3 :
          runAll(/* Close */4, state);
          return state;
      case /* RemoveItem */4 :
          var firstItemNotClosing = Belt_List.getBy(state.items, (function (item) {
                  return item.closing === false;
                }));
          if (firstItemNotClosing === undefined) {
            return state;
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
          HooksRemoteAction$Reducers.send(firstItemNotClosing.rActionHeight, {
                TAG: /* BeginClosing */1,
                _0: onBeginClosing,
                _1: onClose
              });
          return state;
      case /* ResetAllButtons */5 :
          runAll(/* Reset */1, state);
          return state;
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
          Curry._1(state.act, {
                TAG: /* CloseHeight */5,
                _0: onStopClose
              });
          return state;
      case /* ToggleRandomAnimation */7 :
          if (HooksAnimation$Reducers.isActive(state.randomAnimation)) {
            HooksAnimation$Reducers.stop(state.randomAnimation);
          } else {
            HooksAnimation$Reducers.start(state.randomAnimation);
          }
          return state;
      
    }
  } else {
    switch (action.TAG | 0) {
      case /* SetAct */0 :
          return {
                  act: action._0,
                  randomAnimation: state.randomAnimation,
                  items: state.items
                };
      case /* AddButton */1 :
          var removeFromList = function (rActionHeight) {
            return Curry._1(state.act, {
                        TAG: /* FilterOutItem */4,
                        _0: rActionHeight
                      });
          };
          return {
                  act: state.act,
                  randomAnimation: state.randomAnimation,
                  items: {
                    hd: createButton(removeFromList, action._0, Belt_List.length(state.items)),
                    tl: state.items
                  }
                };
      case /* AddButtonFirst */2 :
          var removeFromList$1 = function (rActionHeight) {
            return Curry._1(state.act, {
                        TAG: /* FilterOutItem */4,
                        _0: rActionHeight
                      });
          };
          return {
                  act: state.act,
                  randomAnimation: state.randomAnimation,
                  items: Pervasives.$at(state.items, {
                        hd: createButton(removeFromList$1, action._0, Belt_List.length(state.items)),
                        tl: /* [] */0
                      })
                };
      case /* AddImage */3 :
          return {
                  act: state.act,
                  randomAnimation: state.randomAnimation,
                  items: {
                    hd: createImage(action._0, Belt_List.length(state.items)),
                    tl: state.items
                  }
                };
      case /* FilterOutItem */4 :
          var rAction = action._0;
          var filter = function (item) {
            return item.rActionHeight !== rAction;
          };
          return {
                  act: state.act,
                  randomAnimation: state.randomAnimation,
                  items: Belt_List.keep(state.items, filter)
                };
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
          var iter = function (param) {
            return Belt_List.forEach(state.items, (function (item) {
                          return HooksRemoteAction$Reducers.send(item.rActionHeight, {
                                      TAG: /* Close */2,
                                      _0: onClose$1
                                    });
                        }));
          };
          iter(undefined);
          return state;
      case /* ReverseWithSideEffects */6 :
          Belt_List.reverse(state.items);
          Curry._1(action._0, undefined);
          return state;
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
          var iter$1 = function (param) {
            return Belt_List.forEach(state.items, (function (item) {
                          return HooksRemoteAction$Reducers.send(item.rActionHeight, {
                                      TAG: /* Open */0,
                                      _0: onClose$2
                                    });
                        }));
          };
          iter$1(undefined);
          return state;
      
    }
  }
}

function root(state, action) {
  return state;
}

var Reducers = {
  showButtons: showButtons,
  root: root
};

var ImageTransition = ImageTransition$Reducers.ImageTransition;

var BL;

exports.ImageTransition = ImageTransition;
exports.BL = BL;
exports.initialState = initialState;
exports.getElements = getElements;
exports.createButton = createButton;
exports.createImage = createImage;
exports.runAll = runAll;
exports.Reducers = Reducers;
/* react Not a pure module */
