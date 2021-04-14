// module HooksSpringAnimation = HooksHooksSpringAnimation
// module Spring = HooksSpring
// module Animation = HooksAnimation
// module RemoteAction = HooksRemoteAction

let pxI = i => string_of_int(i) ++ "px";

let pxF = v => pxI(int_of_float(v));
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
    let (state, setState) =
      React.useState(() =>
        {
          animation: HooksSpringAnimation.create(smallWidth),
          width: int_of_float(smallWidth),
          size: Small,
          clickCount: 0,
          actionCount: 0,
        }
      );
    let (_, dispatch) =
      React.useReducer(
        (_, action) =>
          switch (action) {
          | Click =>
            setState(_ =>
              {
                ...state,
                clickCount: state.clickCount + 1,
                actionCount: state.actionCount + 1,
              }
            );
            state;
          | Reset =>
            setState(_ =>
              {...state, clickCount: 0, actionCount: state.actionCount + 1}
            );
            state;
          | Unclick =>
            setState(_ =>
              {
                ...state,
                clickCount: state.clickCount - 1,
                actionCount: state.actionCount + 1,
              }
            );
            state;
          | Width(width) =>
            setState(_ => {...state, width});
            state;
          | ToggleSize =>
            setState(_ =>
              {...state, size: state.size === Small ? Large : Small}
            );
            state;
          | Close =>
            state.animation
            |> HooksSpringAnimation.setOnChange(
                 ~finalValue=closeWidth,
                 ~speedup=0.3,
                 ~precision=10.,
                 ~onStop=onClose,
                 ~onChange=w =>
                 setState(_ => {...state, width: int_of_float(w)})
               );
            state;
          },
        state,
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

    let buttonLabel = state =>
      text
      ++ " clicks:"
      ++ string_of_int(state.clickCount)
      ++ " actions:"
      ++ string_of_int(state.actionCount);
    <div
      className="exampleButton large"
      onClick={_e => dispatch(Click)}
      style={ReactDOMRe.Style.make(~width=pxI(state.width), ())}>
      <Text text={buttonLabel(state)} />
    </div>;
  };


