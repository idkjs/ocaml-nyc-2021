include ImageTransition;
module R = React;
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

module State = {
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
          let item = {element, rActionButton, rActionHeight, closing: false};
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
          switch (Belt.List.getBy(state.items, item => item.closing == false)) {
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


  let handleDecrementAllButtons =
    R.useCallback(_ => dispatch(DecrementAllButtons));
  let handleIncrementAllButtons =
    R.useCallback(_ => dispatch(IncrementAllButtons));

  let handleCloseAllButtons = R.useCallback(_ => dispatch(CloseAllButtons));
  let handleAddSelf = R.useCallback(_ => dispatch(AddSelf));
  let handleRemoveItem = R.useCallback(_ => dispatch(RemoveItem));
  let handleToggleRandomAnimation= R.useCallback(_ => dispatch(ToggleRandomAnimation));
  // React.useEffect0(() => {
  //   let callback =
  //     (.) => {
  //       let randomAction =
  //         switch (Random.int(6)) {
  //         | 0 => AddButton(true)
  //         | 1 => AddImage(true)
  //         | 2 => RemoveItem
  //         | 3 => RemoveItem
  //         | 4 => DecrementAllButtons
  //         | 5 => IncrementAllButtons
  //         | _ => assert(false)
  //         };
  //       dispatch(randomAction);
  //       HooksAnimation.Continue;
  //     };
  //   dispatch(SetAct(dispatch));
  //   HooksAnimation.setCallback(state.randomAnimation, ~callback);
  //   Some(() => HooksAnimation.stop(state.randomAnimation));
  // });
  let handleOnClick= R.useCallback(action => state.act(action));

  let button = (~repeat=1, ~hide=false, txt, action) =>
    hide
      ? React.null
      : <div
          className="exampleButton.large"
          style={ReactDOMRe.Style.make(~width="220px", ())}
          onClick={_e =>
            for (_ in 1 to repeat) {
              handleOnClick(action);
            }
          }>
          {React.string(txt)}
        </div>;
  let buttonDispatcher = (~repeat=1, ~hide=false, txt, action) =>
    hide
      ? React.null
      : <div
          className="exampleButton.large"
          style={ReactDOMRe.Style.make(~width="220px",~color="red", ())}
          onClick={_e =>
            for (_ in 1 to repeat) {
              state.act(action);
            }
          }>
          {React.string(txt)}
        </div>;
  let hide = showAllButtons;
  <div className="componentBox">
    <div className="componentColumn">
      {React.string("Control:")}
      <div
          className="exampleButton.large"
          style={ReactDOMRe.Style.make(~width="220px", ())}
          onClick={_e =>
            handleCloseAllButtons()
          }>
          {React.string("Close all the Buttons",)}
        </div>
      <div
          className="exampleButton.large"
          style={ReactDOMRe.Style.make(~width="220px", ())}
          onClick={_e =>
            handleIncrementAllButtons()
          }>
          {React.string("Click all the Buttons",)}
        </div>
      <div
          className="exampleButton.large"
          style={ReactDOMRe.Style.make(~width="220px", ())}
          onClick={_e =>
            handleDecrementAllButtons()
          }>
          {React.string("Unclick all the Buttons",)}
        </div>
      <div
          className="exampleButton.large"
          style={ReactDOMRe.Style.make(~width="220px", ())}
          onClick={_e =>
            handleAddSelf()
          }>
          {React.string("Add Self Callback",)}
        </div>
      <div
          className="exampleButton.large"
          style={ReactDOMRe.Style.make(~width="220px", ())}
          onClick={_e =>
            handleRemoveItem()
          }>
          {React.string("Remove Item CallBack",)}
        </div>
      <div
          className="exampleButton.large"
          style={ReactDOMRe.Style.make(~width="220px", ())}
          onClick={_e =>
            handleToggleRandomAnimation()
          }>
          {React.string("Random Animation "
         ++ (HooksAnimation.isActive(state.randomAnimation) ? "ON" : "OFF"))}
        </div>
      {button("Add Button", AddButton(true))}
      {button("Add Image", AddImage(true))}
      {button("Add Button On Top", AddButtonFirst(true))}
      {buttonDispatcher("Remove Item", RemoveItem)}
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
      {buttonDispatcher("Add Self", AddSelf)}
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
