// module SpringAnimation = HooksSpringAnimation
// module RemoteAction = HooksRemoteAction
module ImageTransition: {
  /***
   * Render function for a transition between two images.
   * phase is a value between 0.0 (first image) and 1.0 (second image).
   **/
  let render: (~phase: float, int, int) => React.element;
  let displayHeight: int;
} = {
  let numImages = 6;
  let displayHeight = 200;
  let displayHeightString = Px.i(displayHeight);
  let sizes = [|
    (500, 350),
    (800, 600),
    (800, 400),
    (700, 500),
    (200, 650),
    (600, 600),
  |];
  let displayWidths =
    Belt.Array.map(sizes, ((w, h)) => w * displayHeight / h);
  let getWidth = i => displayWidths[(i + numImages) mod numImages];

  /***
   * Interpolate width and left for 2 images, phase is between 0.0 and 1.0.
   **/
  let interpolate = (~width1, ~width2, phase) => {
    let width1 = float_of_int(width1);
    let width2 = float_of_int(width2);
    let width = width1 *. (1. -. phase) +. width2 *. phase;
    let left1 = -. (width1 *. phase);
    let left2 = left1 +. width1;
    (Px.f(width), Px.f(left1), Px.f(left2));
  };

  let renderImage = (~left, i) => {
    let src = {
      "./" ++ string_of_int((i + numImages) mod numImages) ++ ".jpg";
    };
    Js.log("src: " ++ src);
    <img
      className="photo-inner"
      style={ReactDOMRe.Style.make(~height=displayHeightString, ~left, ())}
      src={"./" ++ string_of_int((i + numImages) mod numImages) ++ ".jpg"}
    />;
  };
  let render = (~phase, image1, image2) => {
    Js.log("ImageRender called");
    Js.log4("ImageRender args: ", phase, image1, image2);
    let width1 = getWidth(image1);
    let width2 = getWidth(image2);
    let (width, left1, left2) = interpolate(~width1, ~width2, phase);
    <div>
      <div
        className="photo-outer"
        style={ReactDOMRe.Style.make(~height=displayHeightString, ~width, ())}>
        {renderImage(~left=left1, image1)}
        {renderImage(~left=left2, image2)}
      </div>
    </div>;
  };
};

module ImageGalleryAnimation = {
  type action =
    | Click
    | SetCursor(float);
  type state = {
    animation: HooksSpringAnimation.t,
    /* cursor value 3.5 means half way between image 3 and image 4 */
    cursor: float,
    targetImage: int,
  };
  [@react.component]
  let make = (~initialImage=0, ~animateMount=true) => {
    // let initialState = {
    //   animation: HooksSpringAnimation.create(float_of_int(initialImage)),
    //   cursor: float_of_int(initialImage),
    //   targetImage: initialImage,
    // };
    let handleClick = (~animation, ~targetImage) => {
      Js.log("HandleClick called");
      animation
      |> HooksSpringAnimation.setFinalValue(float_of_int(targetImage));
    };
    let (state, dispatch) =
      React.useReducer(
        (state, action) =>
          switch (action) {
          | Click =>
            let state = {...state, targetImage: state.targetImage + 1};
            let _ =
              handleClick(
                ~animation=state.animation,
                ~targetImage=state.targetImage,
              );
            // let animation= {let x =HooksSpringAnimation.setFinalValue(float_of_int(state.targetImage));
            // x};
            // {...state,animation}
            state;
          | SetCursor(cursor) => {...state, cursor}
          },
        {
          animation: HooksSpringAnimation.create(float_of_int(initialImage)),
          cursor: float_of_int(initialImage),
          targetImage: initialImage,
        },
      );
    // let handleClick = () => {
    //   Js.log("HandleClick called");
    //   state.animation
    //   |> HooksSpringAnimation.setFinalValue(float_of_int(state.targetImage));

    //   dispatch(Click);
    // };
    React.useEffect0(
      () => {
        state.animation
        |> HooksSpringAnimation.setOnChange(~precision=0.05, ~onChange=cursor =>
             dispatch(SetCursor(cursor))
           );
        if (animateMount) {
          // handleClick();
          dispatch(Click);
        };
        Some(() => HooksSpringAnimation.stop(state.animation));
      },
      // [|state|],
    );

    let image = int_of_float(state.cursor);
    let phase = state.cursor -. float_of_int(image);
    <div onClick={_e => dispatch(Click)}>
      {ImageTransition.render(~phase, image, image + 1)}
    </div>;
  };
};

module AnimatedButton = {
  module Text = {
    [@react.component]
    let make = (~text) => {
      <button> {React.string(text)} </button>;
    };
  };
  type size =
    | Small
    | Large;
  let targetHeight = 30.;
  let closeWidth = 50.;
  let smallWidth = 250.;
  let largeWidth = 450.;
  type state = {
    animation: HooksSpringAnimation.t,
    width: int,
    size,
    clickCount: int,
    actionCount: int,
  };
  type action =
    | Click
    | Reset
    | Unclick
    /* Width action triggered during animation.  */
    | Width(int)
    /* Toggle the size between small and large, and animate the width. */
    | ToggleSize
    /* Close the button by animating the width to shrink. */
    | Close;
  [@react.component]
  let make = (~text="Button", ~rAction, ~animateMount=true, ~onClose=?) => {
    let initialState = {
      animation: HooksSpringAnimation.create(smallWidth),
      width: int_of_float(smallWidth),
      size: Small,
      clickCount: 0,
      actionCount: 0,
    };
    let (state, dispatch) =
      React.useReducer(
        (state, action) =>
          switch (action) {
          | Click => {
              ...state,
              clickCount: state.clickCount + 1,
              actionCount: state.actionCount + 1,
            }
          | Reset => {
              ...state,
              clickCount: 0,
              actionCount: state.actionCount + 1,
            }
          | Unclick => {
              ...state,
              clickCount: state.clickCount - 1,
              actionCount: state.actionCount + 1,
            }
          | Width(width) => {...state, width}
          | ToggleSize => {
              ...state,
              size: state.size == Small ? Large : Small,
            }
          | Close => initialState
          },
        initialState,
      );
    React.useEffect1(
      () => {
        HooksRemoteAction.subscribe(~send=dispatch, rAction) |> ignore;
        if (animateMount) {
          dispatch(ToggleSize);
        };
        Some(() => HooksSpringAnimation.stop(state.animation));
      },
      [|state|],
    );
    React.useEffect1(
      () => {
        if (onClose->Belt.Option.isSome) {
          state.animation
          |> HooksSpringAnimation.setOnChange(
               ~finalValue=closeWidth,
               ~speedup=0.3,
               ~precision=10.,
               ~onStop=onClose,
               ~onChange=w =>
               dispatch(Width(int_of_float(w)))
             );
        };
        Some(() => dispatch(Close));
      },
      [|state|],
    );
    let handleToggleSize = () => {
      dispatch(ToggleSize);
      state.animation
      |> HooksSpringAnimation.setOnChange(
           ~finalValue=state.size == Small ? smallWidth : largeWidth,
           ~precision=10.,
           ~onChange=w =>
           dispatch(Width(int_of_float(w)))
         );
    };
    let handleClick = () => {
      dispatch(Click);
      handleToggleSize();
    };

    let buttonLabel = state =>
      text
      ++ " clicks:"
      ++ string_of_int(state.clickCount)
      ++ " actions:"
      ++ string_of_int(state.actionCount);
    <div
      className="exampleButton large"
      onClick={_e => handleClick()}
      style={ReactDOMRe.Style.make(~width=Px.i(state.width), ())}>
      <Text text={buttonLabel(state)} />
    </div>;
  };
};

// module AnimateHeight = {
//   /* When the closing animation begins */
//   type onBeginClosing = HooksAnimation.onStop;
//   type action =
//     | Open(HooksAnimation.onStop)
//     | BeginClosing(onBeginClosing, HooksAnimation.onStop)
//     | Close(HooksAnimation.onStop)
//     | Animate(float, HooksAnimation.onStop)
//     | Height(float);
//   type state = {
//     height: float,
//     animation: HooksSpringAnimation.t,
//   };
//   [@react.component]
//   let make = (~rAction, ~targetHeight, ~children) => {

//     let initialState = {height: 0., animation: HooksSpringAnimation.create(0.)};
//     React.useEffect0(() => {
//       HooksRemoteAction.subscribe(~send, rAction) |> ignore;
//       send(Animate(targetHeight, None));
//     };
//     let (state, dispatch) = React.useReducer(state,action) =>
//       switch (action) {
//       | Height(v) => {...state, height: v})
//       | Animate(finalValue, onStop) =>
//         SideEffects(
//           (
//             ({send}) =>
//               state.animation
//               |> HooksSpringAnimation.setOnChange(
//                    ~finalValue, ~precision=10., ~onStop, ~onChange=h =>
//                    send(Height(h))
//                  )
//           ),
//         )
//       | Close(onClose) =>
//         SideEffects((({send}) => send(Animate(0., onClose))))
//       | BeginClosing(onBeginClosing, onClose) =>
//         SideEffects(
//           (
//             ({send}) => {
//               switch (onBeginClosing) {
//               | None => ()
//               | Some(f) => f()
//               };
//               send(Animate(0., onClose));
//             }
//           ),
//         )
//       | Open(onOpen) =>
//         SideEffects((({send}) => send(Animate(targetHeight, onOpen))))
//       },
//     willUnmount: ({state}) => HooksSpringAnimation.stop(state.animation);
//       <div
//         style={
//           ReactDOMRe.Style.make(
//             ~height=Px.f(state.height),
//             ~overflow="hidden",
//             (),
//           )
//         }>
//         {React.array(children)}
//       </div>
//   };
// };

module ReducerAnimationExample = {
  type action =
    | SetAct(action => unit)
    | AddSelf
    | AddButton(bool)
    | AddButtonFirst(bool)
    | AddImage(bool)
    | DecrementAllButtons
    /* Remove from the list the button uniquely identified by its height RemoteAction */
    | FilterOutItem(HooksRemoteAction.t(AnimateHeight.action))
    | IncrementAllButtons
    | CloseAllButtons
    | RemoveItem
    | ResetAllButtons
    | ReverseItemsAnimation
    | CloseHeight(HooksAnimation.onStop) /* Used by ReverseAnim */
    | ReverseWithSideEffects(unit => unit) /* Used by ReverseAnim */
    | OpenHeight(HooksAnimation.onStop) /* Used by ReverseAnim */
    | ToggleRandomAnimation;
  type item = {
    element: React.element,
    rActionButton: HooksRemoteAction.t(AnimatedButton.action),
    rActionHeight: HooksRemoteAction.t(AnimateHeight.action),
    /* used while removing items, to find the first item not already closing */
    mutable closing: bool,
  };
  module State: {
    type t = {
      act: action => unit,
      randomAnimation: HooksAnimation.t,
      items: list(item),
    };
    let createButton:
      (
        ~removeFromList: HooksRemoteAction.t(AnimateHeight.action) => unit,
        ~animateMount: bool=?,
        int
      ) =>
      item;
    let createImage: (~animateMount: bool=?, int) => item;
    let getElements: t => array(React.element);
    let initial: unit => t;
  } = {
    type t = {
      act: action => unit,
      randomAnimation: HooksAnimation.t,
      items: list(item),
    };
    let initial = () => {
      act: _action => (),
      randomAnimation: HooksAnimation.create(),
      items: [],
    };
    let getElements = ({items}) =>
      Belt.List.toArray(Belt.List.mapReverse(items, x => x.element));
    let createButton = (~removeFromList, ~animateMount=?, number) => {
      let rActionButton = HooksRemoteAction.create();
      let rActionHeight = HooksRemoteAction.create();
      let key = Key.gen();
      let onClose = () =>
        HooksRemoteAction.send(
          rActionHeight,
          ~action=
            AnimateHeight.Close(Some(() => removeFromList(rActionHeight))),
        );
      let element: React.element =
        <AnimateHeight
          key rAction=rActionHeight targetHeight=AnimatedButton.targetHeight>
          <AnimatedButton
            key
            text={"Button#" ++ string_of_int(number)}
            rAction=rActionButton
            ?animateMount
            onClose
          />
        </AnimateHeight>;
      {element, rActionButton, rActionHeight, closing: false};
    };
    let createImage = (~animateMount=?, number) => {
      let key = Key.gen();
      let rActionButton = HooksRemoteAction.create();
      let imageGalleryAnimation =
        <ImageGalleryAnimation
          key={Key.gen()}
          initialImage=number
          ?animateMount
        />;
      let rActionHeight = HooksRemoteAction.create();
      let element =
        <AnimateHeight
          key
          rAction=rActionHeight
          targetHeight={float_of_int(ImageTransition.displayHeight)}>
          imageGalleryAnimation
        </AnimateHeight>;
      {element, rActionButton, rActionHeight, closing: false};
    };
  };
  // let runAll = action => {
  //   let performSideEffects = ({ReasonReact.state: {State.items}}) =>
  //     Belt.List.forEach(items, ({rActionButton}) =>
  //       HooksRemoteAction.send(rActionButton, ~action)
  //     );
  //   ReasonReact.SideEffects(performSideEffects);
  // };
  let runAll = (action, state: State.t) => {
    let performSideEffects = () =>
      Belt.List.forEach(state.items, ({rActionButton}) =>
        HooksRemoteAction.send(rActionButton, ~action)
      );
    performSideEffects();
    // state;
  };
  [@react.component]
  let rec make = (~showAllButtons) => {
    let self = (~key) =>
      React.createElement(make, makeProps(~key, ~showAllButtons, ()));
    let (state, dispatch) =
      React.useReducer(
        (state: State.t, action) =>
          switch (action) {
          | SetAct(act) => {...state, act}
          | AddSelf =>
            // module Self = {
            //   let make = make(~showAllButtons);
            // };
            let key = Key.gen();
            let rActionButton = HooksRemoteAction.create();
            let rActionHeight = HooksRemoteAction.create();
            let element =
              <AnimateHeight key rAction=rActionHeight targetHeight=500.>
                {self(~key)}
              </AnimateHeight>;
            let item = {
              element,
              rActionButton,
              rActionHeight,
              closing: false,
            };
            {...state, items: [item, ...state.items]};
          | AddButton(animateMount) =>
            let removeFromList = rActionHeight =>
              state.act(FilterOutItem(rActionHeight));
            {
              ...state,
              items: [
                State.createButton(
                  ~removeFromList,
                  ~animateMount,
                  Belt.List.length(state.items),
                ),
                ...state.items,
              ],
            };
          | AddButtonFirst(animateMount) =>
            let removeFromList = rActionHeight =>
              state.act(FilterOutItem(rActionHeight));
            {
              ...state,
              items:
                state.items
                @ [
                  State.createButton(
                    ~removeFromList,
                    ~animateMount,
                    Belt.List.length(state.items),
                  ),
                ],
            };
          | AddImage(animateMount) => {
              ...state,
              items: [
                State.createImage(
                  ~animateMount,
                  Belt.List.length(state.items),
                ),
                ...state.items,
              ],
            }
          | FilterOutItem(rAction) =>
            let filter = item => item.rActionHeight !== rAction;
            {...state, items: Belt.List.keep(state.items, filter)};
          | DecrementAllButtons =>
            runAll(Unclick, state);
            state;
          | IncrementAllButtons =>
            runAll(Click, state);
            state;
          | CloseAllButtons =>
            runAll(Close, state);
            state;
          | RemoveItem =>
            switch (
              Belt.List.getBy(state.items, item => item.closing == false)
            ) {
            | Some(firstItemNotClosing) =>
              let onBeginClosing =
                Some(() => firstItemNotClosing.closing = true);
              let onClose =
                Some(
                  () =>
                    state.act(
                      FilterOutItem(firstItemNotClosing.rActionHeight),
                    ),
                );
              HooksRemoteAction.send(
                firstItemNotClosing.rActionHeight,
                ~action=BeginClosing(onBeginClosing, onClose),
              );
              state;
            | None => state
            }
          | ResetAllButtons =>
            runAll(Reset, state);
            state;
          | CloseHeight(onStop) =>
            let len = Belt.List.length(state.items);
            let count = ref(len);
            let onClose = () => {
              decr(count);
              if (count^ == 0) {
                switch (onStop) {
                | None => ()
                | Some(f) => f()
                };
              };
            };
            let iter = _ =>
              Belt.List.forEach(state.items, item =>
                HooksRemoteAction.send(
                  item.rActionHeight,
                  ~action=Close(Some(onClose)),
                )
              );
            iter();
            state;
          | OpenHeight(onStop) =>
            let len = Belt.List.length(state.items);
            let count = ref(len);
            let onClose = () => {
              decr(count);
              if (count^ == 0) {
                switch (onStop) {
                | None => ()
                | Some(f) => f()
                };
              };
            };
            let iter = _ =>
              Belt.List.forEach(state.items, item =>
                HooksRemoteAction.send(
                  item.rActionHeight,
                  ~action=Open(Some(onClose)),
                )
              );
            iter();
            state;
          | ReverseWithSideEffects(performSideEffects) =>
            {...state, items: Belt.List.reverse(state.items)} |> ignore;
            performSideEffects();
            state;
          | ReverseItemsAnimation =>
            let onStopClose = () =>
              state.act(
                ReverseWithSideEffects(() => state.act(OpenHeight(None))),
              );
            state.act(CloseHeight(Some(onStopClose)));
            state;
          | ToggleRandomAnimation =>
            HooksAnimation.isActive(state.randomAnimation)
              ? HooksAnimation.stop(state.randomAnimation)
              : HooksAnimation.start(state.randomAnimation);
            state;
          },
        State.initial(),
      );
    React.useEffect0(() => {
      let callback =
        (.) => {
          let randomAction =
            switch (Random.int(6)) {
            | 0 => AddButton(true)
            | 1 => AddImage(true)
            | 2 => RemoveItem
            | 3 => RemoveItem
            | 4 => DecrementAllButtons
            | 5 => IncrementAllButtons
            | _ => assert(false)
            };
          dispatch(randomAction);
          HooksAnimation.Continue;
        };
      dispatch(SetAct(dispatch));
      HooksAnimation.setCallback(state.randomAnimation, ~callback);
      Some(() => HooksAnimation.stop(state.randomAnimation));
    });

    let button = (~repeat=1, ~hide=false, txt, action) =>
      hide
        ? ReasonReact.null
        : <div
            className="exampleButton large"
            style={ReactDOMRe.Style.make(~width="220px", ())}
            onClick={_e =>
              for (_ in 1 to repeat) {
                state.act(action);
              }
            }>
            {React.string(txt)}
          </div>;
    let hide = !showAllButtons;
    <div className="componentBox">
      <div className="componentColumn">
        {React.string("Control:")}
        {button("Add Button", AddButton(true))}
        {button("Add Image", AddImage(true))}
        {button("Add Button On Top", AddButtonFirst(true))}
        {button("Remove Item", RemoveItem)}
        {button(
           ~hide,
           ~repeat=100,
           "Add 100 Buttons On Top",
           AddButtonFirst(false),
         )}
        {button(~hide, ~repeat=100, "Add 100 Images", AddImage(false))}
        {button("Click all the Buttons", IncrementAllButtons)}
        {button(~hide, "Unclick all the Buttons", DecrementAllButtons)}
        {button("Close all the Buttons", CloseAllButtons)}
        {button(
           ~hide,
           ~repeat=10,
           "Click all the Buttons 10 times",
           IncrementAllButtons,
         )}
        {button(~hide, "Reset all the Buttons' states", ResetAllButtons)}
        {button("Reverse Items", ReverseItemsAnimation)}
        {button(
           "Random Animation "
           ++ (HooksAnimation.isActive(state.randomAnimation) ? "ON" : "OFF"),
           ToggleRandomAnimation,
         )}
        {button("Add Self", AddSelf)}
      </div>
      <div
        className="componentColumn"
        style={ReactDOMRe.Style.make(~width="500px", ())}>
        <div>
          {React.string(
             "Items:" ++ string_of_int(Belt.List.length(state.items)),
           )}
        </div>
        {React.array(State.getElements(state))}
      </div>
    </div>;
  };
};

module ChatHead = {
  type action =
    | MoveX(float)
    | MoveY(float);
  type state = {
    x: float,
    y: float,
  };
  [@react.component]
  let make = (~rAction, ~headNum, ~imageGallery) => {
    let (state, dispatch) =
      React.useReducer(
        (state: state, action) =>
          switch (action) {
          | MoveX(x) => {...state, x}
          | MoveY(y) => {...state, y}
          },
        {x: 0., y: 0.},
      );
    React.useEffect0(() => {
      HooksRemoteAction.subscribe(~send=dispatch, rAction) |> ignore;
      None;
    });

    let left = Px.f(state.x -. 25.);
    let top = Px.f(state.y -. 25.);
    imageGallery
      ? <div
          className="chat-head-image-gallery"
          style={ReactDOMRe.Style.make(
            ~left,
            ~top,
            ~zIndex=string_of_int(- headNum),
            (),
          )}>
          <ImageGalleryAnimation initialImage=headNum />
        </div>
      : <div
          className={"chat-head chat-head-" ++ string_of_int(headNum mod 6)}
          style={ReactDOMRe.Style.make(
            ~left,
            ~top,
            ~zIndex=string_of_int(- headNum),
            (),
          )}
        />;
  };
};

module ChatHeadsExample = {
  [@bs.val]
  external addEventListener: (string, Js.t({..}) => unit) => unit =
    "window.addEventListener";
  let numHeads = 6;
  type control = {
    rAction: HooksRemoteAction.t(ChatHead.action),
    animX: HooksSpringAnimation.t,
    animY: HooksSpringAnimation.t,
  };
  type state = {
    controls: array(control),
    chatHeads: array(React.element),
  };
  let createControl = () => {
    rAction: HooksRemoteAction.create(),
    animX: HooksSpringAnimation.create(0.),
    animY: HooksSpringAnimation.create(0.),
  };

  [@react.component]
  let make = (~imageGallery) => {
    let ({chatHeads, controls}, _) =
      React.useReducer(
        (state, _action) => state,
        {
          let controls = Belt.Array.makeBy(numHeads, _ => createControl());
          let chatHeads =
            Belt.Array.makeBy(numHeads, i =>
              <ChatHead
                key={Key.gen()}
                imageGallery
                rAction={controls[i].rAction}
                headNum=i
              />
            );

          {controls, chatHeads};
        },
      );

    React.useEffect0(() => {
      let setupAnimation = headNum => {
        let setOnChange = (~isX, afterChange) => {
          let control = controls[headNum];
          let animation = isX ? control.animX : control.animY;
          animation
          |> HooksSpringAnimation.setOnChange(
               ~preset=HooksSpring.gentle,
               ~speedup=2.,
               ~onChange=v => {
                 HooksRemoteAction.send(
                   control.rAction,
                   ~action=isX ? MoveX(v) : MoveY(v),
                 );
                 afterChange(v);
               },
             );
        };
        let isLastHead = headNum == numHeads - 1;
        let afterChangeX = x =>
          isLastHead
            ? ()
            : controls[headNum + 1].animX
              |> HooksSpringAnimation.setFinalValue(x);
        let afterChangeY = y =>
          isLastHead
            ? ()
            : controls[headNum + 1].animY
              |> HooksSpringAnimation.setFinalValue(y);
        setOnChange(~isX=true, afterChangeX);
        setOnChange(~isX=false, afterChangeY);
      };
      Belt.Array.forEachWithIndex(controls, (i, _) => setupAnimation(i));
      let onMove = e => {
        let x = e##pageX;
        let y = e##pageY;
        controls[0].animX |> HooksSpringAnimation.setFinalValue(x);
        controls[0].animY |> HooksSpringAnimation.setFinalValue(y);
      };
      addEventListener("mousemove", onMove);
      addEventListener("touchmove", onMove);

      Some(
        () =>
          Belt.Array.forEach(
            controls,
            ({animX, animY}) => {
              HooksSpringAnimation.stop(animX);
              HooksSpringAnimation.stop(animY);
            },
          ),
      );
    });

    <div> {React.array(chatHeads)} </div>;
  };
};

module ChatHeadsExampleStarter = {
  type state =
    | StartMessage
    | ChatHeads
    | ImageGalleryHeads;
  [@react.component]
  let make = () => {
    let (state, dispatch) = React.useState(() => StartMessage);
    switch (state) {
    | StartMessage =>
      Js.log("StartMessage clicked");
      <div>
        <div>
          <button onClick={_e => dispatch(_ => ChatHeads)}>
            {React.string("Start normal chatheads")}
          </button>
        </div>
        <button onClick={_e => dispatch(_ => ImageGalleryHeads)}>
          {React.string("Start image gallery chatheads")}
        </button>
      </div>;
    | ChatHeads =>
      Js.log("ChatHeadsExample clicked");
      <ChatHeadsExample imageGallery=false />;

    | ImageGalleryHeads =>
      Js.log("ImageGalleryHeads clicked");
      <ChatHeadsExample imageGallery=true />;
    // | ChatHeads =>
    //   React.createElement(
    //     ChatHeadsExample.make,
    //     ChatHeadsExample.makeProps(~imageGallery=false, ()),
    //   )
    // | ImageGalleryHeads =>
    //   React.createElement(
    //     ChatHeadsExample.make,
    //     ChatHeadsExample.makeProps(~imageGallery=true, ()),
    //   )
    };
  };
};

module GalleryItem = {
  [@react.component]
  let make = (~title="Untitled", ~description="no description", ~children) => {
    let title = <div className="header"> {React.string(title)} </div>;
    let description =
      <div
        className="headerSubtext"
        dangerouslySetInnerHTML={"__html": description}
      />;
    let leftRight =
      <div className="galleryItemDemo leftRightContainer">
        <div className="right interactionContainer"> children </div>
      </div>;

    <div className="galleryItem"> title description leftRight </div>;
  };
};

module GalleryContainer = {
  let megaHeaderTitle = "Animating With Reason React Reducers";
  let megaHeaderSubtext = {|
    Examples With Animations.
  |};
  let megaHeaderSubtextDetails = {|
    Explore animation with ReasonReact and reducers.

  |};
  [@react.component]
  let make = (~children) => {
    <div
      className="mainGallery"
      style={ReactDOMRe.Style.make(~width="850px", ())}>
      <div key="megaHeader" className="megaHeader">
        {React.string(megaHeaderTitle)}
      </div>
      <div key="degaHeaderSubtext" className="megaHeaderSubtext">
        {React.string(megaHeaderSubtext)}
      </div>
      <div key="headerSubtext" className="megaHeaderSubtextDetails">
        {React.string(megaHeaderSubtextDetails)}
      </div>
      {React.array(
         Belt.Array.map(children, c => <div key={Key.gen()}> c </div>),
       )}
    </div>;
  };
};
module Demo = HooksDemo;
module ComponentGallery = {
  [@react.component]
  let make = () => {
    let globalStateExample =
      <GalleryItem title="Global State Example" description={||}>
        ...<Demo.GlobalStateExample />
      </GalleryItem>;
    let localStateExample =
      <GalleryItem title="Local State Example" description={||}>
        ...<Demo.LocalStateExample />
      </GalleryItem>;
    let simpleTextInput =
      <GalleryItem
        title="Simple Text Input" description={|Edit the text field|}>
        ...<Demo.TextInput onChange={text => Js.log2("onChange:", text)} />
      </GalleryItem>;
    let simpleSpring =
      <GalleryItem
        title="Simple Spring" description={|Click on target to toggle|}>
        ...<Demo.SimpleSpring />
      </GalleryItem>;
    let animatedTextInput =
      <GalleryItem
        title="Animated Text Input"
        description={|Edit text, or click on target to toggle animation|}>
        ...<Demo.AnimatedTextInput />
      </GalleryItem>;
    let animatedTextInputRemote =
      <GalleryItem
        title="Animated Text Input With Remote Actions"
        description={|Edit text, or click on target to toggle animation|}>
        ...<Demo.AnimatedTextInputRemote />
      </GalleryItem>;
    let callActionsOnGrandChild =
      <GalleryItem
        title="Call actions on grandchild directly" description={||}>
        ...<Demo.Parent />
      </GalleryItem>;
    let chatHeads =
      <GalleryItem title="Chat Heads Example Starter" description={||}>
        ...<ChatHeadsExampleStarter />
      </GalleryItem>;
    let imageGallery =
      <GalleryItem
        title="Image Gallery"
        description={| Click on the image to transition to the next one. |}>
        ...<ImageGalleryAnimation />
      </GalleryItem>;
    let reducerAnimation =
      <GalleryItem title="Animation Based On Reducers" description={||}>
        ...<ReducerAnimationExample showAllButtons=false />
      </GalleryItem>;
    <GalleryContainer>
      [|
        globalStateExample,
        localStateExample,
        simpleTextInput,
        simpleSpring,
        animatedTextInput,
        animatedTextInputRemote,
        callActionsOnGrandChild,
        chatHeads,
        imageGallery,
        reducerAnimation,
      |]
    </GalleryContainer>;
  };
};
