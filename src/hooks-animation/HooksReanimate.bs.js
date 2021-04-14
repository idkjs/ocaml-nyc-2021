'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Random = require("bs-platform/lib/js/random.js");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");
var Px$Reducers = require("../utils/Px.bs.js");
var Key$Reducers = require("../utils/Key.bs.js");
var HooksDemo$Reducers = require("./HooksDemo.bs.js");
var HooksSpring$Reducers = require("./HooksSpring.bs.js");
var AnimateHeight$Reducers = require("./AnimateHeight.bs.js");
var HooksAnimation$Reducers = require("./HooksAnimation.bs.js");
var HooksRemoteAction$Reducers = require("./HooksRemoteAction.bs.js");
var HooksSpringAnimation$Reducers = require("./HooksSpringAnimation.bs.js");

var displayHeightString = Px$Reducers.i(200);

var sizes = [
  [
    500,
    350
  ],
  [
    800,
    600
  ],
  [
    800,
    400
  ],
  [
    700,
    500
  ],
  [
    200,
    650
  ],
  [
    600,
    600
  ]
];

var displayWidths = Belt_Array.map(sizes, (function (param) {
        return Caml_int32.div(Math.imul(param[0], 200), param[1]);
      }));

function getWidth(i) {
  return Caml_array.get(displayWidths, (i + 6 | 0) % 6);
}

function interpolate(width1, width2, phase) {
  var width1$1 = width1;
  var width2$1 = width2;
  var width = width1$1 * (1 - phase) + width2$1 * phase;
  var left1 = -(width1$1 * phase);
  var left2 = left1 + width1$1;
  return [
          Px$Reducers.f(width),
          Px$Reducers.f(left1),
          Px$Reducers.f(left2)
        ];
}

function renderImage(left, i) {
  var src = "./" + (String((i + 6 | 0) % 6) + ".jpg");
  console.log("src: " + src);
  return React.createElement("img", {
              className: "photo-inner",
              style: {
                height: displayHeightString,
                left: left
              },
              src: "./" + (String((i + 6 | 0) % 6) + ".jpg")
            });
}

function render(phase, image1, image2) {
  console.log("ImageRender called");
  console.log("ImageRender args: ", phase, image1, image2);
  var width1 = getWidth(image1);
  var width2 = getWidth(image2);
  var match = interpolate(width1, width2, phase);
  return React.createElement("div", undefined, React.createElement("div", {
                  className: "photo-outer",
                  style: {
                    height: displayHeightString,
                    width: match[0]
                  }
                }, renderImage(match[1], image1), renderImage(match[2], image2)));
}

var ImageTransition = {
  render: render,
  displayHeight: 200
};

function HooksReanimate$ImageGalleryAnimation(Props) {
  var initialImageOpt = Props.initialImage;
  var animateMountOpt = Props.animateMount;
  var initialImage = initialImageOpt !== undefined ? initialImageOpt : 0;
  var animateMount = animateMountOpt !== undefined ? animateMountOpt : true;
  var handleClick = function (animation, targetImage) {
    console.log("HandleClick called");
    return HooksSpringAnimation$Reducers.setFinalValue(targetImage, animation);
  };
  var match = React.useReducer((function (state, action) {
          if (action) {
            return {
                    animation: state.animation,
                    cursor: action._0,
                    targetImage: state.targetImage
                  };
          }
          var state_animation = state.animation;
          var state_cursor = state.cursor;
          var state_targetImage = state.targetImage + 1 | 0;
          var state$1 = {
            animation: state_animation,
            cursor: state_cursor,
            targetImage: state_targetImage
          };
          handleClick(state_animation, state_targetImage);
          return state$1;
        }), {
        animation: HooksSpringAnimation$Reducers.create(initialImage),
        cursor: initialImage,
        targetImage: initialImage
      });
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var arg = function (cursor) {
            return Curry._1(dispatch, /* SetCursor */{
                        _0: cursor
                      });
          };
          var arg$1 = function (param, param$1, param$2) {
            return Curry._5(HooksSpringAnimation$Reducers.setOnChange, param, param$1, 0.05, param$2, arg);
          };
          Curry._2(arg$1(undefined, undefined, undefined), undefined, state.animation);
          if (animateMount) {
            Curry._1(dispatch, /* Click */0);
          }
          return (function (param) {
                    return HooksSpringAnimation$Reducers.stop(state.animation);
                  });
        }), []);
  var image = state.cursor | 0;
  var phase = state.cursor - image;
  return React.createElement("div", {
              onClick: (function (_e) {
                  return Curry._1(dispatch, /* Click */0);
                })
            }, render(phase, image, image + 1 | 0));
}

var ImageGalleryAnimation = {
  make: HooksReanimate$ImageGalleryAnimation
};

function HooksReanimate$AnimatedButton$Text(Props) {
  var text = Props.text;
  return React.createElement("button", undefined, text);
}

var $$Text = {
  make: HooksReanimate$AnimatedButton$Text
};

function HooksReanimate$AnimatedButton(Props) {
  var textOpt = Props.text;
  var rAction = Props.rAction;
  var animateMountOpt = Props.animateMount;
  var onClose = Props.onClose;
  var text = textOpt !== undefined ? textOpt : "Button";
  var animateMount = animateMountOpt !== undefined ? animateMountOpt : true;
  var initialState_animation = HooksSpringAnimation$Reducers.create(250);
  var initialState = {
    animation: initialState_animation,
    width: 250,
    size: /* Small */0,
    clickCount: 0,
    actionCount: 0
  };
  var match = React.useReducer((function (state, action) {
          if (typeof action !== "number") {
            return {
                    animation: state.animation,
                    width: action._0,
                    size: state.size,
                    clickCount: state.clickCount,
                    actionCount: state.actionCount
                  };
          }
          switch (action) {
            case /* Click */0 :
                return {
                        animation: state.animation,
                        width: state.width,
                        size: state.size,
                        clickCount: state.clickCount + 1 | 0,
                        actionCount: state.actionCount + 1 | 0
                      };
            case /* Reset */1 :
                return {
                        animation: state.animation,
                        width: state.width,
                        size: state.size,
                        clickCount: 0,
                        actionCount: state.actionCount + 1 | 0
                      };
            case /* Unclick */2 :
                return {
                        animation: state.animation,
                        width: state.width,
                        size: state.size,
                        clickCount: state.clickCount - 1 | 0,
                        actionCount: state.actionCount + 1 | 0
                      };
            case /* ToggleSize */3 :
                return {
                        animation: state.animation,
                        width: state.width,
                        size: state.size === /* Small */0 ? /* Large */1 : /* Small */0,
                        clickCount: state.clickCount,
                        actionCount: state.actionCount
                      };
            case /* Close */4 :
                return initialState;
            
          }
        }), initialState);
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          HooksRemoteAction$Reducers.subscribe(dispatch, rAction);
          if (animateMount) {
            Curry._1(dispatch, /* ToggleSize */3);
          }
          return (function (param) {
                    return HooksSpringAnimation$Reducers.stop(state.animation);
                  });
        }), [state]);
  React.useEffect((function () {
          if (Belt_Option.isSome(onClose)) {
            var arg = Caml_option.some(onClose);
            var arg$1 = function (w) {
              return Curry._1(dispatch, /* Width */{
                          _0: w | 0
                        });
            };
            var arg$2 = 50;
            var arg$3 = function (param) {
              return Curry._6(HooksSpringAnimation$Reducers.setOnChange, param, 0.3, 10, arg, arg$1, arg$2);
            };
            Curry._1(arg$3(undefined), state.animation);
          }
          return (function (param) {
                    return Curry._1(dispatch, /* Close */4);
                  });
        }), [state]);
  var buttonLabel = function (state) {
    return text + (" clicks:" + (String(state.clickCount) + (" actions:" + String(state.actionCount))));
  };
  return React.createElement("div", {
              className: "exampleButton large",
              style: {
                width: Px$Reducers.i(state.width)
              },
              onClick: (function (_e) {
                  Curry._1(dispatch, /* Click */0);
                  Curry._1(dispatch, /* ToggleSize */3);
                  var arg = function (w) {
                    return Curry._1(dispatch, /* Width */{
                                _0: w | 0
                              });
                  };
                  var arg$1 = state.size === /* Small */0 ? 250 : 450;
                  var arg$2 = function (param, param$1, param$2) {
                    return Curry._6(HooksSpringAnimation$Reducers.setOnChange, param, param$1, 10, param$2, arg, arg$1);
                  };
                  return Curry._1(arg$2(undefined, undefined, undefined), state.animation);
                })
            }, React.createElement(HooksReanimate$AnimatedButton$Text, {
                  text: buttonLabel(state)
                }));
}

var AnimatedButton = {
  $$Text: $$Text,
  targetHeight: 30,
  closeWidth: 50,
  smallWidth: 250,
  largeWidth: 450,
  make: HooksReanimate$AnimatedButton
};

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
        targetHeight: 30,
        children: React.createElement(HooksReanimate$AnimatedButton, tmp),
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
  var imageGalleryAnimation = React.createElement(HooksReanimate$ImageGalleryAnimation, tmp);
  var rActionHeight = HooksRemoteAction$Reducers.create(undefined);
  var element = React.createElement(AnimateHeight$Reducers.make, {
        rAction: rActionHeight,
        targetHeight: 200,
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
  var match = React.useReducer((function (state, action) {
          if (typeof action === "number") {
            switch (action) {
              case /* AddSelf */0 :
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
        }), initial(undefined));
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          var callback = function () {
            var match = Random.$$int(6);
            var randomAction;
            switch (match) {
              case 0 :
                  randomAction = {
                    TAG: /* AddButton */1,
                    _0: true
                  };
                  break;
              case 1 :
                  randomAction = {
                    TAG: /* AddImage */3,
                    _0: true
                  };
                  break;
              case 2 :
              case 3 :
                  randomAction = /* RemoveItem */4;
                  break;
              case 4 :
                  randomAction = /* DecrementAllButtons */1;
                  break;
              case 5 :
                  randomAction = /* IncrementAllButtons */2;
                  break;
              default:
                throw {
                      RE_EXN_ID: "Assert_failure",
                      _1: [
                        "HooksReanimate.re",
                        619,
                        19
                      ],
                      Error: new Error()
                    };
            }
            Curry._1(dispatch, randomAction);
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

var ReducerAnimationExample = {
  State: State,
  runAll: runAll,
  make: make
};

function HooksReanimate$ChatHead(Props) {
  var rAction = Props.rAction;
  var headNum = Props.headNum;
  var imageGallery = Props.imageGallery;
  var match = React.useReducer((function (state, action) {
          if (action.TAG === /* MoveX */0) {
            return {
                    x: action._0,
                    y: state.y
                  };
          } else {
            return {
                    x: state.x,
                    y: action._0
                  };
          }
        }), {
        x: 0,
        y: 0
      });
  var dispatch = match[1];
  var state = match[0];
  React.useEffect((function () {
          HooksRemoteAction$Reducers.subscribe(dispatch, rAction);
          
        }), []);
  var left = Px$Reducers.f(state.x - 25);
  var top = Px$Reducers.f(state.y - 25);
  if (imageGallery) {
    return React.createElement("div", {
                className: "chat-head-image-gallery",
                style: {
                  left: left,
                  top: top,
                  zIndex: String(-headNum | 0)
                }
              }, React.createElement(HooksReanimate$ImageGalleryAnimation, {
                    initialImage: headNum
                  }));
  } else {
    return React.createElement("div", {
                className: "chat-head chat-head-" + String(headNum % 6),
                style: {
                  left: left,
                  top: top,
                  zIndex: String(-headNum | 0)
                }
              });
  }
}

var ChatHead = {
  make: HooksReanimate$ChatHead
};

function createControl(param) {
  return {
          rAction: HooksRemoteAction$Reducers.create(undefined),
          animX: HooksSpringAnimation$Reducers.create(0),
          animY: HooksSpringAnimation$Reducers.create(0)
        };
}

function HooksReanimate$ChatHeadsExample(Props) {
  var imageGallery = Props.imageGallery;
  var controls = Belt_Array.makeBy(6, (function (param) {
          return createControl(undefined);
        }));
  var chatHeads = Belt_Array.makeBy(6, (function (i) {
          return React.createElement(HooksReanimate$ChatHead, {
                      rAction: Caml_array.get(controls, i).rAction,
                      headNum: i,
                      imageGallery: imageGallery,
                      key: Key$Reducers.gen(undefined)
                    });
        }));
  var match = React.useReducer((function (state, _action) {
          return state;
        }), {
        controls: controls,
        chatHeads: chatHeads
      });
  var match$1 = match[0];
  var controls$1 = match$1.controls;
  React.useEffect((function () {
          Belt_Array.forEachWithIndex(controls$1, (function (i, param) {
                  var setOnChange = function (isX, afterChange) {
                    var control = Caml_array.get(controls$1, i);
                    var animation = isX ? control.animX : control.animY;
                    var arg = function (v) {
                      HooksRemoteAction$Reducers.send(control.rAction, isX ? ({
                                TAG: /* MoveX */0,
                                _0: v
                              }) : ({
                                TAG: /* MoveY */1,
                                _0: v
                              }));
                      return Curry._1(afterChange, v);
                    };
                    var arg$1 = function (param, param$1) {
                      return Curry._5(HooksSpringAnimation$Reducers.setOnChange, HooksSpring$Reducers.gentle, 2, param, param$1, arg);
                    };
                    return Curry._2(arg$1(undefined, undefined), undefined, animation);
                  };
                  var isLastHead = i === 5;
                  var afterChangeX = function (x) {
                    if (isLastHead) {
                      return ;
                    } else {
                      return HooksSpringAnimation$Reducers.setFinalValue(x, Caml_array.get(controls$1, i + 1 | 0).animX);
                    }
                  };
                  var afterChangeY = function (y) {
                    if (isLastHead) {
                      return ;
                    } else {
                      return HooksSpringAnimation$Reducers.setFinalValue(y, Caml_array.get(controls$1, i + 1 | 0).animY);
                    }
                  };
                  setOnChange(true, afterChangeX);
                  return setOnChange(false, afterChangeY);
                }));
          var onMove = function (e) {
            var x = e.pageX;
            var y = e.pageY;
            HooksSpringAnimation$Reducers.setFinalValue(x, Caml_array.get(controls$1, 0).animX);
            return HooksSpringAnimation$Reducers.setFinalValue(y, Caml_array.get(controls$1, 0).animY);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("touchmove", onMove);
          return (function (param) {
                    return Belt_Array.forEach(controls$1, (function (param) {
                                  HooksSpringAnimation$Reducers.stop(param.animX);
                                  return HooksSpringAnimation$Reducers.stop(param.animY);
                                }));
                  });
        }), []);
  return React.createElement("div", undefined, match$1.chatHeads);
}

var ChatHeadsExample = {
  numHeads: 6,
  createControl: createControl,
  make: HooksReanimate$ChatHeadsExample
};

function HooksReanimate$ChatHeadsExampleStarter(Props) {
  var match = React.useState(function () {
        return /* StartMessage */0;
      });
  var dispatch = match[1];
  switch (match[0]) {
    case /* StartMessage */0 :
        console.log("StartMessage clicked");
        return React.createElement("div", undefined, React.createElement("div", undefined, React.createElement("button", {
                            onClick: (function (_e) {
                                return Curry._1(dispatch, (function (param) {
                                              return /* ChatHeads */1;
                                            }));
                              })
                          }, "Start normal chatheads")), React.createElement("button", {
                        onClick: (function (_e) {
                            return Curry._1(dispatch, (function (param) {
                                          return /* ImageGalleryHeads */2;
                                        }));
                          })
                      }, "Start image gallery chatheads"));
    case /* ChatHeads */1 :
        console.log("ChatHeadsExample clicked");
        return React.createElement(HooksReanimate$ChatHeadsExample, {
                    imageGallery: false
                  });
    case /* ImageGalleryHeads */2 :
        console.log("ImageGalleryHeads clicked");
        return React.createElement(HooksReanimate$ChatHeadsExample, {
                    imageGallery: true
                  });
    
  }
}

var ChatHeadsExampleStarter = {
  make: HooksReanimate$ChatHeadsExampleStarter
};

function HooksReanimate$GalleryItem(Props) {
  var titleOpt = Props.title;
  var descriptionOpt = Props.description;
  var children = Props.children;
  var title = titleOpt !== undefined ? titleOpt : "Untitled";
  var description = descriptionOpt !== undefined ? descriptionOpt : "no description";
  var title$1 = React.createElement("div", {
        className: "header"
      }, title);
  var description$1 = React.createElement("div", {
        className: "headerSubtext",
        dangerouslySetInnerHTML: {
          __html: description
        }
      });
  var leftRight = React.createElement("div", {
        className: "galleryItemDemo leftRightContainer"
      }, React.createElement("div", {
            className: "right interactionContainer"
          }, children));
  return React.createElement("div", {
              className: "galleryItem"
            }, title$1, description$1, leftRight);
}

var GalleryItem = {
  make: HooksReanimate$GalleryItem
};

var megaHeaderTitle = "Animating With Reason React Reducers";

var megaHeaderSubtext = "\n    Examples With Animations.\n  ";

var megaHeaderSubtextDetails = "\n    Explore animation with ReasonReact and reducers.\n\n  ";

function HooksReanimate$GalleryContainer(Props) {
  var children = Props.children;
  return React.createElement("div", {
              className: "mainGallery",
              style: {
                width: "850px"
              }
            }, React.createElement("div", {
                  key: "megaHeader",
                  className: "megaHeader"
                }, megaHeaderTitle), React.createElement("div", {
                  key: "degaHeaderSubtext",
                  className: "megaHeaderSubtext"
                }, megaHeaderSubtext), React.createElement("div", {
                  key: "headerSubtext",
                  className: "megaHeaderSubtextDetails"
                }, megaHeaderSubtextDetails), Belt_Array.map(children, (function (c) {
                    return React.createElement("div", {
                                key: Key$Reducers.gen(undefined)
                              }, c);
                  })));
}

var GalleryContainer = {
  megaHeaderTitle: megaHeaderTitle,
  megaHeaderSubtext: megaHeaderSubtext,
  megaHeaderSubtextDetails: megaHeaderSubtextDetails,
  make: HooksReanimate$GalleryContainer
};

function HooksReanimate$ComponentGallery(Props) {
  var globalStateExample = React.createElement(HooksReanimate$GalleryItem, {
        title: "Global State Example",
        description: "",
        children: React.createElement(HooksDemo$Reducers.GlobalStateExample.make, {})
      });
  var localStateExample = React.createElement(HooksReanimate$GalleryItem, {
        title: "Local State Example",
        description: "",
        children: React.createElement(HooksDemo$Reducers.LocalStateExample.make, {})
      });
  var simpleTextInput = React.createElement(HooksReanimate$GalleryItem, {
        title: "Simple Text Input",
        description: "Edit the text field",
        children: React.createElement(HooksDemo$Reducers.TextInput.make, {
              onChange: (function (text) {
                  console.log("onChange:", text);
                  
                })
            })
      });
  var simpleSpring = React.createElement(HooksReanimate$GalleryItem, {
        title: "Simple Spring",
        description: "Click on target to toggle",
        children: React.createElement(HooksDemo$Reducers.SimpleSpring.make, {})
      });
  var animatedTextInput = React.createElement(HooksReanimate$GalleryItem, {
        title: "Animated Text Input",
        description: "Edit text, or click on target to toggle animation",
        children: React.createElement(HooksDemo$Reducers.AnimatedTextInput.make, {})
      });
  var animatedTextInputRemote = React.createElement(HooksReanimate$GalleryItem, {
        title: "Animated Text Input With Remote Actions",
        description: "Edit text, or click on target to toggle animation",
        children: React.createElement(HooksDemo$Reducers.AnimatedTextInputRemote.make, {})
      });
  var callActionsOnGrandChild = React.createElement(HooksReanimate$GalleryItem, {
        title: "Call actions on grandchild directly",
        description: "",
        children: React.createElement(HooksDemo$Reducers.Parent.make, {})
      });
  var chatHeads = React.createElement(HooksReanimate$GalleryItem, {
        title: "Chat Heads Example Starter",
        description: "",
        children: React.createElement(HooksReanimate$ChatHeadsExampleStarter, {})
      });
  var imageGallery = React.createElement(HooksReanimate$GalleryItem, {
        title: "Image Gallery",
        description: " Click on the image to transition to the next one. ",
        children: React.createElement(HooksReanimate$ImageGalleryAnimation, {})
      });
  var reducerAnimation = React.createElement(HooksReanimate$GalleryItem, {
        title: "Animation Based On Reducers",
        description: "",
        children: React.createElement(make, {
              showAllButtons: false
            })
      });
  return React.createElement(HooksReanimate$GalleryContainer, {
              children: [
                globalStateExample,
                localStateExample,
                simpleTextInput,
                simpleSpring,
                animatedTextInput,
                animatedTextInputRemote,
                callActionsOnGrandChild,
                chatHeads,
                imageGallery,
                reducerAnimation
              ]
            });
}

var ComponentGallery = {
  make: HooksReanimate$ComponentGallery
};

var Demo;

exports.ImageTransition = ImageTransition;
exports.ImageGalleryAnimation = ImageGalleryAnimation;
exports.AnimatedButton = AnimatedButton;
exports.ReducerAnimationExample = ReducerAnimationExample;
exports.ChatHead = ChatHead;
exports.ChatHeadsExample = ChatHeadsExample;
exports.ChatHeadsExampleStarter = ChatHeadsExampleStarter;
exports.GalleryItem = GalleryItem;
exports.GalleryContainer = GalleryContainer;
exports.Demo = Demo;
exports.ComponentGallery = ComponentGallery;
/* displayHeightString Not a pure module */
