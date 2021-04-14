module SpringAnimation = HooksSpringAnimation
// module Spring = HooksSpring
module Animation = HooksAnimation
let pxI = i => string_of_int(i) ++ "px";

let pxF = v => pxI(int_of_float(v));
/* When the closing animation begins */
type onBeginClosing = Animation.onStop;
type action =
  | Open(Animation.onStop)
  | BeginClosing(onBeginClosing, Animation.onStop)
  | Close(Animation.onStop)
  | Animate(float, Animation.onStop)
  | Height(float);
type state = {
  height: float,
  animation: SpringAnimation.t,
};
[@react.component]
let make = (~rAction, ~targetHeight, ~children: React.element) => {
  let (state, setState) =
    React.useState(() =>
      {height: 0., animation: SpringAnimation.create(0.)}
    );

  let animate = (finalValue, onStop) =>
    state.animation
    |> SpringAnimation.setOnChange(
         ~finalValue, ~precision=10., ~onStop, ~onChange=h =>
         setState(_ => {...state, height: h})
       );
  let (_, dispatch) =
    React.useReducer(
      (_, action) =>
        switch (action) {
        | Height(v) =>
          setState(_ => {...state, height: v});
          state;
        | Animate(finalValue, onStop) =>
          animate(finalValue, onStop);
          state;
        | Close(onClose) =>
          animate(0., onClose);
          state;
        | BeginClosing(onBeginClosing, onClose) =>
          switch (onBeginClosing) {
          | None => ()
          | Some(f) => f()
          };
          animate(0., onClose);
          state;
        | Open(onOpen) =>
          animate(targetHeight, onOpen);
          state;
        },
      {
        state;
      },
    );

  React.useEffect1(
    () => {
      HooksRemoteAction.subscribe(~send=dispatch, rAction) |> ignore;

      Some(() => dispatch(Animate(targetHeight, None)));
    },
    [|state|],
  );

  <div
    style={ReactDOMRe.Style.make(
      ~height=pxF(state.height),
      ~overflow="hidden",
      (),
    )}>
    children
  </div>;
};
