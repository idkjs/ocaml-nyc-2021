// module SpringAnimation = HooksSpringAnimation
// module Spring = HooksSpring
// module Animation = HooksAnimation
// module RemoteAction = HooksRemoteAction

type t = {
  animation: HooksAnimation.t,
  mutable state: HooksSpring.state,
};

let create = initialValue => {
  let animation = HooksAnimation.create();
  let state = HooksSpring.createState(initialValue);
  {animation, state};
};

type onChange = float => unit;

let setOnChange =
    (
      ~preset=?,
      ~speedup=?,
      ~precision=?,
      ~onStop=None,
      ~onChange,
      ~finalValue=?,
      a,
    ) => {
  let callback =
    (.) => {
      a.state = HooksSpring.stepper(~preset?, ~speedup?, ~precision?, a.state);
      let isFinished = HooksSpring.isFinished(a.state);
      onChange(a.state.value);
      isFinished ? HooksAnimation.Stop(onStop) : Continue;
    };
  a.animation |> HooksAnimation.stop;
  a.animation |> HooksAnimation.setCallback(~callback);
  switch (finalValue) {
  | None => ()
  | Some(finalValue) =>
    a.state = {...a.state, finalValue};
    a.animation |> HooksAnimation.start;
  };
};

let setFinalValue = (finalValue, a) => {
  a.animation |> HooksAnimation.stop;
  a.state = {...a.state, finalValue};
  a.animation |> HooksAnimation.start;
};

let stop = a => a.animation |> HooksAnimation.stop;
