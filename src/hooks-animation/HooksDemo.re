module SpringAnimation = HooksSpringAnimation
module RemoteAction = HooksRemoteAction
module GlobalState = {
  type state = {
    count1: int,
    count2: int,
    toggle: bool,
  };
  let initial = {count1: 0, count2: 0, toggle: false};
};

module Counter1 = {
  open GlobalState;
  [@react.component]
  let make = (~state, ~update)=> {

      <div>
        <button
          onClick=(_ => update(state => {...state, count1: state.count1 + 1}))>
          (React.string("+"))
        </button>
        <button
          onClick=(_ => update(state => {...state, count1: state.count1 - 1}))>
          (React.string("-"))
        </button>
        (React.string(" counter:" ++ string_of_int(state.count1)))
      </div>
  };
};

module Counter2 = {
  open GlobalState;
  [@react.component]
  let make = (~state, ~update)=> {

      <div>
        <button
          onClick=(_ => update(state => {...state, count2: state.count2 + 1}))>
          (React.string("+"))
        </button>
        <button
          onClick=(_ => update(state => {...state, count2: state.count2 - 1}))>
          (React.string("-"))
        </button>
        (React.string(" counter:" ++ string_of_int(state.count2)))
      </div>
  };
};

module Toggle = {
  open GlobalState;
  [@react.component]
  let make = (~state, ~update)=> {

      <div>
        <button
          onClick=(_ => update(state => {...state, toggle: !state.toggle}))>
          (React.string("Toggle"))
        </button>
        (React.string(" toggle:" ++ string_of_bool(state.toggle)))
      </div>
  };
};

module GlobalStateExample = {
  [@react.component]
  let make  = () => {

    let (state, dispatch) = React.useReducer((state,fn) => fn(state),GlobalState.initial);
      let update = foo => dispatch(foo);
      <div>
        <Counter1 state update />
        <Counter2 state update />
        <Counter2 state update />
        <Toggle state update />
      </div>;

  };
};

module LocalCounter = {
  type state = int;
  type action =
    | Incr
    | Decr;
  [@react.component]
  let make  = () => {

    let (state, dispatch) = React.useReducer((state,action) =>
      switch (action) {
      | Incr => state + 1
      | Decr => state - 1
      },0);
      <div>
        <button onClick=(_ => dispatch(Incr))>
          (React.string("+"))
        </button>
        <button onClick=(_ => dispatch(Decr))>
          (React.string("-"))
        </button>
        (React.string(" counter:" ++ string_of_int(state)))
      </div>
  };
};

module LocalToggle = {
  type state = bool;
  type action =
    | Toggle;
  [@react.component]
  let make  = () => {

    let (state, dispatch) = React.useReducer((state,action) =>
      switch (action) {
      | Toggle => !state
      },false);

      <div>
        <button onClick=(_ => dispatch(Toggle))>
          (React.string("Toggle"))
        </button>
        (React.string(" toggle:" ++ string_of_bool(state)))
      </div>
  };
};

module LocalStateExample = {
  [@react.component]
  let make  = () => {

      <div>
        <LocalCounter />
        <LocalCounter />
        <LocalCounter />
        <LocalToggle />
      </div>
  };
};

module TextInput = {
  type state = string;
  type action =
    | Text(string);

  let textOfEvent = e => e->ReactEvent.Form.target##value;
    [@react.component]
  let make = (~onChange=_ => (), ~showText=x => x, ~initial="")=> {

    let (state, dispatch) = React.useReducer((_state, action) =>
      switch (action) {
      | Text(text) => text
      },initial);

      <input
        value=(showText(state))
        onChange=(
          event => {
            let text = textOfEvent(event);
            dispatch(Text(text));
            onChange(text);
          }
        )
      />
  };
};

module Spring = {
  type state = {
    animation: SpringAnimation.t,
    value: float,
    target: float,
  };
  type action =
    | Click
    | Value(float);
  [@react.component]
  let make = (~renderValue)=> {

    let initialState = {
      animation: SpringAnimation.create(0.0),
      value: 0.0,
      target: 1.0,
    };
    let (state, dispatch) = React.useReducer((state,action) =>
      switch (action) {
      | Click =>
        let target = state.target == 0.0 ? 1.0 : 0.0;
        state.animation |> SpringAnimation.setFinalValue(target);
        {...state, target};
      | Value(value) => {...state, value}
      },initialState);
    React.useEffect0(() => {
      state.animation
      |> SpringAnimation.setOnChange(
           ~onChange=value => dispatch(Value(value)),
           ~finalValue=state.target,
         );
      Some(() => SpringAnimation.stop(state.animation));
    });


      <div>
        <button onClick=(_ => dispatch(Click))>
          (React.string("target: " ++ Js.Float.toString(state.target)))
        </button>
        <div> (renderValue(state.value)) </div>
      </div>
  };
};

module SimpleSpring = {
  let renderValue = value =>
    React.string(Printf.sprintf("value: %.3f", value));
  [@react.component]
  let make = () =><Spring renderValue />
};

module AnimatedTextInput = {
  let shrinkText = (~text, ~value) =>
    value >= 1.0 ?
      text :
      {
        let len = Js.Math.round(value *. float_of_int(String.length(text)));
        String.sub(text, 0, int_of_float(len));
      };
  let renderValue = value =>
    <TextInput
      showText=(text => shrinkText(~text, ~value))
      initial="edit this or click target"
    />;
  [@react.component]
  let make = () =><Spring renderValue />
  };



module TextInputRemote = {
  type state = string;
  type action =
    | Text(string)
    | Reset;

  let textOfEvent = e => e-> ReactEvent.Form.target##value;
  [@react.component]
  let make =
      (
        ~remoteAction,
        ~onChange=_ => (),
        ~showText=x => x,
        ~initial="",

      ) => {

let (state, dispatch) = React.useReducer((_state, action) =>
      switch (action) {
      | Text(text) => text
      | Reset => "the text has been reset"
      },initial);

    React.useEffect0(()=>{
      let token = RemoteAction.subscribe(~send=dispatch, remoteAction);
      let cleanup = () =>
        switch (token) {
        | Some(token) => RemoteAction.unsubscribe(token)
        | None => ()
        };
      Some(cleanup);
    });

      <input
        value=(showText(state))
        onChange=(
          event => {
            let text = textOfEvent(event);
            dispatch(Text(text));
            onChange(text);
          }
        )
      />
  };
};

module AnimatedTextInputRemote = {
  let shrinkText = (~text, ~value) =>
    value >= 1.0 ?
      text :
      {
        let len = Js.Math.round(value *. float_of_int(String.length(text)));
        String.sub(text, 0, int_of_float(len));
      };
  let remoteAction = RemoteAction.create();
  let renderValue = value =>
    <TextInputRemote
      remoteAction
      showText=(text => shrinkText(~text, ~value))
      initial="edit this or click target"
    />;
  [@react.component]
  let make  = () => {

      <div>
        <button
          onClick=(
            _ =>
              RemoteAction.send(remoteAction, ~action=TextInputRemote.Reset)
          )>
          (React.string("reset text"))
        </button>
        <div> (React.string("-----")) </div>
        <Spring renderValue />
      </div>
  };
};

module GrandChild = {
  type action =
    | Incr
    | Decr;
  [@react.component]
  let make = (~remoteAction, _) => {
   let (state, dispatch) = React.useReducer((state,action) =>
      switch (action) {
      | Incr => state + 1
      | Decr => state - 1
      },0);
    React.useEffect0(() => {
      let token = RemoteAction.subscribe(~send=dispatch, remoteAction);
      let cleanup = () =>
        switch (token) {
        | Some(token) => RemoteAction.unsubscribe(token)
        | None => ()
        };
      Some(cleanup);
    });

      <div>
        (React.string("in grandchild state: " ++ string_of_int(state)))
      </div>
  };
};

module Child = {
  [@react.component]
  let make = (~remoteAction, _) => {

      <div>
        (React.string("in child"))
        <GrandChild remoteAction />
      </div>
  };
};
module Parent = {
  [@react.component]
  let make = _ => {
    let state = RemoteAction.create();
    <div>
      <button
        onClick={_ => RemoteAction.send(state, ~action=GrandChild.Incr)}>
        {React.string("in parent")}
      </button>
      <Child remoteAction=state />
    </div>;
  };
};
// module Parent = {
//   [@react.component]
//   let make = _ => {

//     let (state, dispatch) = React.useReducer(((), RemoteAction.create()) => state);
//       <div>
//         <button
//           onClick=(_ => RemoteAction.send(state, ~action=GrandChild.Incr))>
//           (React.string("in parent"))
//         </button>
//         <Child remoteAction=state />
//       </div>
//   };
// };
