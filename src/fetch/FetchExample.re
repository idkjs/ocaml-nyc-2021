/* The new stdlib additions */
open Belt;

type dog = string;

type state =
  | Loading
  | Error
  | Loaded(array(dog));

type action =
  | DogsFetch
  | DogsFetched(array(dog))
  | DogsFailedToFetch;

module Decode = {
  let dogs = (json): array(dog) =>
    Json.Decode.(
      json |> field("message", array(string)) |> Array.map(_, dog => dog)
    );
};

[@react.component]
let make = () => {
  let (state, dispatch) =
    React.useReducer(
      (_state, action) =>
        switch (action) {
        | DogsFetch => Loading

        | DogsFetched(dogs) => Loaded(dogs)
        | DogsFailedToFetch => Error
        },
      Loading,
    );
  let dogsFetch = () =>
    Js.Promise.(
      Fetch.fetch("https://dog.ceo/api/breeds/list")
      |> then_(Fetch.Response.json)
      |> then_(json =>
           json
           |> Decode.dogs
           |> (dogs => dispatch(DogsFetched(dogs)))
           |> resolve
         )
      |> catch(_err => Js.Promise.resolve(dispatch(DogsFailedToFetch)))
      |> ignore
    );
  React.useEffect0(() => {
    dogsFetch() |> ignore;
    dispatch(DogsFetch);
    None;
  });

  switch (state) {
  | Error => <div> {React.string("An error occurred!")} </div>
  | Loading => <div> {React.string("Loading...")} </div>
  | Loaded(dogs) =>
    <div>
      <h1> {React.string("Dogs")} </h1>
      <p> {React.string("Source: ")} </p>
      <a href="https://dog.ceo"> {React.string("https://dog.ceo")} </a>
      <ul>
        {Array.map(dogs, dog => <li key=dog> {React.string(dog)} </li>)
         |> React.array}
      </ul>
    </div>
  };
};
