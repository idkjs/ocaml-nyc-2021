  include ImageTransition;

  module BL = Belt.List;
  type action =
    | SetAct(action => unit)
    | AddSelf
    | AddButton(bool)
    | AddButtonFirst(bool)
    | AddImage(bool)
    | DecrementAllButtons
    /* Remove from the list the button uniquely identified by its height HooksRemoteAction */
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

  type state = {
    act: action => unit,
    randomAnimation: HooksAnimation.t,
    items: list(item),
  };

  let initialState = () => {
    act: _action => (),
    randomAnimation: HooksAnimation.create(),
    items: [],
  };
  let getElements = ({items}) =>
    BL.toArray(BL.mapReverse(items, x => x.element));
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
  let runAll = (action, state) => {
    let performSideEffects = () =>
      BL.forEach(state.items, ({rActionButton}) =>
        HooksRemoteAction.send(rActionButton, ~action)
      );
    performSideEffects();
    // state;
  };
  // type grid = array(array(React.element));
  module Reducers = {
    let showButtons = (self, action, state): state =>
      switch (action) {
      | SetAct(act) => {...state, act}
      | AddSelf =>
        let key = Key.gen();
        let rActionButton = HooksRemoteAction.create();
        let rActionHeight = HooksRemoteAction.create();
        let element =
          <AnimateHeight key rAction=rActionHeight targetHeight=500.>
            {self(~key, ())}
          </AnimateHeight>;
        let item = {element, rActionButton, rActionHeight, closing: false};
        {...state, items: [item, ...state.items]};
      | AddButton(animateMount) =>
        let removeFromList = rActionHeight =>
          state.act(FilterOutItem(rActionHeight));
        {
          ...state,
          items: [
            createButton(
              ~removeFromList,
              ~animateMount,
              BL.length(state.items),
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
              createButton(
                ~removeFromList,
                ~animateMount,
                BL.length(state.items),
              ),
            ],
        };
      | AddImage(animateMount) => {
          ...state,
          items: [
            createImage(~animateMount, BL.length(state.items)),
            ...state.items,
          ],
        }
      | FilterOutItem(rAction) =>
        let filter = item => item.rActionHeight !== rAction;
        {...state, items: BL.keep(state.items, filter)};
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
        switch (BL.getBy(state.items, item => item.closing == false)) {
        | Some(firstItemNotClosing) =>
          let onBeginClosing = Some(() => firstItemNotClosing.closing = true);
          let onClose =
            Some(
              () =>
                state.act(FilterOutItem(firstItemNotClosing.rActionHeight)),
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
        let len = BL.length(state.items);
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
          BL.forEach(state.items, item =>
            HooksRemoteAction.send(
              item.rActionHeight,
              ~action=Close(Some(onClose)),
            )
          );
        iter();
        state;
      | OpenHeight(onStop) =>
        let len = BL.length(state.items);
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
          BL.forEach(state.items, item =>
            HooksRemoteAction.send(
              item.rActionHeight,
              ~action=Open(Some(onClose)),
            )
          );
        iter();
        state;
      | ReverseWithSideEffects(performSideEffects) =>
        {...state, items: BL.reverse(state.items)} |> ignore;
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
      };

    // let isPlaying = (self, action, _state) =>
    //   switch (action) {
    //   | Start => true
    //   | Stop => false
    //   | _ => self
    //   };

    // let startedAt = (self, action, _state) =>
    //   switch (action) {
    //   | Start => Some(Js.Date.now())
    //   | Stop => None
    //   | _ => self
    //   };

    // let ticks = (self, action, state) =>
    //   switch (action, state.isPlaying) {
    //   | (Reset, _) => 0
    //   | (Stop, _) => 0
    //   | (Tick, true) => self + 1
    //   | _ => self
    //   };

    // let frameRate = (self, action, state) =>
    //   switch (action, state.startedAt) {
    //   | (Stop, _) => 0
    //   | (Tick, Some(startedAt)) => UtiBl.avgFrameRate(state.ticks, startedAt)
    //   | _ => self
    //   };

    // let root = (state, action) => (grid(state.items, action, state),state);
    let root = (state, action) =>state
      // let s = showButtons(self, action, state);
      // {
      //   items: state.items,
      //   act: state.act,
      //   randomAnimation: state.randomAnimation,
      // };
  };

