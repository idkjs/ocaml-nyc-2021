'use strict';

var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Demo$ReasonReactExample = require("./Demo.bs.js");
var ImageGalleryAnimation$ReasonReactExample = require("../hooks-animation/ImageGalleryAnimation.bs.js");
var ChatHeadsExampleStarter$ReasonReactExample = require("./ChatHeadsExampleStarter.bs.js");
var ReducerAnimationExample$ReasonReactExample = require("../hooks-animation/ReducerAnimationExample.bs.js");

function pxI(i) {
  return String(i) + "px";
}

function pxF(v) {
  return String(v | 0) + "px";
}

var counter = {
  contents: 0
};

function gen(param) {
  counter.contents = counter.contents + 1 | 0;
  return String(counter.contents);
}

var Key = {
  counter: counter,
  gen: gen
};

function Reanimate$GalleryItem(Props) {
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
  make: Reanimate$GalleryItem
};

var megaHeaderTitle = "Animating With Reason React Reducers";

var megaHeaderSubtext = "\n    Examples With Animations.\n  ";

var megaHeaderSubtextDetails = "\n    Explore animation with ReasonReact and reducers.\n\n  ";

function Reanimate$GalleryContainer(Props) {
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
                                key: gen(undefined)
                              }, c);
                  })));
}

var GalleryContainer = {
  megaHeaderTitle: megaHeaderTitle,
  megaHeaderSubtext: megaHeaderSubtext,
  megaHeaderSubtextDetails: megaHeaderSubtextDetails,
  make: Reanimate$GalleryContainer
};

function Reanimate$ComponentGallery(Props) {
  var globalStateExample = React.createElement(Reanimate$GalleryItem, {
        title: "Global State Example",
        description: "",
        children: React.createElement(Demo$ReasonReactExample.GlobalStateExample.make, {})
      });
  var localStateExample = React.createElement(Reanimate$GalleryItem, {
        title: "Local State Example",
        description: "",
        children: React.createElement(Demo$ReasonReactExample.LocalStateExample.make, {})
      });
  var simpleTextInput = React.createElement(Reanimate$GalleryItem, {
        title: "Simple Text Input",
        description: "Edit the text field",
        children: React.createElement(Demo$ReasonReactExample.TextInput.make, {
              onChange: (function (text) {
                  console.log("onChange:", text);
                  
                })
            })
      });
  var simpleSpring = React.createElement(Reanimate$GalleryItem, {
        title: "Simple Spring",
        description: "Click on target to toggle",
        children: React.createElement(Demo$ReasonReactExample.SimpleSpring.make, {})
      });
  var animatedTextInput = React.createElement(Reanimate$GalleryItem, {
        title: "Animated Text Input",
        description: "Edit text, or click on target to toggle animation",
        children: React.createElement(Demo$ReasonReactExample.AnimatedTextInput.make, {})
      });
  var animatedTextInputRemote = React.createElement(Reanimate$GalleryItem, {
        title: "Animated Text Input With Remote Actions",
        description: "Edit text, or click on target to toggle animation",
        children: React.createElement(Demo$ReasonReactExample.AnimatedTextInputRemote.make, {})
      });
  var callActionsOnGrandChild = React.createElement(Reanimate$GalleryItem, {
        title: "Call actions on grandchild directly",
        description: "",
        children: React.createElement(Demo$ReasonReactExample.Parent.make, {})
      });
  var chatHeads = React.createElement(Reanimate$GalleryItem, {
        title: "Chat Heads",
        description: "",
        children: React.createElement(ChatHeadsExampleStarter$ReasonReactExample.make, {})
      });
  var imageGallery = React.createElement(Reanimate$GalleryItem, {
        title: "Image Gallery",
        description: " Click on the image to transition to the next one. ",
        children: React.createElement(ImageGalleryAnimation$ReasonReactExample.make, {})
      });
  var reducerAnimation = React.createElement(Reanimate$GalleryItem, {
        title: "Animation Based On Reducers",
        description: "",
        children: React.createElement(ReducerAnimationExample$ReasonReactExample.make, {
              showAllButtons: false
            })
      });
  return React.createElement(Reanimate$GalleryContainer, {
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
  make: Reanimate$ComponentGallery
};

exports.pxI = pxI;
exports.pxF = pxF;
exports.Key = Key;
exports.GalleryItem = GalleryItem;
exports.GalleryContainer = GalleryContainer;
exports.ComponentGallery = ComponentGallery;
/* react Not a pure module */
