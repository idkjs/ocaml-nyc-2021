/* See https://reasonml.github.io/reason-react/docs/en/counter.html for another possible way of doing this */
/* This is a stateful component. In ReasonReact, we call them reducer components */
/* A list of state transitions, to be used in self.send and reducer */
type action =
  | Tick;

/* The component's state type. It can be anything, including, commonly, being a record type */
type state = {count: int};

[@react.component]
let make = () => {
  let (state, dispatch) =
    React.useReducer(
      (state, action) =>
        switch (action) {
        | Tick => {count: state.count + 1}
        },
      {count: 0},
    );
  React.useEffect0(() => {
    let intervalId = Js.Global.setInterval(() => dispatch(Tick), 1000);
    Some(() => Js.Global.clearInterval(intervalId));
  });

  <div> {React.string(string_of_int(state.count))} </div>;
};
