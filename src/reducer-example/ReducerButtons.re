include ImageTransition;
type t;
type action =
  | SetAct(t => unit)
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
  type t('a) = {
    act: 'a => unit,
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
  let getElements: t('a) => array(React.element);
  let initial: unit => t('a);
} = {
  type t('a) = {
    act: 'a => unit,
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
let runAll = (action, items) => {
  let performSideEffects = () =>
    Belt.List.forEach(items, ({rActionButton}) =>
      HooksRemoteAction.send(rActionButton, ~action)
    );
  performSideEffects();
  // state;
};
[@react.component]
let rec make = (~showAllButtons) => {
  let self = (~key) =>
    React.createElement(make, makeProps(~key, ~showAllButtons, ()));
  let (state, setState) = React.useState(_ => State.initial());

  // let runAll = action => {
  //   let performSideEffects = () =>
  //     Belt.List.forEach(state.items, ({rActionButton}) =>
  //       HooksRemoteAction.send(rActionButton, ~action)
  //     );
  //   performSideEffects();
  //   // state;
  // };

  let handleAddSelf = () => {
    let key = Key.gen();
    let rActionButton = HooksRemoteAction.create();
    let rActionHeight = HooksRemoteAction.create();
    //      let element =
    // <AnimateHeight key rAction=rActionHeight targetHeight=500.>
    //   {Self.make(~key,)}
    // </AnimateHeight>;
    let element =
      <AnimateHeight key rAction=rActionHeight targetHeight=500.>
        {React.string(
           "Items:" ++ string_of_int(Belt.List.length(state.items)),
         )}
        {self(~key)}
      </AnimateHeight>;
    let item = {element, rActionButton, rActionHeight, closing: false};
    setState(_ => {...state, items: [item, ...state.items]});
  };
  let handleFilterOutItem = rAction => {
    let filter = item => item.rActionHeight !== rAction;
    setState(_ => {...state, items: Belt.List.keep(state.items, filter)});
  };
  let handleSetAct= (act)=>  setState(_ => {...state,act });
  let handleAddButton =(animateMount) => {
    let removeFromList = (rActionHeight:HooksRemoteAction.t(AnimateHeight.action)) => state.act(handleFilterOutItem(rActionHeight));
    setState(_ =>
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
      }
    );
  };
  let handleAddButtonFirst = animateMount => {
    let removeFromList = rActionHeight =>
      state.act(handleFilterOutItem(rActionHeight));
    setState(_ =>
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
      }
    );
  };

  let handleAddImage = animateMount =>
    setState(_ =>
      {
        ...state,
        items: [
          State.createImage(~animateMount, Belt.List.length(state.items)),
          ...state.items,
        ],
      }
    );



  // let handleDecrementAllButtons = () => runAll(Unclick,state.items);

  // let handleIncrementAllButtons = () => runAll(Click,state.items);

  // let handleCloseAllButtons = () => runAll(Close,state.items);
  // let handleResetAllButtons = () => runAll(Reset,state.items);

  let handleRemoveItem = () =>
    switch (Belt.List.getBy(state.items, item => item.closing == false)) {
    | Some(firstItemNotClosing) =>
      let onBeginClosing = Some(() => firstItemNotClosing.closing = true);
      let onClose =
        Some(
          () => state.act(handleFilterOutItem(firstItemNotClosing.rActionHeight)),
        );
      HooksRemoteAction.send(
        firstItemNotClosing.rActionHeight,
        ~action=BeginClosing(onBeginClosing, onClose),
      );

    | None => ()
    };

  let iterClose = fn =>
    Belt.List.forEach(state.items, item =>
      HooksRemoteAction.send(item.rActionHeight, ~action=Close(Some(fn)))
    );
  let iterOpen = fn =>
    Belt.List.forEach(state.items, item =>
      HooksRemoteAction.send(item.rActionHeight, ~action=Open(Some(fn)))
    );
  let onClose = (count, fn, ()) => {
    decr(count);
    if (count^ == 0) {
      switch (fn) {
      | None => ()
      | Some(f) => f()
      };
    };
  };
  let handleCloseHeight = onStop => {
    let len = Belt.List.length(state.items);
    let count = ref(len);
    // let onClose = (count, onStop);

    iterClose(onClose(count, onStop));
  };

  let handleOpenHeight = onStop => {
    let len = Belt.List.length(state.items);
    let count = ref(len);
    iterOpen(onClose(count, onStop));
  };
  let handleReverseWithSideEffects = performSideEffects => {
    setState(_ => {...state, items: Belt.List.reverse(state.items)})
    |> ignore;
    performSideEffects();
  };

  let handleReverseItemsAnimation = () => {
    let onStopClose = () =>
      state.act(handleReverseWithSideEffects(() => state.act(handleOpenHeight(None))));
    state.act(handleCloseHeight(Some(onStopClose)));
  };

  let handleToggleRandomAnimation = () => {
    HooksAnimation.isActive(state.randomAnimation)
      ? HooksAnimation.stop(state.randomAnimation)
      : HooksAnimation.start(state.randomAnimation);
  };
  // React.useEffect0(() => {
  //   let callback =
  //     (.) => {
  //       let randomAction =
  //         switch (Random.int(6)) {
  //         | 0 => handleAddButton(true)
  //         // | 0 => handleAddImage(true)
  //         | 1 => handleAddImage(true)
  //         | 2 => handleRemoveItem()
  //         | 3 => handleRemoveItem()
  //         | 4 => runAll(Unclick,state.items)
  //         | 5 => runAll(Click,state.items)
  //         | _ => assert(false)
  //         };
  //         setState(_ => {...state, act:_=>randomAction})
  //       // handleSetAct(_=>randomAction);
  //       // randomAction()->handleSetAct;
  //       // randomAction;
  //       HooksAnimation.Continue;
  //     };
  //   // handleSetAct(randomAction);
  //   HooksAnimation.setCallback(state.randomAnimation, ~callback);
  //   Some(() => HooksAnimation.stop(state.randomAnimation));
  // });

  let button = (~repeat=1, ~hide=false, txt, fn) =>
    hide
      ? React.null
      : <div
          className="exampleButton large"
          style={ReactDOMRe.Style.make(~width="220px", ())}
          onClick={_e =>
            for (_ in 1 to repeat) {
              state.act(fn);
            }
          }>
          {React.string(txt)}
        </div>;
  let hide = !showAllButtons;
  <div className="componentBox">
    <div className="componentColumn">
      {React.string("Control:")}
      // {button("Add Button", handleAddButton(true))}
      // {button("Add Image", handleAddImage(true))}
      // {button("Add Button On Top", handleAddButtonFirst(true))}
      // {button("Remove Item", handleRemoveItem())}
      // {button(
      //    ~hide,
      //    ~repeat=100,
      //    "Add 100 Buttons On Top",
      //    handleAddButtonFirst(false),
      //  )}
      // {button(~hide, ~repeat=100, "Add 100 Images", handleAddImage(false))}
      // {button("Click all the Buttons", runAll(Click,state.items))}
      // {button(~hide, "Unclick all the Buttons", runAll(Unclick,state.items))}
      // {button("Close all the Buttons", runAll(Close,state.items))}
      // {button(
      //    ~hide,
      //    ~repeat=10,
      //    "Click all the Buttons 10 times",
      //    runAll(Click,state.items),
      //  )}
      // {button(~hide, "Reset all the Buttons' states", runAll(Reset,state.items))}
      // {button("Reverse Items", handleReverseItemsAnimation())}
      // {button(
      //    "Random Animation "
      //    ++ (HooksAnimation.isActive(state.randomAnimation) ? "ON" : "OFF"),
      //    handleToggleRandomAnimation(),
      //  )}
      {button("Add Self", handleAddSelf())}
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
